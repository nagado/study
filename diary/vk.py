# -*- coding:utf-8 -*-

import re, sys, lxml.html, datetime, os, shutil, urllib, filecmp, sqlite3
from lxml import etree


def normalize():
    doc = ''

    for line in f:
        doc = doc + line

    doc = doc.decode('windows-1251')

    return doc


def findPosts():
    global doc
    posts = []  
    divids = re.findall('<div id="post-[0-9]*_[0-9]*" class="post all own', doc)    
    doc = re.split('\n',doc)
    
    for divid in divids:

        for i in range(len(doc)):

            if divid in doc[i]:
                post = re.sub(r'^.*(?=<div id="post-)', '', doc[i]) + '\n'
                divs = 0
                i =  i + 1
                post = post + doc[i]
                divs = divs + len(re.findall('<div', doc[i])) - len(re.findall('</div>', doc[i]))
                i =  i + 1
                post = post + doc[i]
                divs = divs + len(re.findall('<div', doc[i])) - len(re.findall('</div>', doc[i]))
            
                while (divs != 1):
                    post = post + doc[i] + '\n'
                    divs = divs + len(re.findall('<div', doc[i])) - len(re.findall('</div>', doc[i]))
                    i = i + 1

                posts.append(post)

    return posts


def takePost(post):
    global tags, p
    p = ''
    post = lxml.html.fromstring(post) 
    textbody = post.xpath("//div[@class='post_info']")
    for fullpost in textbody:      
        els = fullpost.xpath("//div[@class='wall_text']")
        for el in els:
            el = etree.tostring(el, pretty_print=True, encoding='utf-8')
            body = ''
            body = findDateAndTime(fullpost,body) + '<img src="../../.extras/Media/ava.jpg" height="100px;" align="left"></img>\n'
            text = re.compile(r'<a class="published_by_photo".*', re.DOTALL).sub(' ', el)
            body = findText(text, body)
            body = findQuote(el, body)
            body = findImages(el,body)
            body = findVideo(el, body)
            body = findAudio(el, body)   
            body = body + '</div>'

        body = makeComments(fullpost,body)
        tags = takeTags(tags)
        executeTags(tags)
        if tags != [] and tags != '':
            tagslist = 'TAGS: '

            for tag in tags:
                tagslist = tagslist + tag + ', '

            tagslist = re.sub(r',$|,\s$', '', tagslist)
            body = re.sub('TAGS:', tagslist, body)
        else:
            body = re.sub('TAGS: <br/>\n', '', body)
        
        body = '<div class="post">' + body + '</div>\n'
        createPost(body)


def makeComments(post,body):
    if "reply reply_dived clear  reply_replieable" in etree.tostring(post, pretty_print=True, encoding='utf-8'):
        avatars = {}
        comms = post.xpath("//div[@class='reply reply_dived clear  reply_replieable']")
        body = body + '<div class="comments">'
        for comm in comms:
            comm =  etree.tostring(comm, pretty_print=True, encoding='utf-8')
            comment = ''
            nic = re.findall('<a class="author" href="[^"]*" data-from-id="[^"]*">[^<>]*</a>', comm)
            nic = re.sub(r'<[^<>]*>','',nic[0])
            DT = re.findall(r'<a class="wd_lnk".*', comm)
            DT = re.sub(r'</span>.*|<[^<>]*>','',DT[0])
            DT = translateDate(DT)
            DTs = findDT(DT)
            DT = DTs[0]
            msc = DTs[1]
            avatar = re.findall(r'(?<=<img src=")[^"]*(?=" width="50" height="50" class="reply_image"/>)',comm)

            if avatar[0] in avatars:
                ava = '<img src="' + avatars[avatar[0]] + '" height="50px;" align="left"></img>'
            else:
                ava = moveFile(avatar[0])
                newOld = {avatar[0]:ava}
                avatars.update(newOld)
                ava = '<img src="' + ava + '" height="50px;" align="left"></img>'

            if '<div class="wall_reply_text">' in comm:
                text = re.findall(r'<div class="wall_reply_text">.*', comm)
                text = re.compile(r'^.*<div class="wall_reply_text">|</div>.*|<[^<>]*>', re.DOTALL).sub('', text[0])
                links = changeLinksInText(text)
                text = re.compile(r'<[^<>]*>', re.DOTALL).sub('', text)

                for link in links:
                    text = text + link

            else:
                text = ''

            text = findImages(comm,text)
            text = findAudio(comm,text)
            text = findVideo(comm,text)
            if 'z' in keys:
                if place == 'L':
                    comment = '<div class="comm">' + ava + '<div style="margin-left:"50px";display:inline;"><hr>.....<b>' + nic + '</b> ' + msc[0] + ' ' + msc[1] + ' (' + DT[0] + ' ' + DT[1] + ' DT)' + '<br/>' + text + '</div></div>\n'
                else:
                    comment = '<div class="comm">' + ava + '<div style="margin-left:"50px";display:inline;"><hr>.....<b>' + nic + '</b> ' + DT[0] + ' ' + DT[1] + ' (' + msc[0] + ' ' + msc[1] + ' по Москве)' + '<br/>' + text + '</div></div>\n' 
            else:
                comment = '<div class="comm">' + ava + '<div style="margin-left:"50px";display:inline;"><hr>.....<b>' + nic + '</b> ' + DT[0] + ' ' + DT[1] + '<br/>' + text + '</div></div>\n'
            body = body + comment
  
        body = body + '</div>'

    return body


