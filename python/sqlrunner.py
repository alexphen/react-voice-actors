
import json
import requests
import time
import oracledb
from PIL import Image
import urllib.request
from decouple import config

CLIENT_ID = config('MAL_CLIENT_ID')
CLIENT_SECRET = config('MAL_CLIENT_SECRET')

# conn = pyodbc.connect('Driver={SQL Server};'
#                       'Server=ALEXPC\SQLEXPRESS;'
#                       'Database=VADatabase;'
#                       'Trusted_Connection=yes;')

# user: 'ADMIN',
#     // password: 'loonSQLserver1',
connectString = '''(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)
                    (port=1521)(host=adb.us-ashburn-1.oraclecloud.com))
                    (connect_data=(service_name=g1e4482f6c79339_id7iztfouvg8omj1_medium.adb.oraclecloud.com))
                    (security=(ssl_server_dn_match=yes)))'''

conn = oracledb.connect(
    user='ADMIN',
    password='loonSQLserver1',
    dsn=connectString
)

# conn = pyodbc.connect('DRIVER={Devart ODBC Driver for Oracle};'
#                     'Direct=True;'
#                     'Host=myhost;'
#                     'Service Name=myservicename;'
#                     'User ID=myuserid;'
#                     'Password=mypassword')

cursor = conn.cursor()

# user = ("RufusPeanut") ################
# user = user.get()


f = open("log.txt", "w", encoding="utf8")


def sortByFav() :
    global myList
    myList.actors = sorted(myList.actors.items(), key=lambda x:x[1].favs, reverse=True)

# reorder to name without comma
def rename(char) :
    if ',' in char :
        index = char.index(',')
        char = char[index+2:] + " " + char[:index]
    return char

def noQuote(str) :
    res = str.replace("'", "''")
    res2 = res.replace('"', '"')
    return res2

def makeList() :
    user = input("Enter Username: ")
    print("Fetching user anime list: ", user)
    url = 'https://api.myanimelist.net/v2/users/' + user + '/animelist?fields={title,related_anime,id,popularity,alternative_titles=en}&limit=1000'
    response = requests.get(url, headers = {
        'X-MAL-CLIENT-ID': CLIENT_ID
    })

    response.raise_for_status()
    anime = response.json()

    total = len(anime["data"])
    count = 1
    starttime = time.localtime()

    # scrape user anime list, calls vaParse for each show
    while True :
        # loop thru current page. print english title if available
        for entry in anime["data"]:
            # print(entry["node"])
            if entry["node"]["alternative_titles"]["en"] == "" :
                title = entry["node"]["title"]
            else :
                title = entry["node"]["alternative_titles"]["en"]
            img = entry["node"]["main_picture"]["medium"]
            # if id is not yet in myList, append
            id = entry["node"]["id"]
            popularity = entry["node"]["popularity"]
            cursor.execute('SELECT * FROM Anime WHERE ShowID = ' + str(id))
            # for i in cursor :
            #     print(i)
            res = cursor.fetchall()
            if not res :
                print('Adding ' + title)
                cursor.execute(f'''INSERT INTO Anime(ShowID, Title, ImageURL, Popularity)
                                   VALUES ({id}, \'{noQuote(title)}\', \'{img}\', {popularity})''')
                f.write(f'Added {title}\n\n')
                vaParse(id, CLIENT_ID, title, img)
            else :
                print(title + ' Already in List')
                f.write(f'{title} already found in DB: {res}\n\n')
            
            print("(" + str(count) + "/" + str(total) + ") " + title)
            count += 1
        # if there is a next page, continue loop with that page as the new url
        if "next" in anime["paging"] :
            url = anime["paging"]["next"]
            response = requests.get(url, headers = {
                'X-MAL-CLIENT-ID': CLIENT_ID
                })
            response.raise_for_status()
            anime = response.json()
        else :
            break
    response.close()
    # f.close()
    endtime = time.localtime()
    duration = time.mktime(endtime) - time.mktime(starttime)
    print ("Completed in: " + str(duration) + " seconds")

