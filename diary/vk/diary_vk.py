# -*- coding:utf-8 -*-

import re, sys, lxml.html, datetime, os, shutil, urllib
from lxml import etree

f = open(sys.argv[1], 'r')
f2 = ''
fway = ''




def normalize():

    doc = ''

    for line in f:
        doc = doc + line

    doc = doc.decode('windows-1251')
    return doc

def findPosts():
 
    global doc
    doc = re.split('\n',doc)
    posts = []

    for i in range(len(doc)):

        if '<div id="post-' in doc[i]:
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

    post = lxml.html.fromstring(post) 
   
    textbody = post.xpath("//div[@class='post_info']")
    for fullpost in textbody:      
        els = fullpost.xpath("//div[@class='wall_text']")
        for el in els:
            el = etree.tostring(el, pretty_print=True, encoding='utf-8')

            body = ''
            body = findDateAndTime(fullpost,body)
            text = re.compile(r'<a class="published_by_photo".*', re.DOTALL).sub(' ', el)
            body = findText(text, body)
            body = findQuote(el, body)
            body = findImages(el,body)
            body = findVideo(el, body)
            body = findAudio(el, body)

        body = makeComments(fullpost,body)
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
            avatar = re.findall(r'(?<=<img src=")[^"]*(?=" width="50" height="50" class="reply_image"/>)',comm)

            if avatar[0] in avatars:
                ava = '<img src="' + avatars[avatar[0]] + '" height=50px; align="left"></img>'
            else:
                ava = moveFile(avatar[0])
                newOld = {avatar[0]:ava}
                avatars.update(newOld)
                ava = '<img src="' + ava + '" height=50px; align="left"></img>'

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
            comment = ava + '<div style="margin-left:50px;"><hr>.....<b>' + nic + '</b> ' + DT[0] + ' ' + DT[1] + '<br>' + text + '</div><br>'
            body = body + comment
  
        body = body + '</div>'

    return body

def findText(text,body):

    if '<div class="wall_post_text">' in text:
        text = re.sub('<br/>', '\n', text)

        if '<a href="http://vk.com/' in text:
            tags = re.findall(r'<a href="http://vk.com/[^<>]*>#[^<>]*</a>', text) ##Tags saved
            text = re.sub(r'<a href="http://vk.com/[^<>]*>#[^<>]*</a>', ' ', text)

        if  '<a class="lnk" href="' in text:
            links = re.findall(r'(?<=<a class="lnk" href="http://vk.com/away.php\?to=)h[^"]*',text)
            for link in links:
                link = re.sub(r'&amp;.*', '', link)
                link = re.sub('%2F', '/', link)
                link = re.sub('%3A', ':', link)
                link = '<a href="' + link + '">Ссылка</a><br>'
                body = body + link

        text = re.compile('^.*<div class="wall_post_text">|</div>.*|<a class="wall_post_more".{,130}</a>', re.DOTALL).sub('', text)
        links = changeLinksInText(text)

        for link in links:
            body = body + link

        text = re.sub(r'<a href="http[^<>]*>[^<>]*</a>', ' ', text)
        text = re.compile('<[^<>]*>', re.DOTALL).sub('', text)
        text = re.sub('\n', '<br>', text)
        text = re.sub(r'(<br>){3,}', '<br><br>', text)

        for i in range(1,20):
            text = re.sub(r'^(<br>|\s)|(<br>|\s)$', '', text)
        body = body + text + '<br>\n'

    return body

def changeLinksInText(text):

    links2 = []
    if  '<a href="' in text:
        links = re.findall(r'(?<=<a href="http://vk.com/away.php\?to=)h[^"]*',text)
        for link in links:
            link = re.sub(r'&amp;.*', '', link)
            link = re.sub('%2F', '/', link)
            link = re.sub('%3A', ':', link)
            link = '<a href="' + link + '">Ссылка</a><br>'
            links2.append(link)
    
    return links2
            