def findText(text,body):
    global tags, texxt, p
    body = body + '<div class="text">'
    if '<div class="wall_post_text">' in text:
        text = re.sub('<br/>', '\n', text)
        if '<a href="http://vk.com/' in text:
            tags = re.findall(r'<a href="http://vk.com/[^<>]*>#[^<>]*</a>', text)
            text = re.sub(r'<a href="http://vk.com/[^<>]*>#[^<>]*</a>', ' ', text)
        if  '<a class="lnk" href="' in text:
            links = re.findall(r'(?<=<a class="lnk" href="http://vk.com/away.php\?to=)h[^"]*',text)
            for link in links:
                link = re.sub(r'&amp;.*', '', link)
                link = re.sub('%2F', '/', link)
                link = re.sub('%3A', ':', link)
                link = '<a href="' + link + '">Ссылка</a><br/>'
                body = body + link
        text = re.compile('^.*<div class="wall_post_text">|</div>.*|<a class="wall_post_more".{,130}</a>', re.DOTALL).sub('', text)
        links = changeLinksInText(text)

        for link in links:
            body = body + link

        text = re.sub(r'<a href="http[^<>]*>[^<>]*</a>', ' ', text)
        text = re.compile('<[^<>]*>', re.DOTALL).sub('', text)
        text = re.sub('\n', '<br/>', text)
        text = re.sub(r'(<br/>){3,}', '<br/><br/>', text)

        for i in range(1,20):
            text = re.sub(r'^(<br/>|\s)|(<br/>|\s)$', '', text)

        body = body + text + '<br/>\n'
        if p == '':
            texxt = text 
        if tags != '':
            body = body + "TAGS: <br/>\n"

    return body


def executeTags(tags):
    if tags != []:
        addConnections(addTagsInDB(tags),addDayInDB())


def changeLinksInText(text):
    links2 = []
    if  '<a href="' in text:
        links = re.findall(r'(?<=<a href="http://vk.com/away.php\?to=)h[^"]*',text)
        for link in links:
            link = re.sub(r'&amp;.*', '', link)
            link = re.sub('%2F', '/', link)
            link = re.sub('%3A', ':', link)
            link = '<a href="' + link + '">Ссылка</a><br/>'
            links2.append(link)
    
    return links2    


