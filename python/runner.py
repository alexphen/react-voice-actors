import time
import requests
import voiceactors as VA
import opartist as OP
import json
from decouple import config

CLIENT_ID = config('MAL_CLIENT_ID')
CLIENT_SECRET = config('MAL_CLIENT_SECRET')
myList = VA.VoiceActorsWrapper()
myList.OPs = OP.ArtistsList()
masterList = VA.VoiceActorsWrapper()
MasterOPs = OP.ArtistsList()



master_string = None
# try :
MASTER_PATH = './temp2.json'
master_json = open(MASTER_PATH, 'r', encoding='utf8')
master_string = master_json.read()
parsed_master = json.loads(master_string)
for i in parsed_master["actors"] :
    curr = parsed_master["actors"][i]
    entry = VA.Actor(curr["name"], curr["actorID"], curr["favs"], curr["img"])
    for r in curr["roles"] :
        entry.roles.append(VA.Role(r["character"], r["show"], r["img"], r["charID"], r["fav"], r["showID"]))
        entry.charIDs.append(r["charID"])
    masterList.actors[curr["actorID"]] = entry

# masterList.actorIDs = parsed_master["actorIDs"]
# print(masterList.actorIDs)
masterList.titles = parsed_master["titles"]
masterList.user = parsed_master["user"]
masterList.showIDs = parsed_master["showIDs"]
for i in parsed_master["shows"] :
    masterList.shows[i] = VA.Show(parsed_master["shows"][i]["title"], parsed_master["shows"][i]["img"], parsed_master["shows"][i]["showID"])
    masterList.shows[i].actorIDS = parsed_master["shows"][i]["actorIDs"]
    masterList.shows[i].OPs = parsed_master["shows"][i]["OPs"]
    print(masterList.shows[i].relations)
masterList.shows = parsed_master["shows"]

# for i in parsed_master["titles"] :
#     listbox.insert('end', i)
for i in parsed_master["OPs"]["artists"] :
    # curr = i
    temp = OP.OPArtist(parsed_master["OPs"]["artists"][i]["name"])
    temp.showIDs = parsed_master["OPs"]["artists"][i]["OPShowIDs"]
    MasterOPs.artists[i] = temp

master_json.close()


for showID in masterList.showIDs :
    print (masterList.shows[str(showID)])
    url = 'https://api.jikan.moe/v4/anime/' + str(showID) + '/relations'
    response = requests.get(url, headers = {
        'X-MAL-CLIENT-ID': CLIENT_ID
        })

    response.raise_for_status()
    showJSON = response.json()

    trying = True
    attempts = 0
    # while trying :
            # try :
    url = 'https://api.jikan.moe/v4/anime/' + str(showID) + '/relations'
    response = requests.get(url, headers = {
        'X-MAL-CLIENT-ID': CLIENT_ID
        })

    response.raise_for_status()
    showJSON = response.json()

    # print(showJSON)
    for i in showJSON["data"] :
        entry = i["entry"][0]
        if entry["type"] == "anime" : 
            rID = entry["mal_id"]
            rName = entry["name"]
            masterList.shows[str(showID)]["relations"][rID] = rName
            print(masterList.shows[str(showID)].relations)

            # except Exception as err:
            #     print(f"Unexpected {err=}, {type(err)=}")
            #     # print("Exception at gui.vaParse")
            #     if attempts == 20 :
            #         trying = False
            #     else :
            #         time.sleep(0.1)
            #     attempts+= 1
            # else :
            #     trying = False

    break
    