def findQuote(el, body):        

    if '<a class="published_by_photo"' in el:
        repost = re.findall(r'<a class="published_by_photo".*', el, re.DOTALL)
        title = re.findall(r'<a class="published_by".*', repost[0])
        title = re.sub(r'<[^<>]*>|^\s|\s$', '', title[0])
        dateTime = re.findall(r'<div class="published_by_date sm">.*', repost[0])
        dateTime = re.sub(r'<[^<>]*>|^\s|\s$', '', dateTime[0])
        top = title

        if not('видеозапись' in dateTime or 'фотография' in dateTime):

            if 'вчера' in dateTime:
                date = (datetime.date.today() - datetime.timedelta(days=1)).strftime("%d.%m.%Y")
                time =  re.sub(r'.*в\s|\n', '', dateTime)
            elif 'сегодня' in dateTime:
                date = (datetime.date.today()).strftime("%d.%m.%Y")
                time =  re.sub(r'.*в\s|\n', '', dateTime)

            elif ' в ' in dateTime:
                date = re.sub(r'\sв.*','',dateTime)
                date = date + ' ' + str(datetime.date.today().year)
                date = changeDate(re.sub('\n','',date))
                time = re.sub(r'.*в\s|\n', '', dateTime)
            else:
                date = changeDate(dateTime)


##            date = changeDate(date)
##            time = re.sub(r'^.*\sв\s|^\s|\s$', '', dateTime)
            top = top + ' (' + date + ' ' + time + ')<br>\n'
        
        body = body + '<blockquote>' + top
##        print repost[0]
        body = findText(repost[0],body)
        body = body + '</blockquote><br>\n'


    return body
     
def findImages(el, body):
    
    if '<div class="page_post_queue_narrow"><div class="page_post_sized_thumbs' in el:
        links = re.compile(r'^.*(?=<div class="page_post_queue_narrow"><div class="page_post_sized_thumbs  clear_fix" style="width:)', re.DOTALL).sub('', el)

        links = re.findall(r'<a.{,100} onclick="return showPhoto.{,500}class="[^"]*"><img src="[^"]*".{,100}class="page_post_thumb_sized_photo"/></a>', links)

        for link in links:
            link = re.findall(r'http://cs[^]]*', link)
            link = re.sub(r'&quot;,&quot;x_&quot;:\[&quot;|&quot;.*', '', link[0])
            link = link + '.jpg'
            body = body + '<img src="' + downloadFile(link) + '"></img>'

        body = body + '<br>'
 
    return body

def findAudio(el, body):

    if '<div class="title_wrap fl_l"' in el:
        audios = re.findall('<input type="hidden" id=".*\n.*\n.*', el)
        body = body + '<div class="audio">'
        for audio in audios:
            link = re.compile(r'^.*value="(?=http://)|(?<=.mp3).*',re.DOTALL).sub('',audio)
            audio = re.compile(r'^.*(?=<div class="title_wrap fl_l")|<[^<>]*>', re.DOTALL).sub('', audio)
            body = body + audio + '<br>\n<audio controls>\n<source src="'+ link + '" type="audio/mpeg">\nYour browser does not support the audio element.\n</audio>' + '<br>\n'

        body = body + '</div><br>\n'

    return body
    
def findVideo(el, body):

    if '<a href="http://vk.com/video' in el:
        body = body + '<div class="video">Video:<br>\n'
        videos = re.findall('<div class="page_post_queue_narrow"><div class="page_post_sized.*\n.*\n.*', el)
        
        for video in videos:
            video = re.split(r'\n', video)
            link = (re.findall(r'http://vk.com/video.[0-9]*_[0-9]*', video[0]))[0]
            image = (re.findall(r'(?<=<img src=")[^"]+', video[0]))[0]
            image = moveFile(image)
            title = re.sub(r'^.*<span class="a post_video_title">|</span>.*|<[^<>]*>', '', video[2])
            assembly = '<a href="' + link + '"> "' + title + '" <br>\n<img src="' + image + '"></img></a><br>\n'
            body = body + assembly

        body = body + '</div>'

    return body

def downloadFile(url):

    fileway = chooseFileWay(url)
    print "Downloading picture for day:", re.sub(r'_[0-9]*|/[0-9]\..*', '', fileway)
    urllib.urlretrieve(url, fileway)
    fileway = re.sub(r'[0-9]{4}/[0-9]{2}/[0-9]{2}/', '', fileway)
    return fileway

def moveFile(link):

    fileway = chooseFileWay(link)
    shutil.copy(link, fileway)
    fileway = re.sub(r'[0-9]{4}/[0-9]{2}/[0-9]{2}/', '', fileway)
    return fileway

def chooseFileWay(link):

    if not os.path.exists(fway):
        os.makedirs(fway)

    n = re.search(r'[^/]+$', link) ##Найти имя
    name = re.split('\.', n.group(0)) ##разделить по точке
    name[0] = 0 
    

    fileway = fway + '/' + str(name[0]) + '.' + str(name[1])

    while os.path.exists(fileway):
        name[0] = name[0] + 1
        fileway = fway + '/' + str(name[0]) + '.' + str(name[1])
   
    return fileway

