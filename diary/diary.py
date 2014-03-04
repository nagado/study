# -*- coding:utf-8 -*-
##FUNCTIONS

def normalize():
    global dateTime
    doc = ''
    for line in f:
        doc = doc + line
    doc = doc.decode('windows-1251').encode('utf-8')
    doc = re.sub(r'\n', '<stringEnd>', doc)
    dateTime = re.search('<!-- Крошки -->.{,1000}<!--Подвал-->', doc)
    dateTime = dateTime.group(0)
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
            tag = re.sub(r'<a.*">|</a.*>|^\s+|\s+$', '', tag)
            tags.append(tag)
        
        return tags

def findTitle():

    title = re.sub(r'^\s+|\s+$|<tr.*">|</h.*</tr>', "", doc[0])
    return title

def findTime():

    time = re.sub(r'<!-- Крошки -->.*\sг.\s|</span></strong>.*$', '',dateTime)
##    time = re.sub(r'^\s+|\s+$|<tr.*г\.\s|</f.*</tr>', '', doc[1])##Check in text. Canceled
    return time

def findDate():
    
    date = re.sub(r'<!-- Крошки -->.*<span class="m2">|\s\.г\s.*$', '', dateTime)
##    date = re.sub(r'^\s+|\s+$|<tr>.*<font class="..">|\sг.*</tr>', '', doc[1]) ##Check in text. Canceled
    return date

def changeDate(date):
    months = {'января':'01', 'февраля':'02', 'марта':'03', 'апреля':'04', 'мая':'05', 'июня':'06', 'июля':'07', 'августа':'08', 'сентября':'09', 'октября':'10', 'ноября':'11', 'декабря':'12'}
    date = re.split(' ', date)

    date[1] = months[date[1]]
    date = date[0]+'.'+date[1]+'.'+date[2]
    return date

def findAvatar():

    if '<img class="avatar"' in doc[2]:
        avatar = re.sub(r'^.*<img class="avatar" alt="" src="', '<img src="', doc[2])
        avatar = re.sub(r'" onmouseover="sme.*$', '" align="left"></img>', avatar)
    else:
        avatar = '<img src="http://fotoava.ru/images/57419.jpg" height=150px; align="left"></img>'

    return avatar

def findText():

    text = re.sub(r'^\s+|\s+$|<tr.*</a></td><td colspan="2" width="99%">|<br clear="all"><br><font class="m.">*</a></font></td></tr>|<font class="m2">Категории:.*$', '', doc[2])
    text = executeText(text)

    return text

def findComments():    
    trash = ''
    output = []

    for line in doc:
        trash = trash+line

    if '<tr><td colspan="3"><a name=' in trash:
        comms = re.search('<tbody><tr><td colspan="3"></td></tr>.*</a></td></tr><stringEnd></tbody></table>',trash)
        comms = re.split('<stringEnd>', comms.group()) 
        n1 = 1
        n2 = 2

        for i in range(len(comms)/6+1):
            date = changeDate(re.sub(r'^\s+|\s+$|<tr><td colspan=".*<font class="m7">|\sг\.\s.*</font></td></tr>','',comms[n1]))
            time = re.sub(r'^\s+|\s+$|<tr><td colspan=".*\sг\.\s|</font>\s<font class.*</font></td></tr>', '', comms[n1])
            nic = re.sub(r'^\s|\s$|<tr>.*e\(this\);">|</a>.*$', '',comms[n1])

            if '<img class="avatar"' in comms[n2]:
                avatar = re.sub(r'^.*<img class="avatar" alt="" src="', '<img src="', comms[n2])
                avatar = re.sub(r'" onmouseover="sme.*$', '" height=50px; align="left"></img>', avatar)
            else:
                avatar = '<img src="http://fotoava.ru/images/57419.jpg" height=50px; align="left"></img>'

            text = re.sub(r'^\s+|\s+$|<tr valign="top"><td width="1%">.*</td><td colspan="2" width="99%">|</td></tr>', '', comms[n2])
            text = executeText(text)
            n1 = n1 + 6
            n2 = n2 + 6

            comm = [nic, date, time, avatar, text]
            output.append(comm)
        
        return output

def executeText(text):  

    if '<!-- video_end -->' in text:
        text = re.sub(r'<!-- video\[.{,350}"><input name="video_url" type="hidden" value="', '--VIDEO--', text)
        text = re.sub(r'"><img class="flag" src="[\./_a-zA-Z0-9]+" alt="Скачать" height="[0-9]+" width="[0-9]+">.{,600}end -->', '--/VIDEO--', text)


    if '<!-- quote[&gt;] -->' in text:
        text = re.sub(r'<!-- end_quote --><!-- quote\[&gt;\] -->','<br>', text)
        text = re.sub(r'(<br>)*<!-- quote\[&gt;\] -->', ' --QUOTE-- ', text)     
        text = re.sub(r'<!-- end_quote -->', ' --/QUOTE-- ', text)

    if '<!-- url[' in text:
        text = re.sub(r'(?<=\.[a-z]{4}),', '', text)
        text = re.sub(r'(?<=\.[a-z]{3}),', '', text)
        text = re.sub(r'(?<=\.[a-z]{2}),', '', text)

        text = re.sub(r'<!-- url\[', '--LINK--', text)
        text = re.sub(r'] -->[^\[\]]+<!-- url_end -->', '--/LINK--', text)
        
    if '<!-- img' in text:
        text = re.sub(r'<!-- img\[[a-z]+,[a-z]+,', '--IMG--', text)
        text = re.sub(r'\] -->.*<!-- img_end -->', '--/IMG--', text)

    text = re.sub(r'<span class="u">', '<u>', text)
    text = re.sub(r'<span class="s">', '<s>', text)
    text = re.sub(r'</span><!--u-->', '</u>', text)
    text = re.sub(r'</span><!--s-->', '</s>', text)
    text = re.sub(r'<font class="m2"><img class="smiles".*"Музыка">&nbsp;', 'Музыка: ', text)
    text = re.sub(r'<(?!/?[ius]>)(?!br>)[^<>]+>|(\n)+$|^(\n)+','',text)


    text = re.sub(r'--QUOTE--', '<blockquote style="border-left: #999999 3px solid; padding-left: 5px;"> ', text)
    text = re.sub(r'--/QUOTE--', '</blockquote>', text)
    text = re.sub(r'--IMG--', '<img src="', text)
    text = re.sub(r'--/IMG--', '">', text)
    text = re.sub(r'--LINK--', '<a href="', text)
    text = re.sub(r'--/LINK--', '">Ссылка</a>', text)
    text = re.sub(r'--VIDEO--', '<iframe width="420" height="345" src="', text)
    text = re.sub(r'--/VIDEO--', '"></iframe>', text)
    text = re.sub(r'(<br>){3,}', '<br><br>', text)

    return text


