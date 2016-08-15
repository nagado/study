##My first independent python project. Not necessarily clean, because I haven't started learning it seroisly back then.
# -*- coding:utf-8 -*-


import sys,re,os,shutil,urllib,datetime,sqlite3,filecmp,lxml.html
from lxml import etree

##FUNCTIONS

def normalize():
    global dateTime
    doc = ''

    for line in f:
        doc = doc + line

    doc = doc.decode('windows-1251').encode('utf-8')
    doc = re.sub(r'\n', '<stringEnd>', doc)
    dateTime = re.findall('<!-- Крошки -->.{,1000}<!--Подвал-->|<!-- Крошки -->.{,1000}<!-- Ушки -->', doc)
    doc = re.sub(r'^.*(?=<tr><td colspan="?3"?><h2 class="topic_title)','',doc)

    return doc


def splitDoc():
    global doc
    doc = re.split('<stringEnd>', doc)


def findTags():
    if '<a class="tag2"' in doc[2]:
        rawtags = re.search('<a class="tag2".*</a>', doc[2])
        rawtags = re.split(',', rawtags.group())
        tags = []

        for tag in rawtags:
            tag = re.sub(r'<a.*">|</a.*>|^\s+|\s+$', '', tag).lower()
            tags.append(tag)
        
        for tag in addTags:
            if not tag in tags:
                tags.append(tag)

        tags = takeTags(tags)

        return tags


def takeTags(tags):

    if len(sys.argv) > 2:
        if sys.argv[2] == '-t':
            taglist = ''
      
            for tag in tags:
                taglist = taglist + tag + ','
        
            taglist = re.sub(r', $|,$', '', taglist)
            ask = ''

            while (ask != 'Y')and(ask != 'y'):
                inptags = ''
                print "Your text is:\n", text + '\n'
                ask = raw_input("Your tags is: " + taglist + ". Do you want to change it?(Y/N): ")
                ask = re.sub(r'^\s*|\s+$', '', ask)
                ask = re.sub(r'\s{2,}', ' ', ask)
                if (ask != 'N')and(ask != 'n'):
                    inptags = raw_input("Write new tags. Use comma to divide them. If you don't want change tags, then continue. You'll have a chance to change your decision.\nTAGS: ")
                    inptags = re.sub(r'^\s*|\s+$', '', inptags)
                    inptags = re.sub(r'\s{2,}', ' ', inptags)
                    ask = raw_input("Your tags is: " + inptags + ". Is it right?(Y/N): ")
                    ask = re.sub(r'^\s*|\s+$', '', ask)
                    ask = re.sub(r'\s{2,}', ' ', ask)
                else:
                    ask = raw_input("You are not going to change your tags, right?(Y/N): ")
                    ask = re.sub(r'^\s*|\s+$', '', ask)
                    ask = re.sub(r'\s{2,}', ' ', ask)

            if not inptags == '':
                inptags = re.sub(r'\s+(?=,)|(?<=,)\s+', '', inptags)
                inptags = re.split(',',inptags)
                tags = []

                for tag in inptags:
                    tags.append(tag)
        
    return tags


def findTitle():
    title = re.sub(r'^\s+|\s+$|<tr.*">|</h.*</tr>', "", doc[0])

    return title


def findTime():
    time = re.sub(r'<!-- Крошки -->.*\sг.\s|</span></strong>.*$|(?<=[0-9]{2}:[0-9]{2}):[0-9]{2}', '',dateTime[0])

    return time


def findDate():
    date = re.sub(r'<!-- Крошки -->.*<span class="m2">|\sг\.\s.*$', '', dateTime[0])

    return date


def changeDate(date):
    months = {'января':'01', 'февраля':'02', 'марта':'03', 'апреля':'04', 'мая':'05', 'июня':'06', 'июля':'07', 'августа':'08', 'сентября':'09', 'октября':'10', 'ноября':'11', 'декабря':'12'}
    date = re.split(' ', date)
    date[1] = months[date[1]]

    if len(date[0]) == 1:
        date[0] = '0' + date[0]

    date = date[0]+'.'+date[1]+'.'+date[2]

    return date


