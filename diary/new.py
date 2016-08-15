##My first independent python project. Not necessarily clean, because I haven't started learning it seroisly back then.

# -*- coding:utf-8 -*-
import re, datetime, os, urllib, lxml.html, sqlite3, sys, filecmp, shutil
from lxml import etree

def findDT(time):
    if time == '':
        DT = datetime.datetime.now()
    else:
        date = (re.split(' ', time)[0])
        date = re.split('\.', date)
        time = (re.split(' ', time)[1])
        time = re.split(':', time)
        DT = datetime.datetime(int(date[2]),int(date[1]),int(date[0]),int(time[0]),int(time[1]))
        
    makeWay(str(DT.strftime("%d.%m.%Y")))
    if 'z' in keys:
        changeDays = findChangeDays(DT.year)
        if (datetime.datetime.now()>findChangeDays(datetime.datetime.now().year)[0])and(datetime.datetime.now()<findChangeDays(datetime.datetime.now().year)[1]):
            msc = DT + datetime.timedelta(hours=8)
            if (DT<=changeDays[0])or(DT>=changeDays[1]):  
                DT = DT - datetime.timedelta(hours=1)         
        else:
            msc = DT + datetime.timedelta(hours=9)
            if (DT>changeDays[0])and(DT<changeDays[1]):  
                DT = DT + datetime.timedelta(hours=1)
        DT = [str(DT.strftime("%d.%m.%Y")),str(DT.strftime("%H:%M"))]
        msc = [str(msc.strftime("%d.%m.%Y")),str(msc.strftime("%H:%M"))]
        twoDT = [DT,msc]

        return twoDT

    else:
        DT = [str(DT.strftime("%d.%m.%Y")),str(DT.strftime("%H:%M"))]
  
        return DT


def findChangeDays(year):
    fallDay = datetime.datetime(year,11,1)
    
    while fallDay.isoweekday() != 7:
        fallDay = fallDay + datetime.timedelta(days=1)   

    springDay = datetime.datetime(year,3,8)

    while springDay.isoweekday() != 7:
        springDay = springDay + datetime.timedelta(days=1)

    changeDays = [springDay,fallDay]

    return changeDays


def takeTime():
    if 'd' in keys:
        ask = ''
    
        while ask != 'Y' and ask != 'y': 
            time = raw_input('Set your time in format dd.mm.yyyy hh:mm (time in 24-hour format): ')

            while re.sub(r'[0123][0-9].[01][0-9].[0-9]{4} [012345][0-9]:[012345][0-9]', '', time) != '':
                print "You have print something wrong. Try again"
                time = raw_input('Set your time in format dd.mm.yyyy hh:mm (time in 24-hour format): ')
                
            ask = raw_input("Are you sure that time " + time + " is right?(Y/N)")
            if (ask != 'Y')and(ask != 'y'):
                print "Try again"
    else:
        time = ''

    return time


def askImages():
    global images
    images = []
    image = ''
    while re.sub('\s*','',image).lower() != "n":
        image = raw_input("Enter link or fileway from this (!) folder. Use http:// for links. Use ../ to move out foulders. Then press enter. If you not interested in adding more pictures, press N and then Enter: ")
        if re.sub('\s*','',image).lower() != "n" and image != '':

            while not os.path.exists(image):
                image = raw_input("File doesn't exist. Try again.\nEnter link or fileway from this (!) folder. Use http:// for links. Use ../ to move out foulders. Then press enter. If you not interested in adding more pictures, press N and then Enter: ")

            if 'http' in image:
                if 'i' in keys:
                    fileway = chooseFileWay(image)
                    print "loading picture"
                    urllib.urlretrieve(image, fileway)
                    doubling = checkForDoubles(fileway)
                    if not doubling == "N":
                        os.remove(fileway)
                        fileway = doubling
                    image = re.sub(r'Diary/.extras/Media/', '../../.extras/Media/', fileway)
            if not 'http' in image:
                doubling = checkForDoubles(image)
                if doubling == "N":
                    fileway = chooseFileWay(image)
                    shutil.copy(image, fileway)
                else:
                    fileway = doubling
   
                image = re.sub(r'Diary', '../..', fileway)
            
            if not 'image' in addTags:
                addTags.append('image') 

            
            images.append(image)    
                    
    return images