def splitDateOnFolders():

    global date
    fold = re.split('\.', date)
  
    if len(fold[0]) == 1:
        fold[0] = '0' + fold[0]
     
    return fold


def createFoulders():

    way = fold[2] + '/' + fold[1]
    output = fold[2] + '/' + fold[1] + '/' + fold[0] + '.html'
    files = fold[2] + '/' + fold[1] + '/' + fold[0]

    if not os.path.exists(way):
        os.makedirs(way)
    
    if not os.path.exists(files):
        os.makedirs(files)

    return output

def chooseFileWay(link):

    n = re.search(r'[^/]+$', link) ##Найти имя
    name = re.split('\.', n.group(0)) ##разделить по точке
    name[0] = 0 
    fileway = fold[2] + '/' + fold[1] + '/' + fold[0] + '/' + str(name[0]) + '.' + str(name[1])

    while os.path.exists(fileway):
        name[0] = name[0] + 1
        fileway = fold[2] + '/' + fold[1] + '/' + fold[0] + '/' + str(name[0]) + '.' + str(name[1])

    return fileway

def replaceLinks(link,fileway):
  
    global avatar, text, comms
    fileway = re.sub(r'[0-9]{4}/[0-9]{2}/', '', fileway)
    link = re.sub(r'\(','\(',link)
    link = re.sub(r'\)','\)',link)
    avatar = re.sub(link, fileway, avatar)
    text = re.sub(link, fileway, text)

    for comm in comms:
        comm[3] = re.sub(link, fileway, comm[3])


def moveFiles():

    global avatar, text, comms
    tmp = avatar + text

    for comm in comms:
        tmp = tmp + comm[3]
    
    urls = re.findall('(?<=<img src=")http://[^"]+',tmp) 
    print urls[0] 
    urls2 = [] 
   
    for url in urls:
        if not url in urls2:
            urls2.append(url)

    for url in urls2:
        fileway = chooseFileWay(url)
        urllib.urlretrieve(url, fileway)
        replaceLinks(url, fileway)

     

    tmp = re.sub('<img src="http://[^>]+', '', tmp) ##Cut http-s
    links = re.findall('(?<=<img src=")[^"]+', tmp)
    links2 = []
    links3 = []

    for link in links:
        if not link in links2:
            links2.append(link)           

    for link in links2:

        fileway = chooseFileWay(link)
        shutil.copy(link, fileway)
        replaceLinks(link, fileway)

        

## Link where way to load files from: http://www.cyberforum.ru/python/thread636359.html
## Better go and learn selenium. It is stupid - to download all this stuff, when parts won't work, and it will be trash. Learn to open file from url, and then create html and download all you need from url, and then change file address to address of current folder, and file name with any free number. STUDY!!!!

def makeFile():

    print >>f2, '<html> <html lang="ru"> <head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><style> \n img {max-height:600px; max-width:600px;}</style></head><body>'
    print >>f2, '<b>"', title, '"',  date, time, "</b><br>"
    print >>f2, avatar
    print >>f2, '<div style="margin-left:100px;">', text, "<br>"
    
    if '<a class="tag2"' in doc[2]:
        print >>f2, '<br>TAGS:'

        for tag in tags:
            print >>f2, tag

        print >>f2, "<br>"

    if (comms != [])and(comms != None):
        print >>f2, '<div style="margin-left:50px;">'

        for comm in comms:
            print >>f2, '<div>', comm[3],  '<div style="margin-left:45px;"><hr>.....<b>', comm[0], '</b> ', comm[1], ' ', comm[2], '<br>', comm[4], '</div></div>' 
        print >>f2, '</div>'

    print >>f2, "</div></html></body>"
         

##MAIN

import sys,re,os,shutil,urllib
f = open(sys.argv[1], 'r')
##f2 = open(sys.argv[2], 'w')


dateTime = ''
doc = normalize()
comms = findComments()  ##Don't forget! It is a list inside other list
splitDoc()
title = findTitle()
time = findTime()
date = changeDate(findDate())
avatar = findAvatar()
text= findText()
tags = findTags()

fold = splitDateOnFolders()
f2 = open(createFoulders(), 'w')
moveFiles()
makeFile()

f.close()
f2.close()

## Make download pictures and audio and place for it, and html 
