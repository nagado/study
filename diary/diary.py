# -*- coding:utf-8 -*-
import sys,re
f = open(sys.argv[1], 'r')
##f2 = open(sys.argv[2], 'w')

##FUNCTIONS

def Normalize():
    doc = ''
    for line in f:
        doc = doc + line
    doc = doc.decode('windows-1251').encode('utf-8')
    return doc

def splitDoc():
    global doc
    doc = re.split('\n', doc)

def findTags():

    if '<a class="tag2"' in doc[208]:
        rawtags = re.search('<a class="tag2".*</a>', doc[208])
        rawtags = re.split(',', rawtags.group())
        tags = []

        for tag in rawtags:
            tag = re.sub(r'<a.*">|</a.*>|^\s+|\s+$', '', tag)
            tags.append(tag)
        
        return tags

def findTitle():
    title = re.sub(r'^\s+|\s+$|<tr.*">|</h.*</tr>', "", doc[206])
    return title

def findTime():
    time = re.sub(r'^\s+|\s+$|<tr.*г\.\s|</f.*</tr>', '', doc[207])
    return time

def findDate():
    date = re.sub(r'^\s+|\s+$|<tr>.*">|\sг.*</tr>', '', doc[207])
    return date

def changeDate(date):
    months = {'января':'01', 'февраля':'02', 'марта':'03', 'апреля':'04', 'мая':'05', 'июня':'06', 'июля':'07', 'августа':'08', 'сентября':'09', 'октября':'10', 'ноября':'11', 'декабря':'12'}
    date = re.split(' ', date)
    date[1] = months[date[1]]
    date = date[0]+'.'+date[1]+'.'+date[2]
    return date

def findText():
    text = re.sub(r'^\s+|\s+$|<tr.*--><br><br>|</div>.*</a></font></td></tr>|.*<td colspan="." width="99%"><div class=".">', '', doc[208])
    text = re.sub(r'<br>', '\n', text)
    text = re.sub(r'<[/a-zA-Z0-9\\!-_=+:;@#\$%\^&\*\(\)\.,\|\s]+>','',text)
    return text

def findComments():    
    trash = ''
    for line in doc:
        trash = trash+line
    trash = re.sub('\n', 'DIVIDER', trash)
    if '<tr><td colspan="3"><a name=' in trash:
        comms = re.search('<tbody><tr><td colspan="3"></td></tr>.*</a></td></tr>DIVIDER</tbody></table>',trash)
        comms = re.split('DIVIDER', comms.group()) 
   
        n1 = 1
        n2 = 2
        for i in range(len(comms)/6+1):
            date = changeDate(re.sub(r'^\s+|\s+$|<tr><td colspan=".*<font class="m7">|\sг\.\s.*</font></td></tr>','',comms[n1]))
            time = re.sub(r'^\s+|\s+$|<tr><td colspan=".*\sг\.\s|</font>\s<font class.*</font></td></tr>', '', comms[n1])
            nic = re.sub(r'^\s|\s$|<tr>.*e\(this\);">|</a>.*$', '',comms[n1])
            text = re.sub(r'^\s+|\s+$|<tr valign="top"><td width="1%">.*</td><td colspan="2" width="99%">|</td></tr>', '', comms[n2])
            text = re.sub(r'<br>', '\n', text)
            text = re.sub(r'<[/a-zA-Z0-9\\!-_=+:;@#\$%\^&\*\(\)\.,\|\s"]+>','',text)
            n1 = n1 + 6
            n2 = n2 + 6
            comm = [nic, date, time, text]
            output.append(comm)
        
        return output

def showAll():
    print "TITLE, DATE, TIME", title, date, time
    print 'TEXT:', text
    
    if '<a class="tag2"' in doc[208]:
        print 'TAGS::'
        for tag in tags:
            print tag

    if output != []:
        for comm in comms:
            print '.....' + comm[0] + ' ' + comm[1] + ' ' + comm[2] + '\n', comm[3] 
            

##MAIN

output = []
doc = Normalize()
comms = findComments()  ##Don't forget! It is a list inside other list
splitDoc()
title = findTitle()
time = findTime()
date = changeDate(findDate())
text= findText()
tags = findTags()

showAll()

f.close()
##f2.close()


##206 -title, 207 - time, 208-text and tags 
##1-comm's time and name 2-comm each 6 lines repeates
##09, 14, 29 someting with time
