import json
import voiceactors as VA
import opartist as OP

myList = VA.VoiceActorsWrapper()
masterList = VA.VoiceActorsWrapper()
OPList = OP.ArtistsList()
MasterOPs = OP.ArtistsList()
myList.OPs = OPList

try :
    
    MASTER_PATH = 'Master2.json'
    master_json = open(MASTER_PATH, 'r', encoding='utf8')
    
except Exception as err:
    print(f"Unexpected {err=}, {type(err)=}")
    print("err at master")

master_string = master_json.read()
parsed_master = json.loads(master_string)
for i in parsed_master["actors"] :
    curr = parsed_master["actors"][i]
    entry = VA.Actor(curr["name"], curr["actorID"], curr["favs"])
    for r in curr["roles"] :
        entry.roles.append(VA.Role(r["character"], r["show"], r["img"], r["charID"], r["fav"], r["showID"]))
    masterList.actors[curr["actorID"]] = entry

masterList.actorIDs = parsed_master["actorIDs"]
masterList.titles = parsed_master["titles"]
masterList.user = parsed_master["user"]
masterList.showIDs = parsed_master["showIDs"]
# masterList.shows = parsed_master["shows"]

# for i in parsed_master["titles"] :
#     listbox.insert('end', i)
for i in parsed_master["OPs"]["artists"] :
    curr = parsed_master["OPs"]["artists"][i]
    temp = OP.OPArtist(curr["name"])
    temp.showIDs = curr["OPShowIDs"]
    MasterOPs.artists[curr["name"]] = temp
masterList.OPs = MasterOPs

masterList.shows = parsed_master["shows"]
# for i in showList :
#      print(masterList.shows[i])
    #  masterList.shows[i]

print ("dup actors from shows")
iC = 0
kC = 1
for p in masterList.shows :
    # print(p)
    for i in masterList.shows[p]["actors"] :
        if (p == "30") :
            print (i["actorID"])
        kC = 0
        for k in masterList.shows[p]["actors"] :
            if kC > iC :
                if i["actorID"] == k["actorID"] :
                    print("match", i, k)
                    masterList.shows[p]["actors"].remove(k)
            kC = kC+1
        iC = iC+1
        
    if (p == "30") :
        print (i["actorID"])


# print("dup actorID")
# # print(masterList.actors)
# iC = 0
# kC = 1
# for i in masterList.actorIDs :
#     kC = 0
#     for k in masterList.actorIDs :
#         if kC > iC :
#             if i == k :
#                 print("match", i)
#                 masterList.actorIDs.remove(k)
#         kC = kC+1
#     iC = iC+1


with open(MASTER_PATH, 'w') as f :
        outJSON = json.dumps(masterList, indent=4, cls=VA.ActorEncoder)
        f.write(outJSON)

# print (masterList.actorIDs)