def findQuote(el, body):       
 
    if '<a class="published_by_photo"' in el:
        link = (re.findall(r'(?<=<a class="published_by_photo" href=")[^"]*(?="><img src=")', el))[0]
        url = (re.findall(r'<a class="published_by_photo" href="[^"]*"><img src="[^"]*', el))[0]
        url = re.sub(r'^.*<img src="', '',url)
        repost = re.findall(r'<a class="published_by_photo".*', el, re.DOTALL)
        title = re.findall(r'<a class="published_by".*', repost[0])
        title = re.sub(r'<[^<>]*>|^\s|\s$', '', title[0])
        dateTime = re.findall(r'<div class="published_by_date sm">.*', repost[0])
        dateTime = re.sub(r'<[^<>]*>|^\s|\s$', '', dateTime[0])
        top = title

        if not('видеозапись' in dateTime or 'фотография' in dateTime):

            if 'вчера' in dateTime:
                date = (t - datetime.timedelta(days=1)).strftime("%d.%m.%Y")
                time =  re.sub(r'.*в\s|\n', '', dateTime)
            elif 'сегодня' in dateTime:
                date = (t).strftime("%d.%m.%Y")
                time =  re.sub(r'.*в\s|\n', '', dateTime)

            elif ' в ' in dateTime:
                date = re.sub(r'\sв.*','',dateTime)
                date = date + ' ' + str(t.year)
                date = changeDate(re.sub('\n','',date))
                time = re.sub(r'.*в\s|\n', '', dateTime)
            else:
                date = changeDate(dateTime)

            top = '<img src="' + moveFile(url) + '"></img><b><a href="' + link + '">' + top + '</a> (' + date + ' ' + time + ')</b><br/>\n'
        
        body = body + '<blockquote>' + top
        body = findText(repost[0],body) + '</div>'
        body = body + '</blockquote><br/>\n'
        if not 'quote' in addTags:
            addTags.append('quote')

    return body
     

def findImages(el, body):
    if '<div class="page_post_queue_narrow"><div class="page_post_sized_thumbs' in el:
        links = re.compile(r'^.*(?=<div class="page_post_queue_narrow"><div class="page_post_sized_thumbs  clear_fix" style="width:)', re.DOTALL).sub('', el)

        links = re.findall(r'<a.{,100} onclick="return showPhoto.{,500}class="[^"]*"><img src="[^"]*".{,100}class="page_post_thumb_sized_photo"/></a>', links)

        for link in links:
            link = re.findall(r'http://cs[^]]*', link)
            link = re.sub(r'&quot;,&quot;x_&quot;:\[&quot;|&quot;.*', '', link[0])
            link = link + '.jpg'
            if 'i' in keys:
                link = downloadFile(link)
            body = body + '<img src="' + link + '"></img>'

        body = body + '<br/>'
        if not 'image' in addTags:
            addTags.append('image')
    return body


def findAudio(el, body):
    if '<div class="title_wrap fl_l"' in el:
        audios = re.findall('<input type="hidden" id=".*\n.*\n.*', el)
        body = body + '<div class="audio">'

        for audio in audios:
            link = re.compile(r'^.*value="(?=http://)|(?<=.mp3).*',re.DOTALL).sub('',audio)
            if 'value="http://' not in audio:
                continue
            if 'a' in keys:
                link = downloadFile(link)
            audio = re.compile(r'^.*(?=<div class="title_wrap fl_l")|<[^<>]*>', re.DOTALL).sub('', audio)
            body = body + audio + '<br/>\n<audio controls>\n<source src="'+ link + '" type="audio/mpeg">\nYour browser does not support the audio element.\n</audio><br/>\n'
            if not 'audio' in addTags:
                addTags.append('audio')

        body = body + '</div><br/>\n'

    return body
    

def findVideo(el, body):
    if '<a href="http://vk.com/video' in el:
        body = body + '<div class="video">Video:<br/>\n'
        videos = re.findall('<div class="page_post_queue_narrow"><div class="page_post_sized.*\n.*\n.*', el)
        
        for video in videos:
            video = re.split(r'\n', video)
            link = (re.findall(r'http://vk.com/video.[0-9]*_[0-9]*', video[0]))[0]
            image = (re.findall(r'(?<=<img src=")[^"]+', video[0]))[0]
            image = moveFile(image)
            title = re.sub(r'^.*<span class="a post_video_title">|</span>.*|<[^<>]*>', '', video[2])
            assembly = '<a href="' + link + '"> "' + title + '" <br/>\n<img src="' + image + '"></img></a><br/>\n'
            body = body + assembly

        body = body + '</div>'
        if not 'video' in addTags:
            addTags.append('video')

    return body


