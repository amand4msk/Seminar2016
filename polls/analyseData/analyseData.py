from django.conf import settings
import json
import os
import json
import operator
import copy
from sklearn.decomposition import NMF, LatentDirichletAllocation
from time import time
import datetime 
import re 

from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from scipy.sparse import csr_matrix
from message import Message
from cluster import Cluster

from coOccurenceMatrix import calculateCoOccurenceMatrix 
import writeJson

import logging
log = logging.getLogger(__name__)

n_samples = 2000
n_features = 1000
n_top_words = 20

def print_top_words(model, feature_names, n_top_words):
    for topic_idx, topic in enumerate(model.components_):
        print("Topic #%d:" % topic_idx)
        print(" ".join([feature_names[i]
                        for i in topic.argsort()[:-n_top_words - 1:-1]]))
    print()


def test(filename, n_topics):
    
    socialMedia = ['facebook', 'twitter']
    
    messagesText = []
    postIds = []
    dates = []
        
    for folder in socialMedia:
        file_directory=settings.JSONFILES_FOLDER+"/" + folder + "/" + filename
        print(filename)
        json_data=open(file_directory).read()
        data = json.loads(json_data)
        values = data["values"]
        words = dict();

        for value in values:
            text = value[1].split(" ")
            messagesText.append(value[1])
            dates.append(value[2])
            postIds.append(value[3])
            for word in text:
                if word == '':
                    continue 
                if(word in words):
                    words[word] = words[word] +1
                else:
                    words[word] = 1



    #######sklearn
    for i in range(0,len(messagesText)):
        messagesText[i] = re.sub(r"http\S+", "", messagesText[i])
        '''
        for ch in [',','.','!',':','?']:
            if ch in messagesText[i]:
                messagesText[i]=messagesText[i].replace(ch,' ')'''
        
        
    print("Extracting tf features for LDA...")
    tf_vectorizer = CountVectorizer(max_df=0.90, min_df=2, max_features=n_features,
                                    stop_words='english')
    tf = tf_vectorizer.fit_transform(messagesText)
    
    lda = LatentDirichletAllocation(n_topics=n_topics, max_iter=5,learning_method='online', learning_offset=50.,
                                random_state=0)
    model = lda.fit(tf)
    
    tf_feature_names = tf_vectorizer.get_feature_names()   
    
                
    '''tfidf_vectorizer = TfidfVectorizer(max_df=0.95, min_df=2, #max_features=n_features,
                                   stop_words='english')
    tfidf = tfidf_vectorizer.fit_transform(messagesText)

    nmf = NMF(n_components=n_topics, random_state=1, alpha=.1, l1_ratio=.5).fit(tfidf)
    
    print("\nTopics in NMF model:")
    tfidf_feature_names = tfidf_vectorizer.get_feature_names()
    print_top_words(nmf, tfidf_feature_names, n_top_words)'''
        
    return writeJson.write(lda, tf_feature_names, 20,tf,n_topics, messagesText, dates, postIds)


def getcoOccurenceMatrix(filename,numberOfWords):
    socialMedia = ['facebook', 'twitter']
    file_directory=settings.JSONFILES_FOLDER
    data = calculateCoOccurenceMatrix(socialMedia, file_directory, filename, numberOfWords)
    return data

def getPersons():
    file_directory=settings.JSONFILES_FOLDER+'persons.json'
    json_data=open(file_directory).read()
    data = json.loads(json_data)

    return json_data    
    
    
def getPosts(file):
    socialMedia = ['facebook', 'twitter']
    allPosts = dict()
    
    for folder in socialMedia:
    
        file_directory=settings.JSONFILES_FOLDER + "/" + folder +"/" +file
        json_data=open(file_directory).read()
        data = json.loads(json_data)
        values = data["values"]
        words = dict();
        
        messagesText = []
        postIds = []
        dates = []
        posts = []
        
        for value in values:
            text = value[1]
            date = value[2]
            id = value[3]
            
            X = dict()
            X["date"]=date
            X["id"]=id
            X["text"]=text
            
            posts.append(X)
        allPosts[folder]=posts
        

    return json.dumps(allPosts);

def getPostsByDate(file):
    socialMedia=["FB", "Twitter"]
    arr = []
    minYear = 2011
    for sm in socialMedia:
        X = getPostByDate2(file, sm, minYear)
        arr.append(X)
     
    merge = []   
    for i in range(0, len(arr[0])):
        for j in range(0, len(socialMedia)):
            merge.append(arr[j][i])
            
    return json.dumps(merge)
    
    
def getPostByDate2(file, sm, minYear):
    file =settings.JSONFILES_FOLDER + "/" + sm + "/" +  file; 
    json_data=open(file).read()
    
    now = datetime.datetime.now()
    yearNow = now.year
    rangeYear = yearNow-minYear+1
    
    data = json.loads(json_data)

    values = data["values"]
    words = dict();
            
    messagesText = []
    postIds = []
    dates = []
    posts = []
            
    messages = dict() 
    years = dict() 
    
    for i in range(0, rangeYear):
        years[yearNow-i]= dict()  
        messages[yearNow-i] = dict()      
    
 
    for value in values:
        date = value[2].split(" ")[0]
        d = date.split("-")
        year = int(d[0])
        month = int(d[1])
        
        if year in years:
            if month in years[year]:
                years[year][month]= years[year][month]+1
                messages[year][month].append(value[1])
            else:
                years[year][month] = 1
                messages[year][month] = []
                messages[year][month].append(value[1])      
    
    listYears = []
    for year in years:
        listYears.append(year)
        for i in range(1,13):
            if i not in years[year]:
                years[year][i] = 0
       
    listYears.sort(reverse=True)         
    X=[]
    for year in listYears:
        Y = dict()
        Y["rating"]=years[year]
        Y["name"]= sm + " " + str(year)
        Y["message"]=messages[year]
        X.append(Y)

     
    return X
    
    
    
    
    
