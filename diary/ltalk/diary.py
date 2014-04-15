# -*- coding:utf-8 -*-

import sys,re,os,shutil,urllib,datetime,sqlite3,filecmp
f = open(sys.argv[1], 'r')


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
            tag = re.sub(r'<a.*">|</a.*>|^\s+|\s+$', '', tag)
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
        avatar = '<img src="../../../.extras/Media/ava.jpg" height=100px; align="left"></img>'

    return avatar

def findText():
    text = re.sub(r'^\s+|\s+$|<tr.*</a></td><td colspan="2" width="99%">|<br clear="all"><br><font class=".*</a></font></td></tr>|<font class="m2">Категории:.*$', '', doc[2])
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
                avatar = '<img src="../../../.extras/Media/ava.jpg" height=50px; align="left"></img>'

            text = re.sub(r'^\s+|\s+$|<tr valign="top"><td width="1%">.*</td><td colspan="2" width="99%">|</td></tr>', '', comms[n2])
            text = executeText(text)
            n1 = n1 + 6
            n2 = n2 + 6

            comm = [nic, date, time, avatar, text, msc[0], msc[1]]
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


    text = re.sub(r'--QUOTE--', '<blockquote> ', text)
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
    return fold


def createFoulders():

    number = 1
    output = 'Diary/' + fold[2] + '/' + fold[1] + '/' + fold[0] + '/' + re.sub(':', '_', time) + '_' + str(number) + '.html'

    while os.path.exists(output):
        number = number + 1
        output = 'Diary/' + fold[2] + '/' + fold[1] + '/' + fold[0] + '/' + re.sub(':', '_', time) + '_' + str(number) + '.html'
           
    if not os.path.exists(re.sub(r'[^/]*.html','',output)):
        os.makedirs(re.sub(r'[^/]*.html','',output))

    return output

def chooseFileWay(link):

    n = re.search(r'[^/]+$', link) 
    name = re.split('\.', n.group(0))
    name[0] = 0 
    folderway = "Diary/.extras/Media"
    fileway = folderway + '/' + str(name[0]) + '.' + str(name[1])

    while os.path.exists(fileway):
        name[0] = name[0] + 1
        fileway = folderway + '/' + str(name[0]) + '.' + str(name[1])

    return fileway

def replaceLinks(link,fileway):
  
    global avatar, text, comms
    fileway = "../../.." + re.sub("Diary", '', fileway)
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
    
    urls = re.findall('(?<=<img src=")http://[^"]+',tmp) 
    urls2 = [] 
   
    for url in urls:
        if (not url in urls2) and (not '..' in url):
            urls2.append(url)

    for url in urls2:
        fileway = chooseFileWay(url)
        urllib.urlretrieve(url, fileway)
        replaceLinks(url, fileway)

     

    tmp = re.sub('<img src="http://[^>]+', '', tmp)
    links = re.findall('(?<=<img src=")[^"]+', tmp)
    links2 = []
    links3 = []

    for link in links:
        if (not link in links2) and (not '..' in link):
            links2.append(link)           

    for link in links2:
        doubling = checkForDoubles(link)
        if doubling == "N":
            fileway = chooseFileWay(link)
            shutil.copy(link, fileway)
            replaceLinks(link, fileway)
        else:
            replaceLinks(link, doubling)

def makeFile():

    print >>f2, '<html>\n<html lang="ru">\n<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<style>\nblockquote\n{\nborder-left: #999999 3px solid; \npadding-left: 5px;\n}\n\ndiv.time\n{\ndisplay: inline;\n}\n\ndiv.text\n{\nmargin-left:100px;\n}\n\ndiv.text img\n{\nmax-height:700px; \nmax-width:700px;\n}\n\ndiv.comments\n{\nmargin-top:80px;\nmargin-left:150px;\n}\n\ndiv.comments img\n{\nmax-height:300px; \nmax-width:700px;\n}\n</style>\n</head>\n<body>'
    print >>f2, '<b>"',title,'"',date,'<div class="time">',time,"</div> (",msc[0]," ",msc[1],"  по Москве) </b><br>"
    print >>f2, avatar
    print >>f2, '<div class="text">', text, "<br>"
    
    if '<a class="tag2"' in doc[2]:
        print >>f2, '<br>TAGS:'

        for tag in tags:
            print >>f2, tag

        print >>f2, "<br></div>"

    if (comms != [])and(comms != None):
        print >>f2, '<div class="comments">'

        for comm in comms:
            print >>f2,  comm[3],  '<div style="margin-left:50px;"><hr>.....<b>', comm[0], '</b> ', comm[1], ' ', comm[2], ' (', comm[5], ' ' , comm[6], ' по Москве) <br>', comm[4], '</div>' 
        print >>f2, '</div>'

    print >>f2, "</html></body>"

def removeExstras():

    folderway = re.sub('(?<=Diary/[0-9]{4}/[0-9]{2}/[0-9]{2}).*', '', postway)
    dirs = os.listdir(re.sub(r'/[0-9_]*\.html','',postway))
    dirs2 = []
    for direct in dirs:
        if '.html' in direct:
            if direct != re.sub(r'^.*/', '', postway):
                dirs2.append(direct)

    for direct in dirs2:
        if os.path.exists(postway):
            if re.sub(r'<[^<>]*>', '', open(postway,'r').read()) == re.sub(r'<[^<>]*>', '', open(folderway + '/' + direct,'r').read()):
                os.remove(postway)
                shutil.rmtree(re.sub(r'\.html','',postway), ignore_errors=False, onerror=None)

def checkForDoubles(link):
    images = os.listdir("Diary/.extras/Media")
    doubling = "N"
    for image in images:
        if filecmp.cmp(link, "Diary/.extras/Media/" + image):
            doubling = "Diary/.extrs/Media/" + image
    return doubling

def loadExtras():
    if not os.path.exists("Diary/.extras/Media"):
        os.makedirs("Diary/.extras/Media")
    if not os.path.exists("Diary/.extras/Media/ava.jpg"):
        urllib.urlretrieve("http://cs5298.userapi.com/g32561651/a_ea42f7ac.jpg", "Diary/.extras/Media/ava.jpg")
'''    if not os.path.exists("Diary/.exstras/tags.db")
        db = sqlite3.connect('Diary/.exstras/tags.db')
        cur = db.cursor() ##!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
        
        
def addTag(tag): ##!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
'''
##MAIN


dateTime = ''
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
f2 = open(postway, 'w')
moveFiles()
makeFile()

f.close()
f2.close()
removeExstras()
##Сделать, чтобы работало с файлами из других директорий. Записи без точного времени(для вк) указать время как un. Сделать файлы в одном месте и для ВК 