def findDT(DT):
    
    DT = makeDate(DT)
    if not 'z' in keys:
        DT = [str(DT.strftime("%d.%m.%Y")),str(DT.strftime("%H:%M"))]
        msc = []
        twoDT = [DT,msc]

        return twoDT
    else:
        breakMoment = datetime.datetime(2013,9,26,10)
        changeDays = findChangeDays(DT.year)
        if (t>findChangeDays(t.year)[0])and(t<findChangeDays(t.year)[1]):
            msc = DT + datetime.timedelta(hours=8)
               
            if (DT<=changeDays[0])or(DT>=changeDays[1]):  
                DT = DT - datetime.timedelta(hours=1)         
        else:
            msc = DT + datetime.timedelta(hours=9)
                 
            if (DT>changeDays[0])and(DT<changeDays[1]):  
                DT = DT + datetime.timedelta(hours=1)
        if DT < breakMoment:
            global place
            if place == 0:
                place = 'L'
            elif place != 'L':
                place = place + 1
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


def makeDate(DT): 

    if DT[1] != '':
        date = re.split(r'\.',DT[0])
        time = re.split(r':',DT[1])
        DT = datetime.datetime(int(date[2]), int(date[1]), int(date[0]), int(time[0]), int(time[1]))       
    else:        
        date = re.split(r'\.',DT[0])
        DT = datetime.datetime(int(date[2]), int(date[1]), int(date[0]))   

    return DT


def findAvatar():

    if '<img class="avatar"' in doc[2]:
        avatar = re.sub(r'^.*<img class="avatar" alt="" src="', '<img src="', doc[2])
        avatar = re.sub(r'" onmouseover="sme.*$|"></a></td><td colspan="2" width="99%">.*$', '" align="left"></img>', avatar)
    else:
        avatar = '<img src="../../.extras/Media/ava.jpg" height=100px; align="left"></img>'

    return avatar


def findText():
    text = re.sub(r'^\s+|\s+$|<tr.*</a></td><td colspan="2" width="99%">|<br clear="all"><br/><font class=".*</a></font></td></tr>|<font class="m2">Категории:.*$', '', doc[2])
    text = executeText(text)

    return text


def findComments():    
    trash = ''
    output = []

    for line in doc:
        trash = trash+line

    if '<tr><td colspan="3"><a name=' in trash:
        trash = re.sub(r'<!-- google_ad_section_start.{,2500}<!-- google_ad_section_end -->', '', trash)
        comms = re.search('<tbody><tr><td colspan="3"></td></tr>.*</a></td></tr><stringEnd></tbody></table>',trash)
        comms = re.split('<stringEnd>', comms.group()) 
        n1 = 1
        n2 = 2

        for i in range(len(comms)/6+1):
            date = changeDate(re.sub(r'^\s+|\s+$|<tr><td colspan=".*<font class="m7">|\sг\.\s.*</font></td></tr>','',comms[n1]))
            time = re.sub(r'^\s+|\s+$|<tr><td colspan=".*\sг\.\s|</font>\s<font class.*</font></td></tr>|(?<=[0-9]{2}:[0-9]{2}):[0-9]{2}', '', comms[n1])
            DT = [date,time]
            DTs = findDT(DT)
            date = (DTs[0])[0]
            time = (DTs[0])[1]
            msc = DTs[1]
            nic = re.sub(r'^\s|\s$|<tr><[^<>]+><[^<>]+><[^<>]+><[^<>]+>|</a>.*$', '',comms[n1])

            if '<img class="avatar"' in comms[n2]:
                avatar = re.sub(r'^.*<img class="avatar" alt="" src="', '<img src="', comms[n2])
                avatar = re.sub(r'" onmouseover="sme.*$|"></a></td><td colspan="." width="..%">.*$', '" height=50px; align="left"></img>', avatar)
            else:
                avatar = '<img src="../../.extras/Media/ava.jpg" height=50px; align="left"></img>'

            text = re.sub(r'^\s+|\s+$|<tr valign="top"><td width="1%">.*</td><td colspan="2" width="99%">|</td></tr>', '', comms[n2])
            text = executeText(text)
            n1 = n1 + 6
            n2 = n2 + 6
            
            if 'z' in keys:
                comm = [nic, date, time, avatar, text, msc[0], msc[1]]
            else:
                comm = [nic, date, time, avatar, text]
            output.append(comm)
        
        return output


