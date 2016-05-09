import json
import re

def write(model, feature_names, n_top_words,tf, numberOfTopics, messages, dates, postIds):

    
    
    rangeX=10
    rangeY=40
    
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
        
    
    
    idsPerTopics = []
    for i in range(0, len(documentsPerTopic)):
        postIds = []
        for j in range(0, len(documentsPerTopic[i])):
            postIds.append(documentsPerTopic[i][j]["postId"])
        idsPerTopics.append(postIds)
        
    sum = 0
    countSame = []
    for i in range(0, len(idsPerTopics)):
        countSame.append([])
        for j in range(0, len(idsPerTopics)):
            countSame[i].append(0)
    
    for i in range(0, len(idsPerTopics)-1):
        sum += len(idsPerTopics[i])
        for j in range(i+1, len(idsPerTopics)):
            for k in range(0, len(idsPerTopics[j])):               
                docId1 = idsPerTopics[j][k]
                if docId1 in idsPerTopics[i]:
                    countSame[i][j] = countSame[i][j]+1
              
    print(len(messages))      
    print(sum)
    print(countSame)
    
        
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
    c = 0
    returnArr = dict()
    
    links = []
    nodes = []
    for topic in topics:
        words = topic["words"]
        print("length: " + str(len(words)))
        for i in range(0, 4):
            node = dict()
            print(k*5+i)
            node["id"]=k*5+i
            node["group"]=k
            node["caption"]=str(words[i]["text"])
            nodes.append(node)
            link = dict()
            link["source"] = k*5+i
            link["target"] = k*5+i+1
            links.append(link)
        node["id"]=k*5+4
        node["group"]=k
        node["caption"]=str(words[4]["text"])
        nodes.append(node)            
        link = dict()
        link["source"] = k*5+4
        link["target"] = k*5
        links.append(link)

        k = k+1
    
    returnArr["topicsDescription"]=topics
    returnArr["links"]=links
    returnArr["nodes"]=nodes
       
   
    json_data = json.dumps(returnArr)

    
    return json_data

    
    