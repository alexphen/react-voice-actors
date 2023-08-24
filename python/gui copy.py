import tkinter as tk
from tkinter import *
from tkinter.ttk import *
from tkinter import filedialog
import json
import requests
import voiceactors as VA
import opartist as OP
import urllib.request
from PIL import ImageTk, Image
import time

myList = VA.VoiceActorsWrapper()
masterList = VA.VoiceActorsWrapper()
MasterOPs = OP.ArtistsList()
myList.OPs = OP.ArtistsList()
CLIENT_ID = '5dbcd29b3178e6d62ec7ecf17b4daf56'

def Window() :
    def __init__(self, master) :
        self.master = master
        self.pack(expand = True, fill = 'both')

root = Tk()
root.geometry("800x480")

frameL = Frame(root)
frameL.pack(expand = True, fill = 'both', side = 'left')
frameL1 = Frame(frameL)
frameL1.pack(side = 'top')
frameL2 = Frame(frameL)
frameL2.pack()
promptFrame = tk.Frame(frameL)
promptFrame.pack(side = 'bottom', expand = True, fill = 'both')

frameR = Frame(root)
frameR.pack(side = 'right', fill = 'both')

listLabel = Label(frameR, text = "Your List So Far:")
listLabel.pack()

scroll = Scrollbar(frameR)
scroll.pack(side = 'right', fill = 'y')
listbox = Listbox(frameR, yscrollcommand = scroll.set, width = 50)
listbox.pack(expand = True, fill = 'both')

user = StringVar()
user.set("RufusPeanut") ################
myList.user = user.get()

master_string = None
try :
    MASTER_PATH = 'Master.json'
    master_json = open(MASTER_PATH, 'r', encoding='utf8')
    master_string = master_json.read()
    parsed_master = json.loads(master_string)
    for i in parsed_master["actors"] :
        curr = parsed_master["actors"][i]
        entry = VA.Actor(curr["name"], curr["actorID"], curr["favs"])
        for r in curr["roles"] :
            entry.roles.append(VA.Role(r["character"], r["show"], r["img"], r["charID"], r["fav"], r["showID"]))
        masterList.actors[curr["actorID"]] = entry

    masterList.actorIDs = parsed_master["actorIDs"]
    print(masterList.actorIDs)
    masterList.titles = parsed_master["titles"]
    masterList.user = parsed_master["user"]
    masterList.showIDs = parsed_master["showIDs"]
    masterList.shows = parsed_master["shows"]

    # for i in parsed_master["titles"] :
    #     listbox.insert('end', i)
    for i in parsed_master["OPs"]["artists"] :
        # curr = i
        temp = OP.OPArtist(parsed_master["OPs"]["artists"][i]["name"])
        temp.showIDs = parsed_master["OPs"]["artists"][i]["OPShowIDs"]
        MasterOPs.artists[i] = temp

    master_json.close()

except Exception as err:
    print(f"Unexpected {err=}, {type(err)=}")
    print("err at master")


def sortByFav() :
    global myList
    myList.actors = sorted(myList.actors.items(), key=lambda x:x[1].favs, reverse=True)

def save() :
    # global myList
    # myList.actors = sorted(myList.actors.items(), key=lambda x:x[1].favs, reverse=True)
    name = filedialog.asksaveasfilename(
                        #    initialdir="/",
                           filetypes=(("Json File", "*.json"), ("All Files", "*.*")),
                           title="Save As")
    with open(name, 'w') as f :
        ActorJSON = json.dumps(myList, indent=4, cls=VA.ActorEncoder)
        f.write(ActorJSON)

def load() :
    global myList
    name = filedialog.askopenfilename(
                           filetypes=(("Json File", "*.json"), ("All Files", "*.*")),
                           title="Choose a file")
    json_string = None
    try:
        with open(name, 'r', encoding='utf8') as f :
            json_string = f.read()
            parsedList = json.loads(json_string)
            # loadList = parsedList["actors"]
            # print(loadList)
            for i in parsedList["actors"] :
                curr = parsedList["actors"][i]
                # print(curr)
                entry = VA.Actor(curr["name"], curr["actorID"], curr["favs"])
                myList.actors[curr["actorID"]] = entry ############################ append(entry)
                for r in curr["roles"] :
                    entry.roles.append(VA.Role(r["character"], r["show"], r["img"], r["charID"], r["fav"], r["showID"]))

            myList.actorIDs = parsedList["actorIDs"]
            myList.titles = parsedList["titles"]
            myList.user = parsedList["user"]
            myList.showIDs = parsedList["showIDs"]
            myList.shows = parsedList["shows"]
            for i in parsedList["titles"] :
                listbox.insert('end', i)
            for i in parsedList["OPs"]["artists"] :
                curr = parsedList["OPs"]["artists"][i]
                temp = OP.OPArtist(curr["name"])
                temp.showIDs = curr["OPShowIDs"]
                myList.OPs.artists[curr["name"]] = temp
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")