def executeText(text):  
    global addTags
    audio = ''
    if '<!-- video_end -->' in text:
        text = re.sub(r'<!-- video\[.{,350}"><input name="video_url" type="hidden" value="', '--VIDEO--', text)
        text = re.sub(r'"><img class="flag" src="[\./_a-zA-Z0-9]+" alt="Скачать" height="[0-9]+" width="[0-9]+">.{,600}end -->', '--/VIDEO--', text)
        if not 'video' in addTags:
            addTags.append('video')
    if '<!-- quote[&gt;] -->' in text:
        text = re.sub(r'<!-- end_quote --><!-- quote\[&gt;\] -->','<br/>', text)
        text = re.sub(r'(<br>)*<!-- quote\[&gt;\] -->', ' --QUOTE-- ', text)     
        text = re.sub(r'<!-- end_quote -->', ' --/QUOTE-- ', text)
        if not 'quote' in addTags:
            addTags.append('quote')
    if '<!-- url[' in text:
        text = re.sub(r'(?<=\.[a-z]{4}),', '', text)
        text = re.sub(r'(?<=\.[a-z]{3}),', '', text)
        text = re.sub(r'(?<=\.[a-z]{2}),', '', text)
        text = re.sub(r'<!-- url\[', '--LINK--', text)
        text = re.sub(r'] -->[^\[\]]+<!-- url_end -->', '--/LINK--', text)
        if not 'link' in addTags:
            addTags.append('link')
    if '<!-- img' in text:
        text = re.sub(r'<!-- img[^>]*>.{,70} src="', '--IMG--', text)
        text = re.sub(r'" alt="" onclick=".{,200}<!-- img_end -->(<br>)*', '--/IMG--', text)
        if not 'image' in addTags:
            addTags.append('image')
    if '" alt="Подкаст" title="Скачай и прослушай подкаст">' in text:
        link = (re.findall(r'<a href="http://i[0-9]*.ltalk.ru/[0-9a-zA-Z/_\-\=\+]*.mp3" target="_blank" rel="nofollow" class="favicon_processed">[^<>]*</a>', text))[0]
        text = text.replace(link, '')
        name = re.sub(r'<[^<>]*>', '', link)
        link = re.sub(r'<a href="|" target.*', '', link)
        if 'a' in keys:
            fileway = chooseFileWay(link)
            print "Downloading audio for file", arg
            urllib.urlretrieve(link, fileway)
            print "Audio downloaded"
            doubling = checkForDoubles(fileway)
            if doubling == "N":
                link = fileway
            else:
                link = doubling
                os.remove(fileway)
            link = re.sub(r'Diary','../..',link)
        audio = '<div id="audio">' + name + '\n<br><audio controls>\n<source src="'+ link + '" type="audio/mpeg">\nYour browser does not support the audio element.\n</audio>' + '</div>\n'
    text = re.sub(r'<span class="u">', '<u>', text)
    text = re.sub(r'<span class="s">', '<s>', text)
    text = re.sub(r'</span><!--u-->', '</u>', text)
    text = re.sub(r'</span><!--s-->', '</s>', text)
    text = re.sub(r'<font class="m2"><img class="smiles".*"Музыка">&nbsp;', 'Музыка: ', text)
    text = re.sub(r'<(?!/?[ius]>)(?!br>)[^<>]+>|(\n)+$|^(\n)+','',text)


    text = re.sub(r'--QUOTE--', '<blockquote> ', text)
    text = re.sub(r'--/QUOTE--', '</blockquote>', text)
    text = re.sub(r'--IMG--', '<img src="', text)
    text = re.sub(r'--/IMG--', '">', text)
    text = re.sub(r'--LINK--', '<a href="', text)
    text = re.sub(r'--/LINK--', '">Ссылка</a>', text)
    text = re.sub(r'--VIDEO--', '<iframe width="420" height="345" src="', text)
    text = re.sub(r'--/VIDEO--', '"></iframe>', text)
    text = re.compile(r'[\s\n]*<br>*[\s\n]*<br>*[\s\n]*', re.DOTALL).sub('<br>', text)
    text = re.sub(r'(<br>){2,}', '<br>', text)
    if not audio == '':
         text = text + audio

    return text


