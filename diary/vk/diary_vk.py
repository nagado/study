# -*- coding:utf-8 -*-

import re, sys, lxml.html, datetime, os, shutil, urllib
from lxml import etree

f = open(sys.argv[1], 'r')
f2 = ''
fway = ''
##f2 = open(sys.argv[2], 'w')



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
            createPost(body)

def findText(text,body):

    if '<div class="wall_post_text">' in text:
        text = re.sub('<br/>', '\n', text)

        if '<a href="http://vk.com/' in text:
            tags = re.findall(r'<a href="http://vk.com/[^<>]*>[^<>]*</a>', text) ##Tags saved
            text = re.sub(r'<a href="http://vk.com/[^<>]*>[^<>]*</a>', ' ', text)
          
            
        text = re.compile('^.*<div class="wall_post_text">|</div>.*|<a class="wall_post_more".{,130}</a>|<[^<>]*>', re.DOTALL).sub('', text)


        text = re.sub('\n', '<br>', text)
        text = re.sub(r'(<br>){3,}', '<br><br>', text)

        for i in range(1,20):
            text = re.sub(r'^(<br>|\s)|(<br>|\s)$', '', text)

        body = body + text + '<br>\n'

    return body



def findQuote(el, body):        

    if '<a class="published_by_photo"' in el:
        repost = re.findall(r'<a class="published_by_photo".*', el, re.DOTALL)
        title = re.findall(r'<a class="published_by".*', repost[0])
        title = re.sub(r'<[^<>]*>|^\s|\s$', '', title[0])
        dateTime = re.findall(r'<div class="published_by_date sm">.*', repost[0])
        dateTime = re.sub(r'<[^<>]*>|^\s|\s$', '', dateTime[0])
        top = title

        if not('видеозапись' in dateTime or 'фотография' in dateTime):
            date = changeDate(re.sub(r'\sв.*|^\s|\s$', '', dateTime))
            time = re.sub(r'^.*\sв\s|^\s|\s$', '', dateTime)
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
        audios = re.findall('<div class="title_wrap fl_l".*', el)
        body = body + '<div class="audio">'
        for audio in audios:
            audio = re.sub(r'<[^<>]*>', '', audio)
            body = body + audio + '<br>\n'

        body = body + '</div><br>\n'

    return body
    
def findVideo(el, body):
    if '<b class="fl_l video"/>' in el:
        body = body + '<div class="video">Video:<br>\n'
        videos = re.findall('<div class="page_post_queue_narrow"><div class="page_post_sized.*\n.*\n.*', el)
        
        for video in videos:
            video = re.split(r'\n', video)
            link = (re.findall(r'http://vk.com/video.[0-9]*_[0-9]*', video[0]))[0]
            link = (re.findall(r'(?<=<img src=")[^"]+', video[0]))[0]
            image = moveFile(link)
            title = re.sub(r'^.*<span class="a post_video_title">|</span>.*', '', video[2])
            assembly = '<a href="' + link + '"> "' + title + '" <br>\n<img src="' + image + '"></img></a><br>\n'
            body = body + assembly

        body = body + '</div>'

    return body

def downloadFile(url):

    fileway = chooseFileWay(url)
    print "Downloading picture for day:", re.sub(r'_[0-9]*|/[0-9]\..*', '', fileway)
    urllib.urlretrieve(url, fileway)
    print "Done"
    fileway = re.sub(r'[0-9]*/[0-9]*/', '', fileway)
    return fileway

def moveFile(link):

    fileway = chooseFileWay(link)
    shutil.copy(link, fileway)
    fileway = re.sub(r'[0-9]*/[0-9]*/', '', fileway)
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
    DT = DT[0].xpath("//span[@class='rel_date']")
    DT = etree.tostring(DT[0], pretty_print=True, encoding='utf-8')
    DT = re.sub(r'<[^<>]*>', '', DT)

    if ' в ' in DT:
        date = re.sub(r'\sв.*','',DT)
        date = date + ' ' + str(datetime.date.today().year)
        date = changeDate(re.sub('\n','',date))
        makeWay(date)
        time = re.sub(r'.*в\s|\n', '', DT)
        body = body + '<b>' + date + ' ' + time + '</b><br>'
    else:
        date = changeDate(DT)
        makeWay(date)
        body = body + '<b>' + date + '</b><br>'
      
    return body

def changeDate(date):

    months = {'янв':'01', 'фев':'02', 'мар':'03', 'апр':'04', 'мая':'05', 'июн':'06', 'июл':'07', 'авг':'08', 'сен':'09', 'окт':'10', 'ноя':'11', 'дек':'12'}
    date = re.split(r'\s', date)
    date[1] = months[date[1]]
    if len(date[0]) == 1:
        date[0] = '0' + date[0]

    date = date[0]+'.'+date[1]+'.'+date[2]
    return date

def makeWay(date):

    
    fold = re.split('\.', date)     
    output = fold[2] + '/' + fold[1] + '/' + fold[0] + '.html'
    way = fold[2] + '/' + fold[1]
           
    if not os.path.exists(way):
        os.makedirs(way)
    
    number = 1

    while os.path.exists(output):
        number = number + 1
        output = fold[2] + '/' + fold[1] + '/' + fold[0] + '_' + str(number) + '.html'

    global f2
    global fway
    fway = re.sub('.html','',output)
    f2 = open(output, 'w')

def createPost(body):

    print >>f2, '<html>\n<html lang="ru">\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<style>\nblockquote\n{\nborder-left: #999999 3px solid; \npadding-left: 5px;\n}\n\n div.text\n{\nmargin-left:100px;\n}\n\ndiv.text img\n{\nmax-height:700px; \nmax-width:700px;\n}\n\ndiv.audio\n{\nmargin-left:20px;\ncolor:#0066ff;\n}\n\ndiv.comments\n{\nmargin-top:80px;\nmargin-left:150px;\n}\n\ndiv.comments img\n{\nmax-height:300px; \nmax-width:700px;\n}\n</style>\n</head>\n<body>\n' + '<div class="text">' + body + '</html></body>'
    f2.close()


##MAIN:
doc = normalize()
posts = findPosts()


for post in posts:
    takePost(post)
    

f.close()
##f2.close()

