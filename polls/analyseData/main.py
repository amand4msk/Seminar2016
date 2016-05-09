from __future__ import print_function
import json
import operator
import copy
from sklearn.decomposition import NMF, LatentDirichletAllocation
from time import time

from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from scipy.sparse import csr_matrix
from message import Message
from cluster import Cluster

import writeJson

n_samples = 2000
n_features = 1000
n_topics = 10
n_top_words = 20


def print_top_words(model, feature_names, n_top_words):
    for topic_idx, topic in enumerate(model.components_):
        print("Topic #%d:" % topic_idx)
        
        
        print(" ".join([feature_names[i]
                        for i in topic.argsort()[:-n_top_words - 1:-1]]))
        s=''
        for i in topic.argsort()[:-n_top_words - 1:-1]:
            s = s + ' '  + str(topic[i])
        print(s)
    print()



file_directory="DATA/barackobama.json"

json_data=open(file_directory).read()
data = json.loads(json_data)
values = data["values"]
words = dict();

messagesText = []
postIds = []
dates = []

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
for m in messagesText:
    for ch in [',','.','!',':','?']:
        if ch in m:
            m=m.replace(ch,'')



#a = cosine_similarity(tfidf[0:1], tfidf)
'''
messages= []
i=0
for tf in tfidf:
    
    message = Message(values[i][0], values[i][1], values[i][2])
    message.tfIdfVector= tf.toarray()[0]
    messages.append(copy.copy(message))
    i= i +1 
    
clusters =[]


j = 0
for m in messages:
    maxSim = 0
    clusterNumber = None
    print(j)
    j = j+1
    for i in range(0,len(clusters)):
        sim = clusters[i].simClusterMessage(m.tfIdfVector)
        if sim > 0:
            maxSim = sim
            clusterNumber = i
            clusters[clusterNumber].addMessage(m)

    
    if clusterNumber == None:
        c = Cluster(m.tfIdfVector, m)
        clusters.append(copy.copy(c))


i=0
for c in clusters:
    print("cluster " + str(i) + "***********************************************")
    print(len(c.messages))
    f = open('cluster_' + str(i), 'w')
    
    for m in c.messages:
        f.write(m.message)
        f.write("\n")
        f.write("\n")
    f.close()
    i=i+1

'''

# Use tf (raw term count) features for LD]
tfidf_vectorizer = TfidfVectorizer(max_df=0.95, min_df=2,  stop_words='english')
tfidf = tfidf_vectorizer.fit_transform(messagesText)
tfidf_feature_names = tfidf_vectorizer.get_feature_names()

print("Extracting tf features for LDA...")
tf_vectorizer = CountVectorizer(max_df=0.95, min_df=2, max_features=n_features,
                                stop_words='english')
t0 = time()
tf = tf_vectorizer.fit_transform(messagesText)

'''
# Fit the NMF model
print("Fitting the NMF model with tf-idf features,""n_samples=%d and n_features=%d..."% (n_samples, n_features))
t0 = time()
nmf = NMF(n_components=n_topics, random_state=1, alpha=.1, l1_ratio=.5).fit(tfidf)

print("done in %0.3fs." % (time() - t0))

print("\nTopics in NMF model:")
tfidf_feature_names = tfidf_vectorizer.get_feature_names()
print_top_words(nmf, tfidf_feature_names, n_top_words)
'''

print("Fitting LDA models with tf features, n_samples=%d and n_features=%d..." % (n_samples, n_features))
lda = LatentDirichletAllocation(n_topics=n_topics, max_iter=5,learning_method='online', learning_offset=50.,
                                random_state=0)
t0 = time()
model = lda.fit(tf)
print("done in %0.3fs." % (time() - t0))

print("\nTopics in LDA model:")
tf_feature_names = tf_vectorizer.get_feature_names()
print_top_words(lda, tf_feature_names, n_top_words)





writeJson.write(lda, tf_feature_names, 20,tf,n_topics, messagesText, dates, postIds)