def askAudio():
    global audios
    audio = ''
    audios = []
    while re.sub('\s*','',audio).lower() != "n":
        audio = raw_input("Enter link or fileway from this (!) folder. Use http:// for links. Use ../ to move out foulders. Then press enter. If you not interested in adding more audios, press N and then Enter: ")
        if re.sub('\s*','',audio).lower() != "n" and audio != '':

            while not os.path.exists(audio):
                audio = raw_input("\nFile doesn't exist. Try again.\nEnter link or fileway from this (!) folder. Use http:// for links. Use ../ to move out foulders. Then press enter. If you not interested in adding more audios, press N and then Enter: ")

            audioname = raw_input("Enter name of this song, maybe author - whatever you want: ")
            if 'http' in audio:
                if 'i' in keys:
                    fileway = chooseFileWay(audio)
                    print "loading picture"
                    urllib.urlretrieve(audio, fileway)
                    doubling = checkForDoubles(fileway)
                    if not doubling == "N":
                        os.remove(fileway)
                        fileway = doubling
                    audio = re.sub(r'Diary/.extras/Media/', '../../.extras/Media/', fileway)
            if not 'http' in audio:
                doubling = checkForDoubles(audio)
                if doubling == "N":
                    fileway = chooseFileWay(audio)
                    shutil.copy(audio, fileway)
                else:
                    fileway = doubling
   
                audio = re.sub(r'Diary', '../..', fileway)
            
            audio = audioname + '<br/>\n<audio controls>\n<source src="' + audio + '" type="audio/mpeg">\nYour browser does not support the audio element.\n</audio><br/>\n'
            if not 'audio' in addTags:
                addTags.append('audio')
           
            audios.append(audio)    
                    
    return audios


def askVideo():
    global videos
    video = ''
    videos = []
    while re.sub('\s*','',video).lower() != "n":
        video = raw_input("Enter link or fileway from this (!) folder. Use http:// for links. Use ../ to move out foulders. Then press enter. If you not interested in adding more videos, press N and then Enter: ")
        if re.sub('\s*','',video).lower() != "n" and video != '':

            while not os.path.exists(video) and not 'http' in video:
                video = raw_input("\nFile doesn't exist. Try again.\nEnter link or fileway from this (!) folder. Use http:// for links. Use ../ to move out foulders. Then press enter. If you not interested in adding more videos, press N and then Enter: ")
                if 'http' in video:
                    break

            videoname = raw_input("Enter name of this video, maybe author - whatever you want: ")
            if 'http' in video:
                if 'e' in keys:
                    fileway = chooseFileWay(video)
                    print "loading video"
                    urllib.urlretrieve(video, fileway)
                    print "video downloaded"
                    doubling = checkForDoubles(fileway)
                    if not doubling == "N":
                        os.remove(fileway)
                        fileway = doubling
                    video = re.sub(r'Diary/.extras/Media/', '../../.extras/Media/', fileway)
                    video = videoname + '<br><video width="320" height="240" controls>\n<source src="' + video + '" type="video/mp4">\nYour browser does not support the video tag.\n</video><br>'
                else:
                    video = '<a href="' + video + '">Видео: "' + videoname + '"</a>'
            if not 'http' in video:
                doubling = checkForDoubles(video)
                if doubling == "N":
                    fileway = chooseFileWay(video)
                    shutil.copy(video, fileway)
                else:
                    fileway = doubling
   
                video = re.sub(r'Diary', '../..', fileway)
                video = videoname + '<br><video width="320" height="240" controls>\n<source src="' + video + '" type="video/mp4">\nYour browser does not support the video tag.\n</video><br>'
            
            if not 'video' in addTags:
                addTags.append('video')
           
            videos.append(video)    
                    
    return videos


def askTags():
    ask = ''
    while ask.lower() != 'y':
        tags = raw_input("Print tags, use comma to divide it\nTAGS: ").lower()
        tags = re.sub(r'\s{2,}', '\s', tags)
        print "Here are your tags: ", tags, "."
        ask = raw_input("Is it right(Y/N)?: ")

    return tags


def chooseFileWay(link):
    n = re.search(r'[^/]+$', link)
    name = re.split('\.', n.group(0))
    name[0] = 0 
    fileway = 'Diary/.extras/Media/' + str(name[0]) + '.' + str(name[1])

    while os.path.exists(fileway):
        name[0] = name[0] + 1
        fileway = 'Diary/.extras/Media/' + str(name[0]) + '.' + str(name[1])
   
    return fileway