def splitDateOnFolders():

    global date,msc
    if place == 'L' and 'z' in keys:
        fold = re.split('\.', msc[0])
    else:
        fold = re.split('\.', date) 
    
    return fold


def createFoulders():
    output = 'Diary/' + fold[2] + '/' + fold[1] + '/' + fold[0] + '.html'
    if not os.path.exists(re.sub(r'[^/]*.html','',output)):
        os.makedirs(re.sub(r'[^/]*.html','',output))

    return output


def chooseFileWay(link):

    n = re.search(r'[^/]+$', link) 
    name = re.split('\.', n.group(0))
    name[0] = 0 
    folderway = "Diary/.extras/Media/"
    if not '.' in n.group(0):
        name.append("jpeg")
    fileway = folderway + str(name[0]) + '.' + str(name[1])

    while os.path.exists(fileway):
        name[0] = name[0] + 1
        fileway = folderway + str(name[0]) + '.' + str(name[1])

    return fileway


def replaceLinks(link,fileway):
  
    global avatar, text, comms
    fileway = "../.." + re.sub("Diary", '', fileway)
    link = re.sub(r'\(','\(',link)
    link = re.sub(r'\)','\)',link)
    avatar = re.sub(link, fileway, avatar)
    text = re.sub(link, fileway, text)

    if (comms != [])and(comms != None):
        for comm in comms:
            comm[3] = re.sub(link, fileway, comm[3])


def moveFiles():

    global avatar, text, comms
    tmp = avatar + text

    if (comms != [])and(comms != None):
        for comm in comms:
            tmp = tmp + comm[3]
    if 'i' in keys:
        urls = re.findall('(?<=<img src=")http://[^"]+',tmp) 
        urls2 = [] 
   
        for url in urls:
            if (not url in urls2) and (not '..' in url):
                urls2.append(url)

        for url in urls2:
            fileway = chooseFileWay(url)
            urllib.urlretrieve(url, fileway)
            doubling = checkForDoubles(fileway)
            if doubling == "N":
                replaceLinks(url, fileway)
            else:
                os.remove(fileway)
                replaceLinks(url, doubling)

    tmp = re.sub('<img src="http://[^>]+', '', tmp)
    links = re.findall('(?<=<img src=")[^"]+', tmp)
    links2 = []
    links3 = []

    for link in links:
        if (not link in links2) and (not '..' in link):
            links2.append(link)           

    for link in links2:
        doubling = checkForDoubles(argway + link)
        if doubling == "N":
            fileway = chooseFileWay(link)
            shutil.copy(argway + link, fileway)
            replaceLinks(link, fileway)
        else:
            replaceLinks(link, doubling)


