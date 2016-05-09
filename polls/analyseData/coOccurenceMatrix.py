import json
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.feature_extraction import text 
import numpy as np


def calculateCoOccurenceMatrix( socialMedia, file_directory, filename, numberOfWords):

    messagesText = []
    postIds = []
    dates = []  
    
    for folder in socialMedia:
        file = file_directory + "/" + folder + "/" +  filename
        json_data=open(file).read()
        data = json.loads(json_data)
        values = data["values"]
        words = dict();
        
      
        
        for value in values:
            textM = value[1].split(" ")
            messagesText.append(value[1])
            dates.append(value[2])
            postIds.append(value[3])
            for word in textM:
                if word == '':
                    continue 
                if(word in words):
                    words[word] = words[word] +1
                else:
                    words[word] = 1
    
    
    
    #######sklearn
    for m in messagesText:
        for ch in [',','.','!',':','?']:
            if ch in m:
                m=m.replace(ch,'')
                
    
    
    stop_words = text.ENGLISH_STOP_WORDS.union(["http"])
    
    tf_vectorizer = CountVectorizer(max_df=0.95, min_df=2,stop_words=stop_words)
    
    tf = tf_vectorizer.fit_transform(messagesText)
    
    freqs = [(word, tf.getcol(idx).sum(), idx) for word, idx in tf_vectorizer.vocabulary_.items()]
    #sort from largest to smallest
    X =  sorted (freqs, key = lambda x: -x[1])
    
    Y = tf_vectorizer.inverse_transform(tf)
    
    
    
    #print(tf.todense()[0][1517])
    
    X = X[0:numberOfWords]
    print(X)
    words = dict()
    for i in range(0,len(X)):
        words[i] = X[i][0]
    
    matrix = np.zeros((len(X),len(X)))
     
    
    for i in range(0, len(X)-1):
        w = X[i][0]                 #president 
        print(i)
        for j in range(i+1,len(X)):
            w2 = X[j][0]
            for m in Y:
                if w in m and w2 in m:
                    matrix[i][j] = matrix[i][j]+1
    
    
    max = np.amax(matrix)
    min = np.amin(matrix)        
    nodes = []
    links = []  
    
    numberOfPost = len(Y)
    
    for i in range(0, len(X)):
        name = dict()
        name["name"] = words[i]
        nodes.append(name)
        for j in range(0,len(X)):
           # a =  (matrix[i][j] - min)/(max-min)
            #matrix[i][j] = int(a*(rangeY-rangeX)+rangeX)
            #matrix[i][j] = int(matrix[i][j]/numberOfPost*100)
            link = dict()
            link["source"]=i
            link["target"]=j
            link["value"]=int(matrix[i][j])

            links.append(link)
    
    
    data = dict()
    data["minValue"]=min
    data["maxValue"]=max
    js = dict()
    js["nodes"]=nodes
    js["links"]=links
    
    data["graph"]=js


    return json.dumps(data)

   
 