def makeList(self) :
    print("Fetching user anime list: ", myList.user)
    myList.user = user.get()
    url = 'https://api.myanimelist.net/v2/users/' + myList.user + '/animelist?fields={title,related_anime,id,alternative_titles=en}&limit=1000'
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
            # related = entry["node"]["related_anime"]
            if id not in myList.showIDs :
                myList.titles.append(title)
                myList.showIDs.append(id)
                vaParse(id, CLIENT_ID, title, img)
                OP.OPArtists(id, VA.Show(title, img, id), myList.OPs)

            # COMMENTED OUT SO I DONT OVERWRITE
            f = open("temp.json", "w")
            ActorJSON = json.dumps(myList, indent=4, cls=VA.ActorEncoder)
            f.write(ActorJSON)
            listbox.insert('end', title)
            root.update()  
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

introLabel = Label(frameL1, justify = 'center', text = "Start here to make your list from scratch\n(This will take a little while)")
introLabel.pack(pady = (30, 0))

userLabel = Label(frameL2, text = 'MAL Username', anchor = 'center', width = 20)
userLabel.grid(row = 0, column = 0, padx = 10)

username = Entry(frameL2, width = 30, textvariable = user)
username.grid(row = 0, column = 1, padx = 25, pady = 10)
username.bind('<Return>', makeList)


showA = StringVar()
showA.set("FLCL") ####################################
animeSearch = dict()

def search(self) :
    print("Searching Show: ", showA.get())
    searchURL = 'https://api.jikan.moe/v4/anime?q=' + showA.get()
    response = requests.get(searchURL, headers = {
        'X-MAL-CLIENT-ID': CLIENT_ID
        })
    response.raise_for_status()
    global animeSearch
    animeSearch = response.json()

    options.delete(0, 'end')
    for i in animeSearch["data"] :
        if i["title_english"] != None :
            currAnime = i["title_english"]
        else :
            currAnime = i["title"]
        # searchResult.set(currAnime)
        options.insert('end', currAnime)
    # if there are any search results
    if len(animeSearch["data"]) > 0 :
        setPrompt()
    else :
        resetPrompt()
        nosuch.grid(padx = 150, pady = 100)
    response.close()

charA = StringVar()
charA.set("killua")
# charSearch = dict()
charSearchListIDs = []

# class charSearchResult :
#     def __init__(self, char, title, id) :
#         self.name = char
#         self.title = title
#         self.id = id
#     def __str__(self) :
#         return self.name + " from " + self.title

def characterSearch(char) :
    print("Searching Character: ", charA.get())
    charSearchListIDs.clear()
    charURL = 'https://api.jikan.moe/v4/characters?q=' + charA.get()
    response = requests.get(charURL, headers = {
        'X-MAL-CLIENT-ID': CLIENT_ID
        })
    response.raise_for_status()
    charSearch = response.json()

    options.delete(0, 'end')
    for i in charSearch["data"] :
        curr = i["name"]
        charID = i["mal_id"]
        actorIDs = []
        ############### add try timer
        trying = True
        attempts = 0
        
        while trying :
            try :
                print("Getting show info for each character")
                charAnimeURL = 'https://api.jikan.moe/v4/characters/' + str(charID) + '/full'
                response2 = requests.get(charAnimeURL, headers = {
                    'X-MAL-CLIENT-ID': CLIENT_ID
                    })
                response2.raise_for_status()
                charAnimeResults = response2.json()
            except :
                # print("Exception at gui.vaParse")
                if attempts == 20 :
                    trying = False
                else :
                    time.sleep(0.1)
                attempts+= 1
            else :
                trying = False
                success = True
        if success :
            currTitle = charAnimeResults["data"]["anime"][0]["anime"]["title"]
            options.insert('end', curr + " from " + currTitle)
            for g in charAnimeResults["data"]["voices"] :
                if g["language"] == "Japanese" :
                    actorIDs.append(g["person"]["mal_id"])        
            charSearchListIDs.append((actorIDs, curr))
    # if there are any search results
    if len(charSearch["data"]) > 0 :
        setCharPrompt()
    else :
        resetPrompt()
        nosuch.grid(padx = 10)
    response.close()

