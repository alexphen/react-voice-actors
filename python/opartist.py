import requests
import json
import time
import voiceactors as VA

CLIENT_ID = '5dbcd29b3178e6d62ec7ecf17b4daf56'

class ArtistsList() :
    def __init__(self) :
        self.artists = dict()

    def __str__(self) -> str:
        res = ""
        for i in self.artists :
            res += str(self.artists[i]) + "\n"
        return res

class OPArtist() :
    def __init__(self, n, id) :
        self.name = n
        self.id = id
        self.OPShowIDs = []
        self.performances = []
    
    def __str__(self) -> str:
        res = self.name + "\n"
        for i in self.performances :
            res += "    " + i + "\n"
        return res

def getMALName(name) :
    trying = True
    attempts = 0
    while trying :
        try :
            artistURL = 'https://api.jikan.moe/v4/people?q=' + name
            responseArtist = requests.get(artistURL, headers = {
                'X-MAL-CLIENT-ID': CLIENT_ID
                })
            responseArtist.raise_for_status()
            detailsArtist = responseArtist.json()
            MALName = detailsArtist["data"][0]["name"]
            MALID = detailsArtist["data"][0]["mal_id"]
        except :
            # print("Exception at opartist.getMALName")
            if attempts == 1 :
                MALName = name
                MALID = -1
                trying = False
            else :
                time.sleep(1)
            attempts+= 1
        else :
            trying = False
        
    return MALName, MALID


def parseThemes(entry, show, showID, artList, OPIDs, f) :
    for i in entry :
        try :
            flag = i.index('\"')
            title = i[flag + 1:i.index('\"', flag + 2)]
        except :
            title = i[:i.index('by') - 3]
        if '(eps' in i :
            name = i[i.index('by') + 3:i.index('(eps') - 1]
        else :
            name = i[i.index('by') + 3:]
        
        MALinfo = getMALName(name)
        MALName = MALinfo[0]
        MALID = MALinfo[1]

        # f.write(title + '/\\' + str(showID) + '/\\' + MALName + '/\\' + str(MALID) + '\n')
        # print(title, '/\\', showID, '/\\', MALName, '/\\', MALID, '\n')

        if MALID not in OPIDs :
            temp = OPArtist(MALName, MALID)
            artList.artists[MALName] = temp
            OPIDs.append(MALID)
            show.OPs[MALName] = []
            show.OPs[MALName].append(temp)
        else :
            temp = artList.artists.get(MALName)

        temp.performances.append(show.title + ": " + title)
        temp.OPShowIDs.append(showID)


def OPArtists(showID, show, artList, f) :
    staffURL = 'https://api.jikan.moe/v4/anime/' + str(showID) + '/full'

    trying = True
    attempts = 0
    while trying :
        try :
            response = requests.get(staffURL, headers = {
                'X-MAL-CLIENT-ID': CLIENT_ID
                })

            response.raise_for_status()
            details = response.json()
        except :
            # print("Exception at opartist.OPArtists")
            if attempts == 10 :
                details = []
                trying = False
            else :
                time.sleep(0.1)
            attempts+= 1
        else :
            trying = False

            OPIDs = []

            parseThemes(details["data"]["theme"]["openings"], show, showID, artList, OPIDs, f)
            parseThemes(details["data"]["theme"]["endings"], show, showID, artList, OPIDs, f)
    

masterList = VA.VoiceActorsWrapper()
MasterOPs = ArtistsList()

master_string = None
# try :
MASTER_PATH = 'react-voice-actors\src\data\MasterV3.json'
master_json = open(MASTER_PATH, 'r', encoding='utf8')
master_string = master_json.read()
parsed_master = json.loads(master_string)
masterList.shows = parsed_master["shows"]

# for i in parsed_master["OPs"]["artists"] :
#     # curr = i
#     temp = OPArtist(parsed_master["OPs"]["artists"][i]["name"])
#     temp.showIDs = parsed_master["OPs"]["artists"][i]["OPShowIDs"]
#     MasterOPs.artists[i] = temp

master_json.close()

# except Exception as err:
    # print(f"Unexpected {err=}, {type(err)=}")
    # print("err at master")


f = open('tempOPs.csv', 'w', encoding='utf8')

for i in parsed_master["shows"] :
    curr = parsed_master["shows"][i]
    OPArtists(curr["showID"], curr["title"], MasterOPs, f)
    # row = curr["title"] + '/\\' + str(curr["showID"]) + '/\\' + curr["MALName"] + '/\\' + str(curr["MALID"]) + '\n'
    # f.write(row)
    print(curr["title"])

f.close()

# for i in parsed_master["actors"] :
#     row = ""
#     curr = parsed_master["actors"][i]
#     row = str(curr["actorID"]) + ", " + curr["name"] + ", " + str(curr["favs"]) + ", " + curr["img"] + "\n"
#     f.write(row)

print(MasterOPs)



# runner tester
# animeList = VA.VoiceActorsWrapper()
# myList = ArtistsList()
# animeList.OPs = myList
# FLCL = VA.Show("FLCL")
# animeList.shows.append(FLCL)
# OPArtists(227, FLCL, myList)
# print(FLCL.OPs["The Pillows"])
# for x in FLCL.OPs["The Pillows"] :
#     print (x)
# for x in myList.artists :
#     print (myList.artists[x])