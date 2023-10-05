
import json
import requests
# import voiceactors as VA
# import opartist as OP
import time
import pyodbc

# myList = VA.VoiceActorsWrapper()
# masterList = VA.VoiceActorsWrapper()
# MasterOPs = OP.ArtistsList()
# myList.OPs = OP.ArtistsList()
CLIENT_ID = '5dbcd29b3178e6d62ec7ecf17b4daf56'

conn = pyodbc.connect('Driver={SQL Server};'
                      'Server=ALEXPC\SQLEXPRESS;'
                      'Database=VADatabase;'
                      'Trusted_Connection=yes;')

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


def topList() :
    num = input("Top x = ")
    print("Fetching top ", num, " anime...")
    url = 'https://api.myanimelist.net/v2/anime/ranking?ranking_type=all&fields={title,related_anime,id,popularity,alternative_titles=en}&limit=' + num
    response = requests.get(url, headers = {
        'X-MAL-CLIENT-ID': CLIENT_ID
    })

    response.raise_for_status()
    anime = response.json()
    print("anime")

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



# scrape page of show for characters
# only called if new entry in DB
def vaParse(showID, token, title, imgS) :
    print("parsing")
    # first check master to save API calls
    url = 'https://api.jikan.moe/v4/anime/' + str(showID) + '/characters'
    trying = True
    attempts = 0
    while trying :
        try :
            print ("vaParse, fetching ", title)
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
            char = rename(character["character"]["name"])
            img = character["character"]["images"]["jpg"]["image_url"]
            charID = character["character"]["mal_id"]
            favs = character["favorites"]
            for voice in character["voice_actors"] :
                if voice["language"] == 'Japanese' :
                    actor = voice["person"]["name"]
                    actorID = voice["person"]["mal_id"]

                    cursor.execute(f'SELECT * FROM Actors WHERE ActorID = {actorID}')
                    res = cursor.fetchall()

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
                        
                        query = f''' INSERT INTO Actors(ActorID, ActorName, aFavs, ImageURL)
                                            VALUES ({actorID}, \'{noQuote(rename(actor))}\', {aFavs}, \'{img}\')'''
                        cursor.execute(query)
                        conn.commit()
                       
                        # myList.actorIDs.append(actorID)
                        # entry = VA.Actor(VA.rename(actor), actorID, aFavs)
                        # entry.roles.append(VA.Role(char, title, img, charID, favs, showID))
                        # entry.charIDs.append(charID)
                        # myList.actors[actorID] = entry
                        # currShow.actors.append(entry)
                        
                        actorResponse.close()
                    
                    query = f''' INSERT INTO Roles(CharID, CharName, Favorites, CharImg, ActorID, ShowID)
                                            VALUES ({charID}, \'{noQuote(char)}\', {favs}, \'{img}\', {actorID}, {showID})'''
                    cursor.execute(query)
                    conn.commit()
                    # else :
                    #     print("Already have actor for: ", char)
                    #     # if actor is already in the myList append char to their list
                    #     currActor = myList.actors[actorID]
                    #     if charID not in currActor.charIDs :
                    #         currActor.roles.append(VA.Role(char, title, img, charID, favs, showID))
                    #         currActor.charIDs.append(charID)
                    #         currShow.actors.append(currActor)
            # myList.characters.append(char)
        except Exception as err:
            print(f"Unexpected {err=}, {type(err)=}, {query} ")
    # myList.shows[showID] = currShow
    # return currShow

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

# makeList()
topList()

addShowFavs()

fixActorImg()

f.close()

# print(noQuote("house's"))







# def search(self) :
#     print("Searching Show: ", showA.get())
#     searchURL = 'https://api.jikan.moe/v4/anime?q=' + showA.get()
#     response = requests.get(searchURL, headers = {
#         'X-MAL-CLIENT-ID': CLIENT_ID
#         })
#     response.raise_for_status()
#     global animeSearch
#     animeSearch = response.json()

#     for i in animeSearch["data"] :
#         if i["title_english"] != None :
#             currAnime = i["title_english"]
#         else :
#             currAnime = i["title"]
#         # searchResult.set(currAnime)
#     # if there are any search results
#     if len(animeSearch["data"]) > 0 :
#         setPrompt()
#     else :
#         resetPrompt()
#         nosuch.grid(padx = 150, pady = 100)
#     response.close()


# def characterSearch(char) :
#     print("Searching Character: ", char)
#     charURL = 'https://api.jikan.moe/v4/characters?q=' + char
#     response = requests.get(charURL, headers = {
#         'X-MAL-CLIENT-ID': CLIENT_ID
#         })
#     response.raise_for_status()
#     charSearch = response.json()

#     options.delete(0, 'end')
#     for i in charSearch["data"] :
#         curr = i["name"]
#         charID = i["mal_id"]
#         actorIDs = []
#         ############### add try timer
#         trying = True
#         attempts = 0
        
#         while trying :
#             try :
#                 print("Getting show info for each character")
#                 charAnimeURL = 'https://api.jikan.moe/v4/characters/' + str(charID) + '/full'
#                 response2 = requests.get(charAnimeURL, headers = {
#                     'X-MAL-CLIENT-ID': CLIENT_ID
#                     })
#                 response2.raise_for_status()
#                 charAnimeResults = response2.json()
#             except :
#                 # print("Exception at gui.vaParse")
#                 if attempts == 20 :
#                     trying = False
#                 else :
#                     time.sleep(0.1)
#                 attempts+= 1
#             else :
#                 trying = False
#                 success = True
#         if success :
#             currTitle = charAnimeResults["data"]["anime"][0]["anime"]["title"]
#             options.insert('end', curr + " from " + currTitle)
#             for g in charAnimeResults["data"]["voices"] :
#                 if g["language"] == "Japanese" :
#                     actorIDs.append(g["person"]["mal_id"])
#     # if there are any search results
#     if len(charSearch["data"]) > 0 :
#         setCharPrompt()
#     else :
#         resetPrompt()
#         nosuch.grid(padx = 10)
#     response.close()



def addShow() :
    # parse the show if not in list already
    tempID = animeSearch["data"][index]["mal_id"]
    tempImg = animeSearch["data"][index]["images"]["jpg"]["image_url"]
    tempTitle = options.get(index)
    if tempID not in myList.showIDs :
        showAdded = vaParse(tempID, CLIENT_ID, tempTitle, tempImg)
        # print("adding")
        myList.titles.append(tempTitle)
        myList.showIDs.append(tempID)
        myString = "Added: " + tempTitle
        addVar.set(myString)
        added.grid(padx = 150, pady = 100)
    else :
        already.pack(padx = 10)
        return
    # print (myList.actors)
    # print (OPList)
    return showAdded

def favFunc(e) :
    return e.fav