def checkForDoubles(link):
    files = os.listdir("Diary/.extras/Media")
    doubling = "N"

    for fle in files:
        if not link == "Diary/.extras/Media/" + fle:
            if filecmp.cmp(link, "Diary/.extras/Media/" + fle):
                doubling = "Diary/.extras/Media/" + fle

    return doubling


def downloadFile(url):
    fileway = chooseFileWay(url)
    print "Downloading attachments for post by date", re.sub(r'Diary/|/[0-9]*/[0-9]*\.jpg', '', fway)
    urllib.urlretrieve(url, fileway)
    doubling = checkForDoubles(fileway)
    if not doubling == "N":
        os.remove(fileway)
        fileway = doubling
    fileway = re.sub(r'Diary/.extras/Media/', '../../.extras/Media/', fileway)

    return fileway


def moveFile(link):
    doubling = checkForDoubles(argway + link)
    if doubling == "N":
        fileway = chooseFileWay(link)
        shutil.copy(argway + link, fileway)
    else:
        fileway = doubling

    fileway = re.sub(r'Diary/.extras/Media/', '../../.extras/Media/', fileway)

    return fileway


def chooseFileWay(link):
    n = re.search(r'[^/]+$', link) ##Найти имя
    name = re.split('\.', n.group(0)) ##разделить по точке
    name[0] = 0 
    fileway = 'Diary/.extras/Media/' + str(name[0]) + '.' + str(name[1])

    while os.path.exists(fileway):
        name[0] = name[0] + 1
        fileway = 'Diary/.extras/Media/' + str(name[0]) + '.' + str(name[1])
   
    return fileway


def findDateAndTime(post,body):
    DT = post.xpath("//div[@class='reply_link_wrap sm']")
    global newPostTime
    newPostTime = ''
    if '<span class="rel_date' in etree.tostring(DT[0], pretty_print=True, encoding='utf-8'):
        DT = DT[0].xpath("//span[@class='rel_date'] | //span[@class='rel_date rel_date_needs_update']")
        DT = etree.tostring(DT[0], pretty_print=True, encoding='utf-8')
        DT = re.sub(r'<[^<>]*>|\n', '', DT)
        DT = translateDate(DT)
        DTs = findDT(DT)
        DT = DTs[0]
        msc = DTs[1]
        if place == 'L':
            makeWay(msc)
        else:
            makeWay(DT)
        newPostTime = DT[1]
        if 'z' in keys:
            if place == 'L':
                if not k == "not accurate":
                    body = body + '<b>' + msc[0] + ' <div class="time">' + msc[1] + '</div> (' + DT[0] + ' ' + DT[1] + ' DC) </b><br/> \n'
                else:
                    body = body + '<b>' + msc[0] + ' <div class="time">' + msc[1] + '</div> (' + DT[0] + ' ' + DT[1] + ' DC)</b>\n<sup>Время не было указано, может быть неточность не более, чем в 24часа</sup><br/>\n'
            else:
                if not k == "not accurate":
                    body = body + '<b>' + DT[0] + ' <div class="time">' + DT[1] + '</div> (' + msc[0] + ' ' + msc[1] + ' по Москве) </b><br/> \n'
                else:
                    body = body + '<b>' + DT[0] + ' <div class="time">' + DT[1] + '</div> (' + msc[0] + ' ' + msc[1] + ' по Москве)</b>\n<sup>Время не было указано, может быть неточность не более, чем в +24часа</sup><br/>\n'
        else:
            body = body + '<b>' + DT[0] + ' <div class="time">' + DT[1] + '</div></b><br/>\n'

    return body


