from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

from .models import Person, Post

import logging

def index(request):
    return render(request, 'polls/index.html')


def savePerson(request):
    fb = request.POST['FB']
    usernameTwitter = request.POST['Twitter']
    usernameInstagram = request.POST['Instagram']
    forname = request.POST['forname']
    surname = request.POST['surname']
    
    person = Person(usernameFB=fb, usernameTwitter=usernameTwitter, usernameInstagram=usernameInstagram, forname=forname, surname=surname)

    person.save()
    return HttpResponse('success')
    
def saveFB(request):
    usernameFB = request.POST['FB']
    person = Person.objects.get(usernameFB=usernameFB)
    countOfPosts = person.countOfPosts +1 
    
    message = request.POST['message']
    published = request.POST['created_time']
    idPost = request.POST['id']
    
    post = Post(person=person, message=message, published=published)
    
    fbPost = FacebookPost(post=post, idPost=idPost)
    
    post.save()
    fbPost.save() 

    return HttpResponse('success')