def checkForDoubles(link):
    files = os.listdir("Diary/.extras/Media")
    doubling = "N"

    for fle in files:
        if not link == "Diary/.extras/Media/" + fle:
            if filecmp.cmp(link, "Diary/.extras/Media/" + fle):
                doubling = "Diary/.extras/Media/" + fle

    return doubling


def takePost():
    global text,tags,time,images
    text = raw_input("Print text of your record. If you want to make paragraph, use <br/>. Also use all tags, that needed for text\n")
    if 'b' in keys:
        images = askImages()
    if 'c' in keys:
        audios = askAudio()
    if 'v' in keys:
        videos = askVideo()
    tags = askTags()
    tags = re.split(",", tags)
    time = takeTime()


def makePost():
    global time,audios,images
    if 'z' in keys:
        twoDT = findDT(time)
        DT = twoDT[0]
        time = DT[1] 
        msc = twoDT[1]
        body = '<div id="post"><b>' + DT[0] + ' <div id="time">' + DT[1] + "</div> (" + msc[0] + ' ' + msc[1] + ' по Москве)</b><br/>\n<img src="../../.extras/Media/ava.jpg" height=100px; align="left"></img>\n<div id="text">' + text + "<br/>\n"
    else:
        DT = findDT(time)
        time = DT[1]
        body = '<div id="post"><b>' + DT[0] + '<div id="time"> ' + DT[1] + '</div></b><br/>\n<img src="../../.extras/Media/ava.jpg" height=100px; align="left"></img>\n<div id="text">' + text + "<br/>\n"
    if 'b' in keys and not images == '' and not images == None:
        for image in images:
            body = body + '<img src="' + image + '"></img><br/>'
    if 'c' in keys and not audios == '' and not audios == None:
        body = body + '<div id="audio">'
        
        for audio in audios:
            body = body + audio

        body = body + '</div>'
    if 'v' in keys and not videos == '' and not videos == None:
        body = body + '<div id="video">'
       
        for video in videos:
            body = body + video

        body = body + '</div>'
    if not tags == '' and not tags == None:
        body = body + "TAGS: "

        for tag in tags:
            if tag != '':
                body = body + tag + ', '
    body = re.sub(r',\s$', '', body) + '</div></div>'
 
    return body


def makeWay(date):
    global fway
    date = re.split('\.', date)
    fway = 'Diary/' + date[2] + '/' + date[1] + '/' + date[0] + '.html'
    if not os.path.exists(re.sub(r'[^/]*.html', '', fway)):
        os.makedirs(re.sub(r'[^/]*.html', '', fway))


def addTagsInDB(tags):
    db = sqlite3.connect("Diary/.extras/test.db")
    cur = db.cursor()
    cur.execute('PRAGMA encoding = "UTF-8";')
    cur.execute('CREATE TABLE IF NOT EXISTS tags (idtag INTEGER PRIMARY KEY, tag TEXT);')

    for tag in tags:
        if tag != '':
            with db:
                cur.execute('SELECT idtag, tag FROM tags WHERE tag = "' + tag + '";')
                if cur.fetchall() == []:
                    cur.execute('INSERT INTO tags (tag) VALUES("' + tag + '");')

    tagslist = []

    for tag in tags:
        if tag != '':
            with db:
                cur.execute('SELECT idtag FROM tags WHERE tag ="'+ tag + '";')
                tagslist.append(str((cur.fetchone())[0]))
 
    cur.close()
    db.close()

    return tagslist


def addDayInDB():
    db = sqlite3.connect("Diary/.extras/test.db")
    cur = db.cursor()
    cur.execute('PRAGMA encoding = "UTF-8";')
    cur.execute('CREATE TABLE IF NOT EXISTS ways (idway INTEGER PRIMARY KEY, way TEXT);')
    with db:
        cur.execute('SELECT idway, way FROM ways WHERE way = "' + fway + '";')
        if cur.fetchall() == []:
            cur.execute('INSERT INTO ways (way) VALUES("' + fway + '");')
        cur.execute('SELECT idway FROM ways WHERE way ="'+ fway + '";')
        idDay = str((cur.fetchone())[0]) 
    cur.close()
    db.close()

    return idDay


