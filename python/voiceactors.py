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


