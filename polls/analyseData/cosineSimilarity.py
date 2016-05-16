from django.conf import settings
import io 
import io
import json
import datetime
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def compare(file, file_likes):
   
        posts_fb = []
        posts_tw = []
        likes_fb = []
        likes_tw = []
        documents = ()
        #Save in array of dictionaries the posts of fb (id, text, date)
        with io.open(settings.JSONFILES_FOLDER +"Facebook/" + file, encoding='utf8') as data_file:    
          data = json.load(data_file)
          for key, entry in data.iteritems():
            if key == 'values':
                    for post in entry:
                        dictionary_fb = {}
                        d = datetime.datetime.strptime(post[2][:19],"%Y-%m-%d %H:%M:%S")
                        date_tw  = d.strftime("%Y-%m-%d")
                        dictionary_fb['text'] = post[1]
                        dictionary_fb['date'] = date_tw
                        dictionary_fb['id'] = post[0]
                        posts_fb.append(dictionary_fb)

        print "[*] FB post length: "+ str(len(posts_fb))

        #Save in array of dictionaries the posts of twitter (id, text, date)
        with io.open(settings.JSONFILES_FOLDER +"Twitter/" + file, encoding='utf8') as data_file:    
          data = json.load(data_file)
          for key, entry in data.iteritems():
            if key == 'values':
                    for post in entry:
                        dictionary_tw = {}
                        d = datetime.datetime.strptime(post[2],"%Y-%m-%dT%H:%M:%SZ")
                        date_fb  = d.strftime("%Y-%m-%d")
                        dictionary_tw['text'] = post[1]
                        dictionary_tw['date'] = date_fb
                        dictionary_tw['id'] = post[0]
                        posts_tw.append(dictionary_tw)

        print "[*] TW post length: "+str(len(posts_tw))

        with io.open(settings.JSONFILES_FOLDER +"Facebook/"  + file_likes, encoding='utf8') as data_file:    
          data = json.load(data_file)
          for key, entry in data.iteritems():
            if key == 'values':
                    for post in entry:
                        dictlikes_fb = {}
                        dictlikes_fb['likes'] = post[2]
                        dictlikes_fb['id'] = post[0]
                        likes_fb.append(dictlikes_fb)

        print "[*] FB likes length: "+ str(len(likes_fb))

        #Save in array of dictionaries the posts of twitter (id, text, date)
        with io.open(settings.JSONFILES_FOLDER +"Twitter/" +  file_likes, encoding='utf8') as data_file:    
          data = json.load(data_file)
          for key, entry in data.iteritems():
            if key == 'values':
                    for post in entry:
                        dictlikes_tw = {}
                        dictlikes_tw['likes'] = post[2]
                        dictlikes_tw['id'] = post[0]
                        likes_tw.append(dictlikes_tw)

        print "[*] TW likes length: "+ str(len(likes_tw))

        # Create tuple with all posts from fb and twitter
        for i, post in enumerate(posts_fb):
            documents = list(documents)
            documents.insert(i, post['text'])
            documents = tuple(documents)

        index=0
        for i, post in enumerate(posts_tw):
            documents = list(documents)
            index = len(documents)
            index +=i
            documents.insert(index, post['text'])
            documents = tuple(documents)

        #Create TF-IDF
        tfidf_vectorizer = TfidfVectorizer()
        tfidf_matrix = tfidf_vectorizer.fit_transform(documents)
        #Cosine Similarity- threshold, 0.60

        similarities = cosine_similarity(tfidf_matrix, tfidf_matrix)
        similar_fb = []
        similar_tw = []
        #Select the posts that have 0.60 similarity and above
        for i, value in enumerate(similarities):
            for j, score in enumerate(value[i:]):
                j = j+i
                if score>0.6 and i!=j:
                    if i<=len(posts_fb) and j>=(len(posts_fb)+1):
                        dict_fb = {}
                        dict_tw = {}
                        print score, i, j
                        dict_fb['id'] =  posts_fb[i]['id']
                        dict_fb['text'] = posts_fb[i]['text'].encode('utf-8')
                        print dict_fb['text']
                        dict_fb['date'] = posts_fb[i]['date'].encode('utf-8')
                        print dict_fb['date']
                        dict_tw['id'] = posts_tw[j-len(posts_fb)]['id']
                        dict_tw['text'] = posts_tw[j-len(posts_fb)]['text'].encode('utf-8')
                        print dict_tw['text']
                        dict_tw['date'] = posts_tw[j-len(posts_fb)]['date'].encode('utf-8')
                        print dict_tw['date']
                        dict_tw['likes'] = likes_tw[j-len(posts_fb)]['likes']
                        print 
                        similar_fb.append(dict_fb)
                        similar_tw.append(dict_tw)

        print len(similar_fb)
        print len(similar_tw)
        for text in similar_fb:
            for p in likes_fb:
                if p['id'] == text['id']:
                    text['likes'] = p['likes']

        nptw = np.array(similar_tw)
        npfb = np.array(similar_fb)
        arr1inds = nptw.argsort()
        sorted_tw = nptw[arr1inds[::-1]]
        sorted_fb = npfb[arr1inds[::-1]]
        sorted_tw = sorted_tw.tolist()
        sorted_fb = sorted_fb.tolist()

        returnDict = dict()
        returnDict["sorted_tw"] = sorted_tw
        returnDict["sorted_fb"] = sorted_fb

        #return HttpResponseRedirect('/polls/')
        return returnDict 
