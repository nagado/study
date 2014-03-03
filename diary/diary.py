# -*- coding:utf-8 -*-
##FUNCTIONS

def normalize():
    doc = ''
    for line in f:
        doc = doc + line
    doc = doc.decode('windows-1251').encode('utf-8')
    doc = re.sub(r'\n', '<stringEnd>', doc)
    doc = re.sub(r'^.*(?=<tr><td colspan="3"><h2 class="topic_title">)','',doc)
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

    time = re.sub(r'^\s+|\s+$|<tr.*г\.\s|</f.*</tr>', '', doc[1])
    return time

def findDate():
    
    date = re.sub(r'^\s+|\s+$|<tr>.*<font class="..">|\sг.*</tr>', '', doc[1])
    return date

def changeDate(date):
    months = {'января':'01', 'февраля':'02', 'марта':'03', 'апреля':'04', 'мая':'05', 'июня':'06', 'июля':'07', 'августа':'08', 'сентября':'09', 'октября':'10', 'ноября':'11', 'декабря':'12'}
    date = re.split(' ', date)

    date[1] = months[date[1]]
    date = date[0]+'.'+date[1]+'.'+date[2]
    return date

def findText():
    text = re.sub(r'^\s+|\s+$|<tr.*</a></td><td colspan="2" width="99%">|<br clear="all"><br><font class="m.">*</a></font></td></tr>|<br clear="all"><br><font class="m2">Категории:.*$', '', doc[2])
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
                avatar = ''
            text = re.sub(r'^\s+|\s+$|<tr valign="top"><td width="1%">.*</td><td colspan="2" width="99%">|</td></tr>', '', comms[n2])
            text = executeText(text)
            n1 = n1 + 6
            n2 = n2 + 6
            comm = [nic, date, time, avatar, text]
            output.append(comm)
        
        return output

def executeText(text):  

    if '<!-- video_end -->' in text:
        text = re.sub(r'embed/', 'watch?v=', text)
        text = re.sub(r'<!-- video\[.{,350}"><input name="video_url" type="hidden" value="', '--LINK--', text)
        text = re.sub(r'"><img class="flag" src="[\./_a-zA-Z0-9]+" alt="Скачать" height="[0-9]+" width="[0-9]+">.{,600}end -->', '--/LINK--', text)


    if '<!-- quote[&gt;] -->' in text:
        text = re.sub(r'<!-- end_quote --><!-- quote\[&gt;\] -->','<br>', text)
        text = re.sub(r'(<br>)+<!-- quote\[&gt;\] -->', ' --QUOTE-- ', text)     
        text = re.sub(r'<!-- end_quote -->', ' --/QUOTE-- ', text)
        
    if '<!-- img' in text:
        text = re.sub(r'<!-- img\[[a-z]+,[a-z]+,', '--IMG--', text)
        text = re.sub(r'\] -->.*<!-- img_end -->', '--/IMG--', text)

    text = re.sub(r'<br>', '\n', text)
    text = re.sub(r'<i>', '[I]', text)
    text = re.sub(r'</i>', '[/I]', text)
    text = re.sub(r'<[^<>]+>|(\n)+$|^(\n)+','',text)

    text = re.sub(r'\n', '<br>', text)
    text = re.sub(r'\[I\]', '<i>', text)
    text = re.sub(r'\[/I\]', '</i>', text)
    text = re.sub(r'--QUOTE--', '<blockquote style="border-left: #999999 3px solid; padding-left: 5px;"> ', text)
    text = re.sub(r'--/QUOTE--', '</blockquote>', text)
    text = re.sub(r'--IMG--', '<img src="', text)
    text = re.sub(r'--/IMG--', '">', text)
    text = re.sub(r'--LINK--', '<a href="', text)
    text = re.sub(r'--/LINK--', '">Видео</a>', text)
    text = re.sub(r'(<br>){2,}', '<br>', text)

    return text

'''def showAll():
    print title, date, time
    print text
    
    if '<a class="tag2"' in doc[208]:
        print '\nTAGS::'
        for tag in tags:
            print tag

    if comms != []:
        print "\nCOMMENTS:"
        for comm in comms:
            print '.....' + comm[0] + ' ' + comm[1] + ' ' + comm[2] + '\n', comm[3] '''

'''def output():    
    global date
    date = re.split('.', date)

    s = r'date2'
    s2 = r'date1'
    if not os.path.exists(s):
        os.makedirs(s)

    if not os.path.exists(s'/'s2):
        os.makedirs(s'/'s2)

    outway = date[2] + '/' + date[1] + '/' + date[0] + '.html'
    f2 = open(outway, 'w')
    moveInFile()
'''

def moveInFile():

    print >>f2, '<html> <html lang="ru"> <head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"> \n<body>'
    print >>f2, '<b>"', title, '"',  date, time, "</b><br>"
    print >>f2, text, "<br>"
    
    if '<a class="tag2"' in doc[2]:
        print >>f2, '<br>TAGS:'

        for tag in tags:
            print >>f2, tag

        print >>f2, "<br>"

    if (comms != [])and(comms != None):
        print >>f2, '<div style="margin-left:50px;">'

        for comm in comms:
            print >>f2, '<div>', comm[3], '<hr>.....<b>', comm[0], '</b> ', comm[1], ' ', comm[2], '<br>', comm[4], '</div>' 
        print >>f2, '</div>'

    print >>f2, "</html></body>"
         

##MAIN

import sys,re,os
f = open(sys.argv[1], 'r')
f2 = open(sys.argv[2], 'w')

doc = normalize()
comms = findComments()  ##Don't forget! It is a list inside other list
splitDoc()
title = findTitle()
time = findTime()
date = changeDate(findDate())
text= findText()
tags = findTags()

moveInFile()

f.close()
f2.close()



## Make and audio