def makeBody():
    if 'z' in keys:
        if place == 'L':
            body = '<div id="post"><div id="post_body"><b>"' + title + '" ' + msc[0] + ' <div id="time"> ' + msc[1] + " </div> (" + date + " " + time + " DC) </b><br/>\n" + avatar + '\n<div id="text">' + text + "<br/>\n"
        else:
            body = '<div id="post"><div id="post_body"><b>"' + title + '" ' + date + ' <div id="time"> ' + time + " </div> (" + msc[0] + " " + msc[1] + "  по Москве) </b><br/>\n" + avatar + '\n<div id="text">' + text + "<br/>\n"
    else:
        body = '<div id="post"><div id="post_body"><b>"' + title + '" ' + date + ' <div id="time"> ' + time + " </div></b><br/>\n" + avatar + '\n<div id="text">' + text + "<br/>\n"
    if '<a class="tag2"' in doc[2]:
        body = body + '<br/>TAGS:'

        for tag in tags:
            body = body + " " + tag + ','

        body = body + "<br/></div>\n"
    body = body + "</div>"
    if (comms != [])and(comms != None):
        body = body + '<div id="comments">'
        numcomm = len(comms)
        if numcomm > 3:
            JSid = 0
            if os.path.exists(postway): 
                ff = open(postway, 'r').read()

                while '<a id="displayText' + str(JSid) in ff:
                    JSid = JSid + 1

            body = body + '<a id="displayText' + str(JSid) + '" href="javascript:toggle(' + str(JSid) + ');">Показать комментарии (' + str(numcomm - 3) + ')</a>\n<div id="toggleText' + str(JSid) + '" style="display: none">'

        for comm in comms:
            numcomm = numcomm - 1
            if numcomm == 2:
                body = body + '</div>'
            if 'z' in keys:
                if place == 'L':
                    body = body + '<div id="comm">' + comm[3] + '<div style="margin:50px;display:inline;"><hr>.....<b>' + comm[0] + '</b> ' + comm[5] + ' ' + comm[6] + ' (' + comm[1] + ' ' + comm[2] + ' DC)<br/>\n' + comm[4] + '</div></div>\n' 
                else:
                    body = body + '<div id="comm">' + comm[3] + '<div style="margin:50px;display:inline;"><hr>.....<b>' + comm[0] + '</b> ' + comm[1] + ' ' + comm[2] + ' (' + comm[5] + ' ' + comm[6] + ' по Москве)<br/>\n' + comm[4] + '</div></div>\n' 
            else:
                body = body + '<div id="comm">' + comm[3] + '<div style="margin:50px;display:inline;"><hr>.....<b>' + comm[0] + '</b> ' + comm[1] + ' ' + comm[2] + '<br/>\n' + comm[4] + '</div></div>\n' 

        body = body + '</div>'

    body = body + "</div>"

    return body


def makeFile():
    f2 = open(postway,'w')
    print >>f2, '<html>\n<html lang="ru">\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<link href="../../.extras/style.css" rel="stylesheet" type="text/css" />\n<script src="../../.extras/script.js"></script>\n</head>\n<body>\n', etree.tostring(lxml.html.fromstring(body.decode("utf-8")), pretty_print=True, encoding="utf-8", method="html"), "</html></body>"
    f2.close()


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
        cur.execute('SELECT idway, way FROM ways WHERE way = "' + postway + '";')
        if cur.fetchall() == []:
            cur.execute('INSERT INTO ways (way) VALUES("' + postway + '");')
        cur.execute('SELECT idway FROM ways WHERE way ="'+ postway + '";')
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


def checkForDoubles(link):
    images = os.listdir("Diary/.extras/Media")
    doubling = "N"
    for image in images:
        if not link == "Diary/.extras/Media/" + image:
            if filecmp.cmp(link, "Diary/.extras/Media/" + image):
                doubling = "Diary/.extras/Media/" + image

    return doubling


def loadExtras():
    if not os.path.exists("Diary/.extras/Media"):
        os.makedirs("Diary/.extras/Media")
    if not os.path.exists("Diary/.extras/Media/ava.jpg"):
        urllib.urlretrieve("http://cs5298.userapi.com/g32561651/a_ea42f7ac.jpg", "Diary/.extras/Media/ava.jpg")
    if not os.path.exists("Diary/.extras/style.css"):
        style = open("Diary/.extras/style.css", "w")
        print >>style, "blockquote {\nborder-left: #999999 3px solid; \npadding-left: 5px;\n}\n\n#post_body {\nmin-height:110px;\n}\n\n#post {\nmin-height:110px;\n}\n\n#time {\ndisplay: inline;\n}\n\n#text {\nmargin-left:100px;\n}\n\n#text img {\nmax-height:700px; \nmax-width:700px;\n}\n\n#audio {\nmargin-left:20px;\ncolor:#0066ff;\n}\n\n#comm {\nmin-height:50px;\nmargin-top:10px;\n}\n\n#comments {\nmargin-left:150px;\n}\n\n#comments img {\nmax-height:300px; \nmax-width:700px;\n}\n"
        style.close() 
    if not os.path.exists("Diary/.extras/script.js"):
        script = open("Diary/.extras/script.js", 'w')
        print >>script, 'function toggle(id) {\n	var ele = document.getElementById("toggleText" + id);\n	var text = document.getElementById("displayText" + id);\n	if(ele.style.display == "block") {\n    		ele.style.display = "none";\n		text.innerHTML = "Показать комментарии";\n  	}\n	else {\n		ele.style.display = "block";\n		text.innerHTML = "Скрыть комментарии";\n	}\n} '
        script.close()