def translateDate(DT):
    global k,t,zz
    k = 'actual'
    if ('секунд' in DT)or('только что' in DT):
        date = t.strftime("%d.%m.%Y")
        time = t.strftime("%H:%M")
    elif ' минут' in DT:
        date = (t - datetime.timedelta(minutes=int(re.sub(r'[^0-9]*','',DT)))).strftime("%d.%m.%Y")
        time = (t - datetime.timedelta(minutes=int(re.sub(r'[^0-9]*','',DT)))).strftime("%H:%M")
    elif 'минуту ' in DT:
        date = (t - datetime.timedelta(minutes=1)).strftime("%d.%m.%Y")
        time = (t - datetime.timedelta(minutes=1)).strftime("%H:%M")
    elif 'час ' in DT:
        date = (t - datetime.timedelta(hours=1)).strftime("%d.%m.%Y")
        time = (t - datetime.timedelta(hours=1)).strftime("%H:%M")
    elif 'два часа' in DT:
        date = (t - datetime.timedelta(hours=2)).strftime("%d.%m.%Y")
        time = (t - datetime.timedelta(hours=2)).strftime("%H:%M")
    elif 'три часа' in DT:
        date = (t - datetime.timedelta(hours=3)).strftime("%d.%m.%Y")
        time = (t - datetime.timedelta(hours=3)).strftime("%H:%M")
    elif 'вчера ' in DT:
        date = (t - datetime.timedelta(days=1)).strftime("%d.%m.%Y")
        time =  re.sub(r'.*в\s|\n', '', DT)
    elif 'сегодня' in DT:
        date = t.strftime("%d.%m.%Y")
        time =  re.sub(r'.*в\s|\n', '', DT)
    elif ' в ' in DT:
        date = re.sub(r'\sв.*','',DT)
        date = date + ' ' + str(t.year)
        date = changeDate(re.sub('\n','',date))
        time = re.sub(r'.*в\s|\n', '', DT)
    else:
        date = changeDate(DT)
        time = ''
        if 'd' in keys and zz == 0:
            ask = ''
            print "\nDate is: ", date            

            while ask != 'y':
                time = raw_input("Enter time in format hh:mm: ")
                time = re.sub(r'(?<=[012345][0-9]:[012345][0-9]).*|.*(?=[012345][0-9]:[012345][0-9])', '', time)
                print "Your time is ", time, "."
                ask = re.sub(r'\s', '', raw_input("Right?(y/n)")).lower()
            
            zz = 1
        else:
            k = "not accurate"
    DT = [date, time] 

    return DT


def changeDate(date):
    months = {'янв':'01', 'фев':'02', 'мар':'03', 'апр':'04', 'мая':'05', 'июн':'06', 'июл':'07', 'авг':'08', 'сен':'09', 'окт':'10', 'ноя':'11', 'дек':'12'}
    date = re.split(r'\s', date)
    if date[1] in months:
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
            else:
                place = 'N'
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


def makeWay(DT):
    fold = re.split('\.', DT[0])     
    output = 'Diary/' + fold[2] + '/' + fold[1] + '/' + fold[0] + '.html'
    if not os.path.exists(re.sub('[^/]*.html', '', output)):
        os.makedirs(re.sub('[^/]*.html', '', output))
        
    global f2
    global fway
    fway = re.sub('.html','',output)


def takeTags(tags):

    global addTags
    tagslist = [] 
       
    for tag in tags:
        newtag = re.sub(r'^.*>#|@.*|<[^<>]*>', '', tag)
        tagslist.append(newtag)
    
    tags = tagslist
    if 't' in keys:
        taglist = ''
  
        for tag in tags:
            taglist = taglist + tag + ','
        
        taglist = re.sub(r', $|,$', '', taglist)
        ask = ''

        while (ask != 'Y')and(ask != 'y'):
            inptags = ''
            print "\nYour text is:\n", texxt + '\n'
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


    if addTags != []: 

        for tag in addTags:
            if not tag in tags:
                tags.append(tag)
        
    return tags


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
        cur.execute('SELECT idway, way FROM ways WHERE way = "' + fway + '.html";')
        if cur.fetchall() == []:
            cur.execute('INSERT INTO ways (way) VALUES("' + fway + '.html");')
        cur.execute('SELECT idway FROM ways WHERE way ="'+ fway + '.html";')
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