def charSimis() :
    simisWindow = tk.Toplevel(root)
    currTuple = charSearchListIDs[options.curselection()[0]]
    print (currTuple)

    simisWindow.title("Common characters based on " + currTuple[1])
    simisWindow.geometry("1280x720+50+50")
    for i in currTuple[0] :
        char = myList.actors.get(i)
        print(char)
        

def setPrompt() :
    added.grid_forget()
    nosuch.grid_forget()
    buttonsFrameChar.grid_forget()
    isitChar.grid_forget()
    isit.grid(row = 0, column = 0, padx = (20,0))
    options.grid(row = 1, column = 0, padx = (50,15))
    buttonsFrame.grid(row = 1, column = 1)
    yes.pack(pady = 10)
    addAndInfo.pack()
    yes["state"] = 'normal'
    no["state"] = 'normal'

def setCharPrompt() :
    added.grid_forget()
    nosuch.grid_forget()
    buttonsFrame.grid_forget()
    isit.grid_forget()
    isitChar.grid(row = 0, column = 0, padx = (30,0))
    options.grid(row = 1, column = 0, padx = (50,15))
    buttonsFrameChar.grid(row = 1, column = 1)
    yesChar.pack(pady = 10)
    yesChar["state"] = 'normal'

def resetPrompt() :
    added.grid_forget()
    isit.grid_forget()
    isitChar.grid_forget()
    options.grid_forget()
    yes.grid_forget()
    yesChar.pack_forget()
    no.grid_forget()
    showA.set("")
    buttonsFrame.grid_forget()

# scrape page of show for characters
def vaParse(showID, token, title, imgS) :
    print("parsing")
    # first check master to save API calls
    if showID in masterList.showIDs :
        print("in master")
        currShow = masterList.shows[str(showID)]
        print(currShow["title"])

    else :
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
        currShow = VA.Show(title, imgS, showID)
        OP.OPArtists(showID, currShow, myList.OPs)

        for character in anime["data"] :
            try :
                char = VA.rename(character["character"]["name"])
                img = character["character"]["images"]["jpg"]["image_url"]
                charID = character["character"]["mal_id"]
                favs = character["favorites"]
                for voice in character["voice_actors"] :
                    if voice["language"] == 'Japanese' :
                        actor = voice["person"]["name"]
                        actorID = voice["person"]["mal_id"]

                        if actorID not in myList.actorIDs :
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
                            
                            myList.actorIDs.append(actorID)
                            entry = VA.Actor(VA.rename(actor), actorID, aFavs)
                            entry.roles.append(VA.Role(char, title, img, charID, favs, showID))
                            entry.charIDs.append(charID)
                            myList.actors[actorID] = entry
                            currShow.actors.append(entry)
                            
                            actorResponse.close()
                        else :
                            print("Already have actor for: ", char)
                            # if actor is already in the myList append char to their list
                            currActor = myList.actors[actorID]
                            if charID not in currActor.charIDs :
                                currActor.roles.append(VA.Role(char, title, img, charID, favs, showID))
                                currActor.charIDs.append(charID)
                                currShow.actors.append(currActor)
                # myList.characters.append(char)
            except Exception as err:
                print(f"Unexpected {err=}, {type(err)=}")
    myList.shows[showID] = currShow
    # return currShow

def addShow() :
    added.pack_forget()
    index = options.curselection()[0]
    # parse the show if not in list already
    tempID = animeSearch["data"][index]["mal_id"]
    tempImg = animeSearch["data"][index]["images"]["jpg"]["image_url"]
    tempTitle = options.get(index)
    if tempID not in myList.showIDs :
        showAdded = vaParse(tempID, CLIENT_ID, tempTitle, tempImg)
        OP.OPArtists(tempID, VA.Show(tempTitle, tempImg, tempID), myList.OPs)
        # print("adding")
        listbox.insert('end', tempTitle)
        myList.titles.append(tempTitle)
        myList.showIDs.append(tempID)
        myString = "Added: " + tempTitle
        addVar.set(myString)
        resetPrompt()
        added.grid(padx = 150, pady = 100)
    else :
        already.pack(padx = 10)
        return
    # print (myList.actors)
    # print (OPList)
    return showAdded

def favFunc(e) :
    return e.fav

def addPlus() :
    show = addShow()
    for k in show.actors :
        k.roles.sort(reverse = True, key = favFunc)
        print (k)
    openDetailsWindow(show)

def listOPs() :
    for i in myList.OPs.artists :
        print (myList.OPs.artists[i])


bottomButtonFrame = Frame(frameR)
bottomButtonFrame.pack(side='bottom')

viewDetails = Button(bottomButtonFrame, text = 'Select Show for More Details')
viewDetails.pack(side = 'left', pady = 5)

