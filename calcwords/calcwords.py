f = open ("text.txt", "r")
f2 = open ("dic.txt", "w")

d = {}


def clcl(f,d):
## For every line, word: calculate how much words on a text
  for line in f:
    lst = rplc(line)

    for word in lst:
      if word == '':
        continue 
      else:
        w = d.get(word)
        if d.has_key(word):
          w = w + 1
        else:
          w = 1
## Print keys and values one by one in dict
        d2 = {word:w}
        d.update(d2)

##Replace all unusable things.
def rplc(line):
    line = line.replace('\n' , "")
    s = ".,;:'}{[]|\/?!@#$%^&*()_+=-<>1234567890~`"
    for l in s:
        line = line.replace(l, ' ')
    line = line.replace('"', ' ')
    lst = line.split(' ')
    
    return lst

def sort_words(words):
    l = []

    for word_and_count in words.items():
        l.append(word_and_count)

    l.sort(key=sortByValue)
    l.reverse()
    return l


def sortByValue(inputStr):
    return inputStr[1]


def prnt (ll,f2):    
    for lst in ll:
        print >>f2, "{}:{}".format(lst[0], lst[1])

 
## Use functions

clcl(f,d)
ll = sort_words(d)
prnt(ll,f2)
  
## Clearing after work
f.close()
f2.close()
