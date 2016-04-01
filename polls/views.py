from django.shortcuts import render

# Create your views here.
#Another comment
from django.http import HttpResponse

from .models import Person, Post, FacebookPost

import logging

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