OPs = Button(bottomButtonFrame, text = 'View OP Artists', command = listOPs)
OPs.pack(side = 'right', pady=5, padx = 10)


###################################
# Working on getting frame to be scrollable

class ScrollableFrame(Frame):
    def __init__(self, container, *args, **kwargs):
        super().__init__(container, *args, **kwargs)
        canvas = tk.Canvas(self)
        scrollbar = Scrollbar(self, orient="vertical", command=canvas.yview)
        self.scrollable_frame = Frame(canvas)

        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(
                scrollregion=canvas.bbox("all")
            )
        )

        canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")

        canvas.configure(yscrollcommand=scrollbar.set)

        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")



def openDetailsWindow(show) :
    detailsWindow = tk.Toplevel(root)
    detailsWindow.title("Details on latest addition(s)")
    detailsWindow.geometry("1280x720+50+50")
    frame = ScrollableFrame(detailsWindow)
    # h = Scrollbar(frame, orient='horizontal')
    # h.pack(side = BOTTOM, fill = X)
    # v = Scrollbar(frame, orient='vertical')
    # v.pack(side = RIGHT, fill = Y)

    # img = ImageTk.PhotoImage(Image.open("img1.png"))
    # lbl = tk.Label(detailsWindow, image = img)
    # lbl.image = img
    # lbl.pack()
    
    frame.pack(fill = "both", expand = "True")

    for p in show.actors :
        tempF = tk.Frame(frame.scrollable_frame, width=1280)
        tempF.pack(fill = "x", expand = "True")
        Label(tempF, text = p.name, font="bold", underline=(100), justify="center").pack(side="top")
        count = 0
        tempA = tk.Frame(tempF)
        for k in p.roles :
            urllib.request.urlretrieve(k.img, "img1.png")
            img = ImageTk.PhotoImage(Image.open("img1.png"))
            lbl = tk.Label(tempA, image = img)
            lbl.image = img
            tempA.pack()
            lbl.grid(row = 0, column = count, padx = 20)
            Label(tempA, text = k).grid(row = 1, column = count, pady = (0, 15))
            count += 1
        # tempF.pack_propagate(0)


# searchResult = StringVar()
addVar = StringVar()
isit = Label(promptFrame, text = "Please select the show you are looking for:")
isitChar = Label(promptFrame, text = "Please select the character you are looking for:")
buttonsFrame = Frame(promptFrame)
buttonsFrame.grid(row = 1, column = 1)

buttonsFrameChar = Frame(promptFrame)
buttonsFrameChar.grid(row = 1, column = 1)

options = Listbox(promptFrame, height = 15, width = 40, yscrollcommand = scroll.set)
yes = Button(buttonsFrame, text = "Add", command = addShow)
no = Button(buttonsFrame, text = "That's not it.", command = resetPrompt)

yesChar = Button(buttonsFrameChar, text = "See simlarities", command = charSimis)

addAndInfo = Button(buttonsFrame, text = "Add + see details", command = addPlus)
# yes = Button(promptFrame, text = "Add", command = addShow)
# no = Button(promptFrame, text = "That's not it.", command = resetPrompt)
nosuch = Label(promptFrame, text = "No results. Please try again")
added = Label(promptFrame, textvariable = addVar)
already = Label(buttonsFrame, text = "Already Added!")

frameL3 = Frame(frameL)
frameL3.pack()
addLabel = Label(frameL3, text = "Add an Anime:", anchor = 'center', width = 20)
addLabel.grid(row=0, column=0, padx = 10)

showEntry = Entry(frameL3, width = 30, textvariable = showA)
showEntry.grid(row = 0, column = 1, padx = 25)
showEntry.bind('<Return>', search)

frameL4 = Frame(frameL)
frameL4.pack(pady = 10)
charLabel = Label(frameL4, text="Search by Character", anchor = 'center', width = 20)
charLabel.grid(row=0, column=0, padx = 10)

charEntry = Entry(frameL4, width = 30, textvariable = charA)
charEntry.grid(row = 0, column = 1, padx = 25)
charEntry.bind('<Return>', characterSearch)


# testIm = ImageTk.PhotoImage(Image.open("img1.png"))
# Label(frameL, image=testIm).pack()

mainmenu = Menu(root)
mainmenu.add_command(label = "Save", command = save)
mainmenu.add_command(label = "Load", command = load)
mainmenu.add_command(label = "Exit", command = root.destroy)

root.config(menu = mainmenu)
scroll.config(command = listbox.yview)

# OPbutton = Button(frameL, text = "View OP Artists", command = linie)
# OPbutton.pack()

root.title("Voice Actors")
root.mainloop()
