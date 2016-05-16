from django.conf import settings
import json 
from sklearn.feature_extraction import text 
import numpy as np
import operator
from datetime import datetime

def getSummary(socialMedias, file_directory, timeRange,valueDate, numberOfTopWords):
   
    numberOfTopWords = int(numberOfTopWords)
    print(numberOfTopWords)
    t = text.ENGLISH_STOP_WORDS
    
    print(socialMedias)
    values = []
    for media in socialMedias:
        file = settings.JSONFILES_FOLDER+"/" + media + "/" + file_directory
        json_data=open(file).read()
        data = json.loads(json_data)
    
        values.extend(data["values"])
    
    words = []
    messages = []
    
    if int(timeRange) == 0:
        sdate=valueDate
        for value in values:     
            date = value[2].split(" ")
            #print(date)
            if sdate in date[0]:
                messages.append(value[1])
    else:
        now = datetime.now()

        for value in values:
            dateStr = value[2].split(" ")[0]
            dateInt = datetime.strptime(dateStr, '%Y-%m-%d')
            delta = now - dateInt
            if delta.days <= int(valueDate):
                print(dateStr)
                messages.append(value[1])
 
    
    for m in messages:
        textM = m.split(" ")
        words.append([])
        for word in textM:
            word = word.lower()
            if not "http" in word:
                word = word.replace("\n", " ")
                word = word.replace("\u", " ")
                word = word.replace("'s", "")
        
                for ch in [', ','. ','!',':','?', '\\u', '\\n']:
                    if ch in word:
                        word=word.replace(ch,' ') 
                
                words[len(words)-1].extend(word.split(" "))
               
    #remove stop words
    wordsWithoutStopwords = []
    for i in range(0, len(words)):
        wordList = words[i]
        wordsWithoutStopwords.append([])
        for word in wordList:
            if not word in t:
                wordsWithoutStopwords[i].append(word)
                                     
    
    words = wordsWithoutStopwords
    
   

    ###2-word-gap####
    nodes = dict()
    
    edges = dict()
    edgeMessages =dict()
    distinctWords = []
    
    
    for i  in range(0,len(words)):
        list = words[i]
        lastWord = ''
        for word in list:
            if word =='':
                continue
            
            if not word in nodes:
                nodes[word] = 1
            else:
                nodes[word] = nodes[word]+1
        
            if lastWord=='':
                lastWord = word
                continue
            
            c = (lastWord, word)
            cT = (word, lastWord)
            if c in edges:
                edges[c] = edges[c]+1
                edges[cT] = edges[cT]+1
                edgeMessages[c].append(i)
                edgeMessages[cT].append(i)
            else:
                edges[c] = 1
                edges[cT]= 1
                edgeMessages[c]= [i]
                edgeMessages[cT] = [i]
            lastWord = word
    
    #print(edges)
    #print(edgeMessages)
            
    nodeArr = []
    edgeArr = []
    minSize = -1
    maxSize = 0
    minWeight = -1
    maxWeight = 0
    
    sorted_x = sorted(nodes.items(), key=operator.itemgetter(1), reverse=True)
    top50=[]
     
    for i in range(0, numberOfTopWords):
        word = sorted_x[i][0]
        node = dict()
        node["name"] = word
        node["size"] = nodes[word]
        nodeArr.append(node)
        top50.append(word)
       
        if nodes[word] > maxSize:
            maxSize = nodes[word]
            
        if nodes[word] < minSize or minSize == -1:
            minSize = nodes[word]
      
        
 
    for e in edges:   
        if e[0] in top50 and e[1] in top50:
                i = top50.index(e[0])
                j = top50.index(e[1])
                edge=dict()
                edge["source"]=i
                edge["target"]=j
                edge["weight"]=edges[(e[0],e[1])]
                
                if edges[(e[0],e[1])] > maxWeight:
                    maxWeight =edges[(e[0],e[1])]
                    
                if edges[(e[0],e[1])] < minSize or minWeight == -1:
                    minWeight = edges[(e[0],e[1])]
                edgeArr.append(edge)
    
    
                
    minSizeRange = 5
    maxSizeRange = 20
    minWeightRange = 3
    maxWeightRange = 15
    rangeWeight = maxWeightRange - minWeightRange

    
    for node in nodeArr:
        size = node["size"]
        if (minSize == maxSize):
            b = (maxsize-minSize)/2 + minSeize
        else:
            a = (size-minSize) /(maxSize-minSize+0.0)
            b = a*(maxSizeRange-minSizeRange)+minSizeRange
        node["size"]=b
        
    for edge in edgeArr:
        weight = edge["weight"]

        if (maxWeight == minWeight):
            b= (maxWeight-minWeight)/2 + minWeight
        else:
            b = minWeightRange + ((weight-minWeight)*(maxWeightRange-minWeightRange))/(maxWeight-minWeight)
       
        edge["weight"]=b
    
    
    arr = dict()
    arr["nodes"]=nodeArr
    arr["links"]=edgeArr
    
    for edge in edgeArr:
        messagesE = []
        i = edge["source"]
        j = edge["target"]
        v = edgeMessages[(top50[i],top50[j])]
        for m in v:
            messagesE.append(messages[m])
        edge["messages"]=messagesE
    

    
    return json.dumps(arr)



