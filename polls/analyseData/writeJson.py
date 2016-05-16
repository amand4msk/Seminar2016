import json
import re

def write(model, feature_names, n_top_words,tf, numberOfTopics, messages, dates, postIds):

    
    
    rangeX=3
    rangeY=10
    
    doc_topic = model.transform(tf)
    documentsPerTopic = dict()
    
    
    for i in range(0, numberOfTopics):
        documentsPerTopic[i] = []
    
        
        
    for i in range(0, len(doc_topic)):
        max = doc_topic[i].argmax()
        doc=dict()
        doc["value"]=messages[i]
        doc["date"]=dates[i]
        doc["postId"]=postIds[i]
        documentsPerTopic[max].append(doc)
            
        
   # for k in documentsPerTopic:
    #    print("Topic "+ str(k) + " :" + str(documentsPerTopic[k]))
    j = 0
    for topic_idx, topic in enumerate(model.components_):
       topics = topic.argsort()[:-n_top_words - 1:-1]
       max = topics[0]
       min = topics[len(topics)-1]
       
    topics=[]
    for topic_idx, topic in enumerate(model.components_):
       topicDic=dict()
       words=[] 
       word=dict()
       wordsSorted = topic.argsort()[:-n_top_words - 1:-1]
       max = topic[wordsSorted[0]]
       min = topic[wordsSorted[n_top_words-1]]
       for i in wordsSorted:
           word=dict()
           word["text"]=feature_names[i]
           a = (topic[i]-min) / (max-min+0.0)
           b = a*(rangeY-rangeX)+rangeX
           word["size"]= int(b)
           words.append(word)
        
       topicDic["id"]=j
      
       topicDic["numberofDocus"]=len(documentsPerTopic[j])
       docs = dict()
       docs["value"]=documentsPerTopic[j]      
       topicDic["posts"]=documentsPerTopic[j]
       topicDic["words"]=words
       
       topics.append(topicDic)
       j = j+1
    
    k = 0
    x=0
    c = 0
    returnArr = dict()
    data = []
    returnArr["name"] ="topics"
    returnArr["children"]=data
    
    min = -1
    max = 0
    
    for topic in topics:
        if min==-1:
            min = topic["numberofDocus"]
        else:
            v = topic["numberofDocus"]
            if v > max:
                max = v
            
            if v < min: 
                min = v 
        
    k =0 
    for topic in topics:
        d = dict()
        d["name"]="topic"
        d["group"]=k
        d["numberOfDocus"]=topic["numberofDocus"]
        d["words"]=topic["words"]
        d["posts"]=topic["posts"]
        children=[]
        v = topic["numberofDocus"]
        a = (v-min) / (max-min+0.0)
        b = a*(rangeY-rangeX)+rangeX
        for i in range(5):
            c = dict()
            c["name"]=topic["words"][i]["text"]
            c["size"]=int(b)
            c["group"]=k
            children.append(c)
        k=k+1
        d["children"]=children
        data.append(d)
        

    json_data = json.dumps(returnArr)

    
    return json_data

    
    