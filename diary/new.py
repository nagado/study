# -*- coding:utf-8 -*-
import re, datetime, os, urllib, lxml.html
from lxml import etree

def findDT():
    DT = datetime.datetime.now()
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


def takePost():
    global text,tags
    text = raw_input("Print text of your record. If you want to make paragraph, use <br>. Also use all tags, that needed for text\n")
    tags = raw_input("Print tags, use comma to divide it\nTAGS: ")
    tags = re.sub(r'\s{2,}', '\s', tags)
    tags = re.sub(r'^\s|\s$|(?<=,)\s|\s(?=,)', '', tags)
    tags = re.split(",", tags) ##Tags. Don't forget to make them lowercase for sqlite3!



def makePost():
    global time
    twoDT = findDT()
    DT = twoDT[0]
    time = DT[1] 
    msc = twoDT[1]
    body = '<div class="post"><b>' + DT[0] + ' <div class="time"> ' + DT[1] + " </div> (" + msc[0] + ' ' + msc[1] + ' по Москве)</b><br>\n<img src="../../.extras/Media/ava.jpg" height=100px; align="left"></img>\n<div class="text">' + text + "<br>\n"
    if not tags == '':
        body = body + "TAGS: "

        for tag in tags:
            body = body + tag + ', '

    body = re.sub(r',\s$', '', body) + '</div></div>'
 
    return body


def makeWay(date):
    global fway
    date = re.split('\.', date)
    fway = 'Diary/' + date[2] + '/' + date[1] + '/' + date[0] + '.html'
    if not os.path.exists(re.sub(r'[^/]*.html', '', fway)):
        os.makedirs(re.sub(r'[^/]*.html', '', fway))


def createFile():
    global body
    newFile = '<html>\n<html lang="ru">\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<style>\nblockquote\n{\nborder-left: #999999 3px solid; \npadding-left: 5px;\n}\n\ndiv.post\n{\nmin-height:100px;\n}\n\ndiv.time\n{\ndisplay: inline;\n}\n\ndiv.text\n{\nmargin-left:100px;\n}\n\ndiv.text img\n{\nmax-height:700px; \nmax-width:700px;\n}\n\ndiv.audio\n{\nmargin-left:20px;\ncolor:#0066ff;\n}\n\ndiv.comm\n{\nmin-height:50px;\nmargin-top:10px;\n}\n\ndiv.comments\n{\nmargin-top:80px;\nmargin-left:150px;\n}\n\ndiv.comments img\n{\nmax-height:300px; \nmax-width:700px;\n}\n</style>\n</head>\n<body>\n'
    if os.path.exists(fway):
        f2 = open(fway, 'r')
        pst = f2.read()
        f2.close()
        if not body in pst:
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
                    newFile = newFile + etree.tostring(post, pretty_print=True, encoding='utf-8') + '\n<br>'
                else:
                    newFile = newFile + body + '\n<br>' + etree.tostring(post, pretty_print=True, encoding='utf-8') + '\n<br>'
                    body = ''

            if not body == '':
                newFile = newFile + body + '\n<br>'

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
time = ''
takePost()
loadExtras()
body = makePost()
createFile()
