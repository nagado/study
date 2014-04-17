# -*- coding:utf-8 -*-
import re, datetime, os, urllib, lxml.html, sqlite3
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
    ask = ''
    
    while ask != 'Y' and ask != 'y': 
        time = askTime()

        while re.sub(r'[0123][0-9].[01][0-9].[0-9]{4} [012345][0-9]:[012345][0-9]', '', time) != '':
            print "You have print something wrong. Try again"
            time = askTime()
    
        if time == '':
            ask = raw_input("You had chose default system time. Are you sure?(Y/N)")
        else:
            ask = raw_input("Are you sure that time " + time + " is right?(Y/N)")
        if (ask != 'Y')and(ask != 'y'):
            print "Try again"

    return time


def askTime():
    time = raw_input("Do you want to set time of your record (If not, it will be just system time)?(Y/N): ")
    time = re.sub(r'^\s+|\s+$', '', time)
    if (time == "Y")or(time == "y"):
        time = raw_input('Set your time in format dd.mm.yyyy hh:mm (time in 24-hour format) or press "N" for default time: ')
        if (time == "N")or(time == "n"):
            time = ''
    if (time == "N")or(time == "n"):
        time = ''

    return time


def takePost():
    global text,tags,time
    time = takeTime()
    text = raw_input("Print text of your record. If you want to make paragraph, use <br/>. Also use all tags, that needed for text\n")
    tags = raw_input("Print tags, use comma to divide it\nTAGS: ").lower()
    tags = re.sub(r'\s{2,}', '\s', tags)
    tags = re.sub(r'^\s|\s$|(?<=,)\s|\s(?=,)', '', tags)
    tags = re.split(",", tags)


def makePost():
    global time
    twoDT = findDT(time)
    DT = twoDT[0]
    time = DT[1] 
    msc = twoDT[1]
    body = '<div class="post"><b>' + DT[0] + ' <div class="time"> ' + DT[1] + " </div> (" + msc[0] + ' ' + msc[1] + ' по Москве)</b><br/>\n<img src="../../.extras/Media/ava.jpg" height=100px; align="left"></img>\n<div class="text">' + text + "<br/>\n"
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
    newFile = '<html>\n<html lang="ru">\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<style>\nblockquote\n{\nborder-left: #999999 3px solid; \npadding-left: 5px;\n}\n\ndiv.post\n{\nmin-height:110px;\n}\n\ndiv.time\n{\ndisplay: inline;\n}\n\ndiv.text\n{\nmargin-left:100px;\n}\n\ndiv.text img\n{\nmax-height:700px; \nmax-width:700px;\n}\n\ndiv.audio\n{\nmargin-left:20px;\ncolor:#0066ff;\n}\n\ndiv.comm\n{\nmin-height:50px;\nmargin-top:10px;\n}\n\ndiv.comments\n{\nmargin-top:80px;\nmargin-left:150px;\n}\n\ndiv.comments img\n{\nmax-height:300px; \nmax-width:700px;\n}\n</style>\n</head>\n<body>\n'
    if os.path.exists(fway):
        f2 = open(fway, 'r')
        pst = f2.read()
        f2.close()
        if not (re.sub(r'<[^<>]*>|\s*|\\n*', '',body)) in (re.sub(r'<[^<>]*>|\s*|\\n*', '',pst)):
            maintime = re.split(':',time)
            maintime = datetime.time(int(maintime[0]),int(maintime[1]))
            pstt = lxml.html.fromstring(pst) 
            posts = pstt.xpath("//div[@class='post']")   
     
            for post in posts:
                postTime = post.xpath("//div[@class='time']")
                postTime = etree.tostring(postTime[0], pretty_print=True, encoding='utf-8')
                postTime = re.sub(r'^.*<div[^>]*>|</div>.*|\s*','',postTime)
                postTime = re.split(':',postTime)
                postTime = datetime.time(int(postTime[0]),int(postTime[1]))
                if maintime >= postTime:
                    newFile = newFile + etree.tostring(post, pretty_print=True, encoding='utf-8') + '\n<br/>'
                else:
                    newFile = newFile + body + '\n<br/>' + etree.tostring(post, pretty_print=True, encoding='utf-8') + '\n<br/>'
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


text = ''
tags = ''
fway = ''
loadExtras()
takePost()
body = makePost()
if not tags == ['']:
    addConnections(addTagsInDB(tags),addDayInDB())

db = sqlite3.connect("Diary/.extras/test.db")
cur = db.cursor()
cur.execute('SELECT * FROM tags;')
print cur.fetchall()
cur.execute('SELECT * FROM ways;')
print cur.fetchall()
cur.execute('SELECT * FROM connections;')
print cur.fetchall()
cur.close()

createFile()


##Если картинка или видео, или аудио, добавлять соответствующий тег. Проверка существования файла при создании