def addConnections(idTags,idDay):
    db = sqlite3.connect("Diary/.extras/test.db")
    cur = db.cursor()
    cur.execute('PRAGMA encoding = "UTF-8";')
    cur.execute('CREATE TABLE IF NOT EXISTS connections (idTag INTEGER, idWay INTEGER);')
    with db:

        for idTag in idTags:
            cur.execute('SELECT idTag, idWay FROM connections WHERE idTag = "' + idTag + '" AND idWay = "' + idDay + '";')
            if cur.fetchall() == []:
                cur.execute('INSERT INTO connections (idTag,idWay) VALUES("' + idTag + '","' + idDay+ '");')

    cur.close()
    db.close()


def createFile():
    global body
    newFile = '<html>\n<html lang="ru">\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<link href="../../.extras/style.css" rel="stylesheet" type="text/css" />\n</head>\n<body>\n'
    body = etree.tostring(lxml.html.fromstring(body.decode("utf-8")), pretty_print=True, encoding="utf-8", method="html")
    if os.path.exists(fway):
        f2 = open(fway, 'r')
        pst = f2.read()
        f2.close()
        if not body in pst:
            maintime = re.split(':',time)
            maintime = datetime.time(int(maintime[0]),int(maintime[1]))
            pstt = lxml.html.fromstring(pst) 
            posts = pstt.xpath("//div[@id='post']")   

            for post in posts:
                postTime = lxml.html.fromstring(etree.tostring(post, pretty_print=True, encoding='utf-8', method="html")).xpath("//div[@id='time']")
                postTime = etree.tostring(postTime[0], pretty_print=True, encoding='utf-8', method="html")
                postTime = re.sub(r'^.*<div[^>]*>|</div>.*|\s*','',postTime)
                postTime = re.split(':',postTime)
                postTime = datetime.time(int(postTime[0]),int(postTime[1]))
                post = etree.tostring(post, pretty_print=True, encoding='utf-8', method="html")
                if maintime >= postTime:
                    newFile = newFile + post + '\n<br/>'
                else:
                    newFile = newFile + body + '\n<br/>' + post + '\n<br/>'
                    body = ''

            if not body == '':
                newFile = newFile + body + '\n<br/>'

            f2 = open(fway, 'w')
            print >>f2, newFile, '</html></body>'
            f2.close() 
    else:
        f2 = open(fway, 'w')
        newFile = newFile + body + '</body></html>'
        print >>f2, newFile
        f2.close()


def loadExtras():
    if not os.path.exists("Diary/.extras/Media"):
        os.makedirs("Diary/.extras/Media")
    if not os.path.exists("Diary/.extras/Media/ava.jpg"):
        urllib.urlretrieve("http://cs5298.userapi.com/g32561651/a_ea42f7ac.jpg", "Diary/.extras/Media/ava.jpg")
    if not os.path.exists("Diary/.extras/style.css"):
        style = open("Diary/.extras/style.css", "w")
        print >>style, "blockquote {\nborder-left: #999999 3px solid; \npadding-left: 5px;\n}\n\n#post {\nmin-height:110px;\n}\n\n#time {\ndisplay: inline;\n}\n\n#text {\nmargin-left:100px;\n}\n\n#text img {\nmax-height:700px; \nmax-width:700px;\n}\n\n#audio {\nmargin-left:20px;\ncolor:#0066ff;\n}\n\n#comm {\nmin-height:50px;\nmargin-top:10px;\n}\n\n#comments {\nmargin-left:150px;\n}\n\n#comments img {\nmax-height:300px; \nmax-width:700px;\n}\n"


keys = ''

for i in range(len(sys.argv)):
    if '-' in sys.argv[i]:
        keys = keys + re.sub(r'[+-]*', '', sys.argv[i])

if 'h' in keys:
    readme = open('README.txt', 'r')
    
    for line in readme:
        print line

    readme.close()
else:
    text = ''
    tags = ''
    fway = ''
    addTags = []
    loadExtras()
    takePost()

    for tag in addTags:
        if not tag in tags:
            tags.append(tag)   
  
    body = makePost()
    if not tags == ['']:
        addConnections(addTagsInDB(tags),addDayInDB())
    createFile()

'''
db = sqlite3.connect("Diary/.extras/test.db")
cur = db.cursor()
cur.execute('SELECT * FROM tags;')
print cur.fetchall()
cur.execute('SELECT * FROM ways;')
print cur.fetchall()
cur.execute('SELECT * FROM connections;')
print cur.fetchall()
cur.close()'''