# add top x anime to the list
def topList() :
    max = input("Top x = ")
    print("Fetching top ", max, " anime...")
    url = 'https://api.myanimelist.net/v2/anime/ranking?ranking_type=all&fields={title,related_anime,id,popularity,alternative_titles=en}&limit=' + max
    response = requests.get(url, headers = {
        'X-MAL-CLIENT-ID': CLIENT_ID
    })

    response.raise_for_status()
    anime = response.json()

    total = len(anime["data"])
    count = 1
    starttime = time.localtime()

    # scrape user anime list, calls vaParse for each show
    while count < int(max) + 1 :
        # loop thru current page. print english title if available
        for entry in anime["data"]:
            # print(entry["node"])
            if entry["node"]["alternative_titles"]["en"] == "" :
                title = entry["node"]["title"]
            else :
                title = entry["node"]["alternative_titles"]["en"]
            img = entry["node"]["main_picture"]["medium"]
            id = entry["node"]["id"]
            popularity = entry["node"]["popularity"]
            cursor.execute('SELECT * FROM Anime WHERE ShowID = ' + str(id))
            # for i in cursor :
            #     print(i)
            res = cursor.fetchall()
            print(res)
            # if id is not yet in myList, append
            if not res :
                print('Adding ' + title)
                cursor.execute(f'''INSERT INTO Anime(ShowID, Title, ImageURL, Popularity)
                                   VALUES ({id}, \'{noQuote(title)}\', \'{img}\', {popularity})''')
                conn.commit()
                f.write(f'Added {title}\n\n')
                vaParse(id, CLIENT_ID, title, img)
            else :
                print(title + ' Already in List')
                f.write(f'{title} already found in DB: {res}\n\n')
            
            print("(" + str(count) + "/" + str(total) + ") " + title)
            count += 1
        # if there is a next page, continue loop with that page as the new url
        if "next" in anime["paging"] :
            url = anime["paging"]["next"]
            response = requests.get(url, headers = {
                'X-MAL-CLIENT-ID': CLIENT_ID
                })
            response.raise_for_status()
            anime = response.json()
        else :
            break
    response.close()
    # f.close()
    endtime = time.localtime()
    duration = time.mktime(endtime) - time.mktime(starttime)
    print ("Completed in: " + str(duration) + " seconds")

# parses all shows even if in list already
def topListUpdate(start, max) :
    if not start : start = input("Start from ")
    if not max : max = input("Up to ")
    # max = input("Top x = ")
    print("Fetching top ", max, " anime...")

    url = 'https://api.myanimelist.net/v2/anime/ranking?ranking_type=all&fields={title,related_anime,id,popularity,alternative_titles=en}'#&limit=5'# + str(max)
   
    # trying = True
    # attempts = 0
    # while trying :
    #     try :
    #         response = requests.get(url, headers = {
    #             'X-MAL-CLIENT-ID': token
    #             })
    #         response.raise_for_status()
    #         anime = response.json()
    #         response.close()
    #     except :
    #         # print("Exception at gui.vaParse")
    #         if attempts == 20 :
    #             anime = dict()
    #             trying = False
    #         else :
    #             time.sleep(0.1)
    #         attempts+= 1
    #     else :
    #         trying = False

    response = requests.get(url, headers = {
        'X-MAL-CLIENT-ID': CLIENT_ID
    })

    response.raise_for_status()
    anime = response.json()

    # total = len(anime["data"])
    count = 1
    starttime = time.localtime()

    # collect data on each entry, calls vaParse
    while count < int(max) + 1 :
        if count >= int(start) :
        # loop thru current page. print english title if available
            for entry in anime["data"]:
                # use english title if exists
                if entry["node"]["alternative_titles"]["en"] == "" :
                    title = entry["node"]["title"]
                else :
                    title = entry["node"]["alternative_titles"]["en"]
                img = entry["node"]["main_picture"]["medium"]
                id = entry["node"]["id"]
                popularity = entry["node"]["popularity"]

                cursor.execute('SELECT * FROM Anime WHERE ShowID = ' + str(id))
                # for i in cursor :
                #     print(i)
                res = cursor.fetchall()
                # print(res)
                # if no entries yet under this id
                if not res :
                    print('Adding ' + title)
                    cursor.execute(f'''INSERT INTO Anime(ShowID, Title, ImageURL, Popularity)
                                    VALUES ({id}, \'{noQuote(title)}\', \'{img}\', {popularity})''')
                    conn.commit()
                    f.write(f'Added {title}\n\n')
                else :
                    print(title + ' Already in List')
                    f.write(f'{title} already found in DB: {res}\n\n')
                
                vaParse(id, CLIENT_ID, title, img)
                print("(" + str(count) + "/" + str(max) + ") " + title)
                count += 1
        else :
            count += 1
        # if there is a next page, continue loop with that page as the new url
        if "next" in anime["paging"] :
            url = anime["paging"]["next"]
            response = requests.get(url, headers = {
                'X-MAL-CLIENT-ID': CLIENT_ID
                })
            response.raise_for_status()
            anime = response.json()
        else :
            break
    response.close()
    # f.close()
    endtime = time.localtime()
    duration = time.mktime(endtime) - time.mktime(starttime)
    print ("Completed in: " + str(duration) + " seconds")



