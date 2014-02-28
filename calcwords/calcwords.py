##FUNCTIONS

def clcl():

  for line in f:
    lst = rplc(line)

    for word in lst:
      if word == '':
        continue 
      else:
        word = word.lower()
        w = d.get(word)
        if d.has_key(word):
          w = w + 1
        else:
          w = 1

        d2 = {word:w}
        d.update(d2)


def rplc(line):

    line = line.replace('\n' , "")
    s = ".,;:'}{[]|\/?!@#$%^&*()_+=-<>1234567890~`"
    for l in s:
        line = line.replace(l, ' ')
    line = line.replace('"', ' ')
    lst = line.split(' ')
    
    return lst

def sort_words():
    l = []

    for word_and_count in d.items():
        l.append(word_and_count)

    l.sort(key=sortByValue)
    l.reverse()
    return l


def sortByValue(inputStr):
    return inputStr[1]


def prnt():    
    for lst in sort_words():
        print >>f2, "{}:{}".format(lst[0], lst[1])

 
## MAIN
import sys
f = open (sys.argv[1], "r")
f2 = open (sys.argv[2], "w")

d = {}
clcl()
prnt()
  

f.close()
f2.close()