def createPost(body):
    newFile = '<html>\n<html lang="ru">\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<style>\nblockquote\n{\nborder-left: #999999 3px solid; \npadding-left: 5px;\n}\n\ndiv.post\n{\nmin-height:110px;\n}\n\ndiv.time\n{\ndisplay: inline;\n}\n\ndiv.text\n{\nmargin-left:100px;\n}\n\ndiv.text img\n{\nmax-height:700px; \nmax-width:700px;\n}\n\ndiv.audio\n{\nmargin-left:20px;\ncolor:#0066ff;\n}\n\ndiv.comm\n{\nmin-height:50px;\nmargin-top:10px;\n}\n\ndiv.comments\n{\nmargin-top:80px;\nmargin-left:150px;\n}\n\ndiv.comments img\n{\nmax-height:300px; \nmax-width:700px;\n}\n</style>\n</head>\n<body>\n' 
    body = etree.tostring(lxml.html.fromstring(body.decode("utf-8")), pretty_print=True, encoding="utf-8", method="html")
    if os.path.exists(fway + '.html'):
        f2 = open(fway + '.html', 'r')
        pst = f2.read()
        f2.close()
        if not body in pst:
            maintime = re.split(':',newPostTime)
            maintime = datetime.time(int(maintime[0]),int(maintime[1]))
            pstt = lxml.html.fromstring(pst) 
            posts = pstt.xpath("//div[@class='post']")   

            for post in posts:
                postTime = post.xpath("//div[@class='time']")
                postTime = etree.tostring(postTime[0], pretty_print=True, encoding='utf-8')
                postTime = re.sub(r'^.*<div[^>]*>|</div>.*|\s*','',postTime)
                postTime = re.split(':',postTime)
                postTime = datetime.time(int(postTime[0]),int(postTime[1]))
                post = etree.tostring(post, pretty_print=True, encoding='utf-8', method="html")
                if maintime >= postTime and body == '':
                    newFile = newFile + post + '\n<br/>'
                else:
 
                    newFile = newFile + body + '\n<br/>' + post + '\n<br/>'
                    body = ''

            if not body == '':
                newFile = newFile + body + '\n<br/>'

            f2 = open(fway + '.html', 'w')
            print >>f2, newFile, '</html></body>'
            f2.close() 
    else:
        f2 = open(fway + '.html', 'w')
        newFile = newFile + body + '</body></html>'
        print >>f2, newFile
        f2.close()  


def loadExtras():
    if not os.path.exists("Diary/.extras/Media"):
        os.makedirs("Diary/.extras/Media")
    if not os.path.exists("Diary/.extras/Media/ava.jpg"):
        urllib.urlretrieve("http://cs5298.userapi.com/g32561651/a_ea42f7ac.jpg", "Diary/.extras/Media/ava.jpg")
        

##MAIN:
keys = ''
arguments = []

for i in range(len(sys.argv)):
    if '-' in sys.argv[i]:
        keys = keys + re.sub(r'[+-]*', '', sys.argv[i])
    if (i != 0)and(not '-' in sys.argv[i]):
        arguments.append(sys.argv[i])
        
if 'h' in keys:
    readme = open('README.txt', 'r')
    
    for line in readme:
        print line

    readme.close()
else:
    for arg in arguments:
        print "Be sure, that your date and time on computer is right, because you can have wrong result. Language of vk.com is RUS, and there is nothing else, just wall without open messages"
        f = open(arg, 'r')
        argway = re.sub(r'[^/]+$', '', arg)
        f2 = ''
        fway = ''
        doc = normalize()
        posts = findPosts()
        loadExtras()
        k = ''
        newPostTime = ''
        t = datetime.datetime.fromtimestamp(os.path.getmtime(arg)) ##For selenium change to .now

        for post in posts:
            addTags =  []
            texxt = ''
            tags = []
            place = 0
            zz = 0
            takePost(post)

        f.close()
##Селениум.