# scrape page of show for characters
# only called if new entry in DB
def vaParse(showID, token, title, imgS) :
    print("parsing " + title)
    # first check master to save API calls
    url = 'https://api.jikan.moe/v4/anime/' + str(showID) + '/characters'

    cursor.execute('SELECT CharID, ActorID FROM Roles WHERE ShowID = ' + str(showID))
    roles = cursor.fetchall()
    # for i in roles :
    #     print(type(i[0]))
    # print(roles)
    query = ""

    trying = True
    attempts = 0
    while trying :
        try :
            response = requests.get(url, headers = {
                'X-MAL-CLIENT-ID': token
                })
            response.raise_for_status()
            anime = response.json()
            response.close()
        except :
            # print("Exception at gui.vaParse")
            if attempts == 20 :
                anime = dict()
                trying = False
            else :
                time.sleep(0.1)
            attempts+= 1
        else :
            trying = False
    # currShow = VA.Show(title, imgS, showID)

    for character in anime["data"] :
        try :
            charID = character["character"]["mal_id"]
            char = rename(character["character"]["name"])
            img = character["character"]["images"]["jpg"]["image_url"]
            favs = character["favorites"]
            for voice in character["voice_actors"] :
                if voice["language"] == 'Japanese' :
                    actor = voice["person"]["name"]
                    actorID = voice["person"]["mal_id"]
                    # if char/actor combo already in list, only update favorites and img
                    if (charID, actorID) in roles : 
                        query = f'''UPDATE Roles
                                        SET Favorites = {favs},
                                            CharImg   = '{img}'
                                        WHERE CharID  = {charID}'''
                        cursor.execute(query)
                        conn.commit()
                    
                    # add new characters and/or actors
                    else :
                        cursor.execute(f'SELECT * FROM Actors WHERE ActorID = {actorID}')
                        res = cursor.fetchall()

                        # if actor is not in the list yet
                        if not res :
                            url = 'https://api.jikan.moe/v4/people/' + str(actorID)
                            trying = True
                            failed = False
                            attempts = 0
                            while trying :
                                try :
                                    print ("Actor info for: ", char)
                                    actorResponse = requests.get(url, headers = {
                                        'X-MAL-CLIENT-ID': token
                                        })
                                    actorResponse.raise_for_status()
                                    actorJSON = actorResponse.json()
                                except :
                                    # print("Exception at gui.vaParse")
                                    if attempts == 20 :
                                        actorJSON = dict()
                                        trying = False
                                        failed = True
                                        print ("Too Many Attempts")
                                    else :
                                        time.sleep(0.1)
                                    attempts+= 1
                                else :
                                    trying = False
                            
                            if not failed :
                                try :
                                    aFavs = actorJSON["data"]["favorites"]  
                                except :
                                    print(actorJSON)
                            
                            query = f'''INSERT INTO Actors(ActorID, ActorName, aFavs, ImageURL)
                                                VALUES ({actorID}, \'{noQuote(rename(actor))}\', {aFavs}, \'{img}\')'''
                            f.write(f'inserted {actor}\n')
                            cursor.execute(query)
                            conn.commit()
                        
                            actorResponse.close()
                    
                        # add character
                        query = f''' INSERT INTO Roles(CharID, CharName, Favorites, CharImg, ActorID, ShowID)
                                                VALUES ({charID}, \'{noQuote(char)}\', {favs}, \'{img}\', {actorID}, {showID})'''
                        f.write(f'inserted {char}\n')
                        print(f'added new character {char}')
                        cursor.execute(query)
                        conn.commit()

        except Exception as err:
            print(f"Unexpected {err=}, {type(err)=}, {query} ")

