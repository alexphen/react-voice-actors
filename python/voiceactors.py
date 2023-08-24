from json import JSONEncoder

class VoiceActorsWrapper :
    def __init__(self):
        self.user = ""
        self.titles = []
        self.shows = dict()
        self.showIDs = []
        self.actors = dict()
        self.OPs = dict()

class Actor :
    def __init__(self, n, id, f,i):
        self.name = n
        self.roles = dict()
        self.charIDs = []
        self.actorID = id
        self.favs = f
        self.img = i

    def __str__(self) :
        s = "{" + self.name + " [ "
        for c in self.roles :
            s += str(c) + ", "
        res = s[:-2] + " ] }"
        return res

class Role :
    def __init__(self, c, img, cID, fav) :
        self.charID = cID
        self.character = c
        self.img = img
        self.fav = fav
        self.titles = []
        self.showIDs = []

    def __str__(self) :
        return self.character + " from " + self.show + " (" + str(self.fav) + " favorites)"

class Show :
    def __init__(self, title, img, sID) :
        self.title = title
        self.actorIDs = []
        self.OPs = dict()
        self.img = img
        self.showID = sID
        self.relations = dict()

    def __str__(self):
        return self.title

# subclass JSONEncoder
class ActorEncoder(JSONEncoder) :
    def default(self, o) :
        return o.__dict__

# reorder to name without comma
def rename(char) :
    if ',' in char :
        index = char.index(',')
        char = char[index+2:] + " " + char[:index]
    return char






# scrape page of show for characters
# def vaParse(showID, token, title, myList) :
#     url = 'https://api.jikan.moe/v4/anime/' + str(showID) + '/characters'
#     # print ("parsing")
#     response = requests.get(url, headers = {
#         'X-MAL-CLIENT-ID': token
#         })
#     response.raise_for_status()
#     anime = response.json()

#     currShow = Show(title)
#     # currShow.fav = favs

#     for character in anime["data"] :
#         char = rename(character["character"]["name"])
#         img = character["character"]["images"]["jpg"]["image_url"]
#         charID = character["character"]["mal_id"]
#         favs = character["favorites"]
#         for voice in character["voice_actors"] :
#             if voice["language"] == 'Japanese' :
#                 actor = voice["person"]["name"]
#                 id = voice["person"]["mal_id"]
#                 # if actor is already in the myList
#                 if id in myList.actorIDs :
#                     # append char to their list
#                     for n in myList.actors :
#                         if n.ID == id :
#                             currShow.actors.append(n)
#                             # if there is not already an entry for this character
#                             if charID not in n.charIDs :
#                                 n.roles.append(Role(char, title, img, charID, favs))
#                                 n.charIDs.append(charID)
#                 else :
#                     myList.actorIDs.append(id)
#                     entry = Actor(rename(actor), id)
#                     entry.roles.append(Role(char, title, img, charID, favs))
#                     entry.charIDs.append(charID)
#                     myList.actors.append(entry)
#                     currShow.actors.append(entry)
#         myList.characters.append(char)
#     myList.shows.append(currShow)
#     return currShow


# def draftList(myList, listbox) :
#     CLIENT_ID = '5dbcd29b3178e6d62ec7ecf17b4daf56'
#     url = 'https://api.myanimelist.net/v2/users/' + myList.user + '/animelist?fields={title,id,alternative_titles=en}&limit=1000'
#     response = requests.get(url, headers = {
#         'X-MAL-CLIENT-ID': CLIENT_ID
#         })

#     response.raise_for_status()
#     anime = response.json()

#     total = len(anime["data"])
#     count = 1
#     starttime = time.localtime()

#     # scrape user anime list, calls vaParse
#     while True :
#         # loop thru current page. print english title if available
#         for entry in anime["data"]:
#             if entry["node"]["alternative_titles"]["en"] == "" :
#                 title = entry["node"]["title"]
#             else :
#                 title = entry["node"]["alternative_titles"]["en"]
#             # if id is not yet in myList, append
#             id = entry["node"]["id"]
#             if id not in myList.ids :
#                 myList.titles.append(title)
#                 myList.ids.append(id)
#                 vaParse(id, CLIENT_ID, title, myList)
#             # COMMENTED OUT SO I DONT OVERWRITE
#             f = open(myList.user + ".json", "w")
#             ActorJSON = json.dumps(myList, indent=4, cls=ActorEncoder)
#             f.write(ActorJSON)
#             listbox.insert('end', title)
#             print("(" + str(count) + "/" + str(total) + ") " + title)
#             count += 1
#             time.sleep(1)
#         # if there is a next page, continue loop with that page as the new url
#         if "next" in anime["paging"] :
#             url = anime["paging"]["next"]
#             response = requests.get(url, headers = {
#                 'X-MAL-CLIENT-ID': CLIENT_ID
#                 })
#             response.raise_for_status()
#             anime = response.json()
#         else :
#             break
#         # # end after 10 entries
#         # break
#     response.close()
#     # f.close()
#     endtime = time.localtime()
#     duration = time.mktime(endtime) - time.mktime(starttime)
#     print ("Completed in: " + str(duration) + " seconds")