def executeFile():
    global body
    newFile = '<html>\n<html lang="ru">\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<link href="../../.extras/style.css" rel="stylesheet" type="text/css" />\n<script src="../../.extras/script.js"></script>\n</head>\n<body>\n'
    f2 = open(postway, 'r')
    pst = f2.read()
    f2.close()
    if not re.sub(r'<a id="displayText[0-9*]" href="javascript:toggle([0-9]*);">|<div id="toggleText[0-9]*"', '', body) in re.sub(r'<a id="displayText[0-9*]" href="javascript:toggle([0-9]*);">|<div id="toggleText[0-9]*"', '', pst):
        if place == "L":
            maintime = re.split(':',msc[1])
        else:
            maintime = re.split(':',time)
        maintime = datetime.time(int(maintime[0]),int(maintime[1]))
        pstt = lxml.html.fromstring(pst) 
        posts = pstt.xpath("//div[@id='post']") 
        for post in posts:
            postTime = lxml.html.fromstring(etree.tostring(post, pretty_print=True, encoding='utf-8', method="html")).xpath("//div[@id='time']")
            postTime = etree.tostring(postTime[0], pretty_print=True, encoding='utf-8')
            postTime = re.sub(r'^.*<div[^>]*>|</div>.*|\s*','',postTime)
            postTime = re.split(':',postTime)
            postTime = datetime.time(int(postTime[0]),int(postTime[1]))
            post = etree.tostring(post, pretty_print=True, encoding='utf-8', method="html")
            if maintime > postTime:
                newFile = newFile + post + '\n<br/>'
            else:
                newFile = newFile + body + '\n<br/>' + post + '\n<br/>'
                body = ''

        if not body == '':
            newFile = newFile + body + '\n<br/>'

        f2 = open(postway, 'w')
        print >>f2, newFile, '</html></body>'
        f2.close()

##MAIN



keys = ''
arguments = []

for i in range(len(sys.argv)):
    if '-' in sys.argv[i]:
        keys = keys + re.sub(r'[+-]*', '', sys.argv[i])
    elif i != 0:
        if '.html' in sys.argv[i] or '.htm' in sys.argv[i]:
            arguments.append(sys.argv[i])

        else:
            arglist = os.listdir(sys.argv[i])

            for arg in arglist:
                if '.html' in arg or '.htm' in arg:
                    arguments.append(sys.argv[i] + "/" + arg)

if 'h' in keys:
    readme = open('README.txt', 'r')
    
    for line in readme:
        print line

    readme.close()
else:

    for arg in arguments:
        argway = re.sub(r'[^/]+$', '', arg)
        f = open(arg, 'r')
        t = datetime.datetime.fromtimestamp(os.path.getmtime(sys.argv[1])) ##For selenium change to .now
        dateTime = ''
        place = 0
        addTags = []
        doc = normalize()
        loadExtras()
        comms = findComments() 
        splitDoc()
        title = findTitle()
        time = findTime()
        date = changeDate(findDate())
        DT = [date,time]
        DTs = findDT(DT)
        date = (DTs[0])[0]
        time = (DTs[0])[1]
        msc = DTs[1]
        avatar = findAvatar()
        text= findText()
        tags = findTags()
        fold = splitDateOnFolders()
        postway = createFoulders()
        moveFiles()
        body = makeBody()
        if tags != []:
            addConnections(addTagsInDB(tags),addDayInDB())
        body = etree.tostring(lxml.html.fromstring(body.decode("utf-8")), pretty_print=True, encoding="utf-8", method="html")
        if os.path.exists(postway):
            executeFile()
        else:
            makeFile()
        f.close()