def addShowFavs() :
    cursor.execute('''SELECT ShowID FROM Anime
                    WHERE Popularity IS NULL
                    AND ShowID > 0''')
    data = cursor.fetchall()
    # print(len(data))
    for i in data :
        curr = str(i)
        curr = curr[curr.index('(')+1:curr.index(',')]
        url = 'https://api.jikan.moe/v4/anime/' + curr
        # url = 'https://api.myanimelist.net/v2/anime/' + curr + '?fields=popularity'
        trying = True
        attempts = 0

        # response = requests.get(url, headers = {
        #     'X-MAL-CLIENT-ID': CLIENT_ID
        # })
        # response.raise_for_status()
        # anime = response.json()
        # res = int(anime["data"]["popularity"])
        # print(anime["data"]["title"], res) 


        while trying :
            try :
                response = requests.get(url, headers = {
                    'X-MAL-CLIENT-ID': CLIENT_ID
                })
                response.raise_for_status()
                anime = response.json()
                res = int(anime["data"]["popularity"])
                print(anime["data"]["title"], res)  
                cursor.execute(f'''UPDATE Anime
                                    SET Popularity = {res}
                                    WHERE ShowID = {int(curr)};''')
                conn.commit()
            except :
                # print("Exception at gui.vaParse")
                if attempts == 20 :
                    trying = False
                    # res = 99999
                    print ("Too Many Attempts on ", curr)
                else :
                    time.sleep(.1)
                attempts+= 1
            else :
                trying = False
            
            




    
    # print(res)

    # url = 'https://api.myanimelist.net/v2/users/' + user + '/animelist?fields={title,related_anime,id,alternative_titles=en}&limit=1000'
    # response = requests.get(url, headers = {
    #     'X-MAL-CLIENT-ID': CLIENT_ID
    # })
    # response.raise_for_status()
    # anime = response.json()
    # cursor.execute(f'''INSERT INTO Anime(ShowFavs)
    #                                VALUES({})''')
    # f.write(f'Added {title}\n\n')

def updateCharImgs() :

    cursor.execute('''SELECT CharID, CharImg, CharName, Favorites FROM Roles
                        ORDER BY Favorites DESC''')
    res = cursor.fetchall()
    for i in res :
        trying = True
        attempts = 0
        url = f'''https://api.jikan.moe/v4/characters/{i[0]}'''
        while trying :
            try :
                response = requests.get(url, headers = {
                    'X-MAL-CLIENT-ID': CLIENT_ID
                    })
                response.raise_for_status()
                character = response.json()
                response.close()
            except :
                # print("Exception at gui.vaParse")
                if attempts == 20 :
                    character = dict()
                    trying = False
                else :
                    time.sleep(0.1)
                attempts+= 1
            else :
                trying = False
        
        imgurl = character["data"]["images"]["jpg"]["image_url"]
        # print(imgurl)
        if i[1] != imgurl :
            cursor.execute(f'''UPDATE Roles
                                Set CharImg = '{imgurl}'
                                WHERE CharID = {i[0]}''')
            conn.commit()
            print(f'''updated {i[2]}'s img''')

