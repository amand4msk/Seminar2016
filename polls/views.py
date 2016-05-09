from django.shortcuts import render
import logging
log = logging.getLogger(__name__)

# Create your views here.
#Another comment
from django.http import HttpResponse

from .models import Person, Post, FacebookPost

import logging
#from analyseData.analyseData import getPersons, test, getcoOccurenceMatrix, getPosts, getPostsByDate

def index(request):
    return render(request, 'polls/index.html')


def getField(field,request):
    if field in request.POST:
        return request.POST[field]
    else:
        return ''

def savePerson(request):
    
    fb = getField('FB', request)
    tw = getField('Twitter', request)
    inst = getField('Instagram', request)
    first_name =getField('first_name', request)
    last_name =getField('last_name', request)
    name =getField('name', request)

    
    if Person.objects.filter(usernameFB=fb).count() !=0:
        Person.objects.get(usernameFB=fb).delete()
    
    person = Person(usernameFB=fb, usernameTwitter=tw, usernameInstagram=inst, last_name=last_name, first_name=first_name, name=name)

    person.save()
    return HttpResponse('success')
    
def savePost(request):
    usernameFB = request.POST['FB']
    
    #if Person.objects.filter(usernameFB=usernameFB).count() ==0:
     #   savePerson(request)
    
    person = Person.objects.get(usernameFB=usernameFB)
    countOfPosts = person.countOfPosts +1 
    person.save() 
    
    
    
    message = getField('message', request)
    published = getField('created_time', request)
    idPost = getField('id', request)
    

    
    post = Post(person=person,idPost=idPost, message=message, published=published)
    post.save()
    return HttpResponse('success')


def saveFB(request):
    idPost = request.POST['id']
    likes = request.POST['likes']
    comments=request.POST['comments']
    fbPost = FacebookPost(idPost=idPost, likes=likes, countComment=comments, shares=0)
    
    fbPost.save() 

    return HttpResponse('success')


def wordCloud(request):
    data = test(request.POST['filename'], int(request.POST['numberOfTopics']))
    '''log.debug("Hey there it works!!")
    log.info("Hey there it works!!")
    log.warn("Hey there it works!!")
    log.error("Hey there it works!!")'''
    return HttpResponse(data)

def coOccurence(request):
    numberOfWords = 10
    data = getcoOccurenceMatrix(request.POST['filename'], numberOfWords)
    return HttpResponse(data)

def initTemplate(request):
    data = getPersons()
    return  HttpResponse(data)


def posts(request):
    data = getPosts(request.POST['filename'])
    return HttpResponse(data)

def postsByDate(request):
    data = getPostsByDate(request.POST['filename'])
    return HttpResponse(data)
    