def findDateAndTime(post,body):

    DT = post.xpath("//div[@class='reply_link_wrap sm']")

    if '<span class="rel_date' in etree.tostring(DT[0], pretty_print=True, encoding='utf-8'):
        DT = DT[0].xpath("//span[@class='rel_date']")
        DT = etree.tostring(DT[0], pretty_print=True, encoding='utf-8')
        DT = re.sub(r'<[^<>]*>|\n', '', DT)
        DT = translateDate(DT)
        makeWay(DT[0])
        body = body + '<b>' + DT[0] + ' ' + DT[1] + '</b><br>'

    return body

def translateDate(DT):

    if ('секунд' in DT)or('только что' in DT):
        date = datetime.datetime.now().strftime("%d.%m.%Y")
        time = datetime.datetime.now().strftime("%H:%M")
    elif ' минут' in DT:
        date = (datetime.datetime.now() - datetime.timedelta(minutes=int(re.sub(r'[^0-9]*','',DT)))).strftime("%d.%m.%Y")
        time = (datetime.datetime.now() - datetime.timedelta(minutes=int(re.sub(r'[^0-9]*','',DT)))).strftime("%H:%M")
    elif 'минуту ' in DT:
        date = (datetime.datetime.now() - datetime.timedelta(minutes=1)).strftime("%d.%m.%Y")
        time = (datetime.datetime.now() - datetime.timedelta(minutes=1)).strftime("%H:%M")
    elif 'час ' in DT:
        date = (datetime.datetime.now() - datetime.timedelta(hours=1)).strftime("%d.%m.%Y")
        time = (datetime.datetime.now() - datetime.timedelta(hours=1)).strftime("%H:%M")
    elif 'два часа' in DT:
        date = (datetime.datetime.now() - datetime.timedelta(hours=2)).strftime("%d.%m.%Y")
        time = (datetime.datetime.now() - datetime.timedelta(hours=2)).strftime("%H:%M")
    elif 'три часа' in DT:
        date = (datetime.datetime.now() - datetime.timedelta(hours=3)).strftime("%d.%m.%Y")
        time = (datetime.datetime.now() - datetime.timedelta(hours=3)).strftime("%H:%M")
    elif 'вчера ' in DT:
        date = (datetime.datetime.now() - datetime.timedelta(days=1)).strftime("%d.%m.%Y")
        time =  re.sub(r'.*в\s|\n', '', DT)
    elif 'сегодня' in DT:
        date = (datetime.date.today()).strftime("%d.%m.%Y")
        time =  re.sub(r'.*в\s|\n', '', DT)
    elif ' в ' in DT:
        date = re.sub(r'\sв.*','',DT)
        date = date + ' ' + str(datetime.date.today().year)
        date = changeDate(re.sub('\n','',date))
        time = re.sub(r'.*в\s|\n', '', DT)
    else:
        date = changeDate(DT)
        time = ''
    
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

def makeWay(date):

    fold = re.split('\.', date)     
    number = 1
    output = fold[2] + '/' + fold[1] + '/' + fold[0] + '/' + str(number) + '.html'

    while os.path.exists(output):
        number = number + 1
        output = fold[2] + '/' + fold[1] + '/' + fold[0] + '/' + str(number) + '.html'

    if not os.path.exists(re.sub('/[0-9]*.html', '', output)):
        os.makedirs(re.sub('/[0-9]*.html', '', output))

    global f2
    global fway
    fway = re.sub('.html','',output)
    f2 = open(output, 'w')

def createPost(body):

    print >>f2, '<html>\n<html lang="ru">\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<style>\nblockquote\n{\nborder-left: #999999 3px solid; \npadding-left: 5px;\n}\n\n div.text\n{\nmargin-left:100px;\n}\n\ndiv.text img\n{\nmax-height:700px; \nmax-width:700px;\n}\n\ndiv.audio\n{\nmargin-left:20px;\ncolor:#0066ff;\n}\n\ndiv.comments\n{\nmargin-top:80px;\nmargin-left:150px;\n}\n\ndiv.comments img\n{\nmax-height:300px; \nmax-width:700px;\n}\n</style>\n</head>\n<body>\n' + body + '</html></body>'
    f2.close()


##MAIN:
print "Be sure, that your date and time on computer is right, because you can have wrong result. Language of vk.com is RUS, and there is nothing else, just wall without open messages"

doc = normalize()
posts = findPosts()


for post in posts:
    takePost(post)
    

f.close()
##Time zone, comments