# checks for error 404
def fixCharImgs() :
    cursor.execute('''SELECT CharID, CharImg, CharName, Roles.ShowID, Anime.Title, Roles.Favorites FROM Roles
                        INNER JOIN Anime ON Anime.ShowID=Roles.ShowID
                        ORDER BY Favorites DESC''')
    res = cursor.fetchall()
    for i in res :
        response = requests.get(i[1])
        # print (response.status_code)
        if (response.status_code == 404) :
            print ('404', i[2], i[4])
            url = f'''https://api.jikan.moe/v4/characters/{i[0]}/pictures'''
            trying = True
            attempts = 0
            while trying :
                try :
                    response = requests.get(url, headers = {
                        'X-MAL-CLIENT-ID': CLIENT_ID
                        })
                    response.raise_for_status()
                    character = response.json()
                    response.close()
                except :
                    # print("Exception at gui.vaParse")
                    if attempts == 20 :
                        character = dict()
                        trying = False
                    else :
                        time.sleep(0.1)
                    attempts+= 1
                else :
                    trying = False
            num = 0
            while True :
                curr = character["data"][num]["jpg"]["image_url"]
                if (requests.get(curr).status_code == 200) :
                    cursor.execute(f'''UPDATE Roles
                                Set CharImg = '{curr}'
                                WHERE CharID = {i[0]}''')
                    conn.commit()
                    print(f'''updated {i[2]}'s img''')
                    break
                else :
                    num =+ 1
        

def fixActorImg() :
    cursor.execute('''SELECT ActorID FROM Actors
                    WHERE ImageURL LIKE '%character%' ''')
    data = cursor.fetchall()
    # print(data)
    for i in data :
        curr = str(i)
        curr = curr[curr.index('(')+1:curr.index(',')]
        url = 'https://api.jikan.moe/v4/people/' + curr + '/pictures'
        trying = True
        attempts = 0

        while trying :
            try :
                response = requests.get(url, headers = {
                    'X-MAL-CLIENT-ID': CLIENT_ID
                })
                response.raise_for_status()
                actor = response.json()
                res = actor["data"][0]["jpg"]["image_url"]
                print("curr", curr, "res", res)
                cursor.execute(f'''UPDATE Actors
                            SET ImageURL = '{res}'
                            WHERE ActorID = {int(curr)};''')
                conn.commit()
            except :
                # print("Exception at gui.vaParse")
                if attempts == 20 :
                    trying = False
                    print ("Too Many Attempts on ", curr)
                else :
                    time.sleep(.1)
                attempts+= 1
            else :
                trying = False



# RUNNERS


# makeList()

# topList()

topListUpdate(1,2000)

# addShowFavs()

# fixActorImg()

# f.close()

# updateCharImgs()

# print(noQuote("house's"))

# fixCharImgs()

# cursor.execute(f'''UPDATE Roles
#                     Set CharImg = 'https://cdn.myanimelist.net/images/characters/15/339171.jpg'
#                     WHERE CharID = 45627''')
# conn.commit()


# url = f'''https://api.jikan.moe/v4/characters/46494/pictures'''
# response = requests.get(url, headers = {
#     'X-MAL-CLIENT-ID': CLIENT_ID
# })
# response.raise_for_status()
# character = response.json()
# response.close()

# print(character["data"][0]["jpg"]["image_url"])



# cursor.execute('SELECT CharID, CharImg FROM Roles WHERE CharID = 79513')
# res = cursor.fetchall()
# print(res)


# Manually Update Images
# cursor.execute('''SELECT Roles.CharID, Roles.CharImg, Roles.CharName, Roles.ShowID, Anime.Title FROM Roles
#                   INNER JOIN Anime on Anime.ShowID=Roles.ShowID
#                         WHERE LOWER(Anime.Title) LIKE \'%bakemono%\'''')
# res = cursor.fetchall()
# for i in res :
#     trying = True
#     attempts = 0
#     url = f'''https://api.jikan.moe/v4/characters/{i[0]}'''
#     while trying :
#         try :
#             response = requests.get(url, headers = {
#                 'X-MAL-CLIENT-ID': CLIENT_ID
#                 })
#             response.raise_for_status()
#             character = response.json()
#             response.close()
#         except :
#             # print("Exception at gui.vaParse")
#             if attempts == 20 :
#                 character = dict()
#                 trying = False
#             else :
#                 time.sleep(0.1)
#             attempts+= 1
#         else :
#             trying = False
    
#     imgurl = character["data"]["images"]["jpg"]["image_url"]
#     # print(imgurl)
#     if i[1] != imgurl :
#         cursor.execute(f'''UPDATE Roles
#                             Set CharImg = '{imgurl}'
#                             WHERE CharID = {i[0]}''')
#         conn.commit()
#         print(f'''updated {i[2]}'s img''')