from django.shortcuts import render, render_to_response
# Create your views here.
#Another comment
from django.http import HttpResponse
from .models import Person, Post, FacebookPost, hashtag, InstagramPost
import logging
from instagram.client import InstagramAPI


def get_instagram_data(request):
    access_token = "1443233530.1fb234f.83314ed2508f4045be79db548eea1334"  
    api = InstagramAPI(access_token=access_token, 
                        client_id = "6059a34659a34258a05bbad5303a4543", 
                        client_secret="be154d7d5f2b4ac0886cf06026f17825")
    user = api.user_search(q='realdonaldtrump')
    person = Person(usernameInstagram=user[0].username, name=user[0].full_name)
    person.save()

    recent_media, next_ = api.user_recent_media(user_id=user[0].id, count=33)
    for media in recent_media:

        likes = media.like_count # count of likes of a post 
        message = media.caption.text # post text
        published = media.created_time # date of the post
        url = media.link # url of the post
        idPost = media.id
        post = Post(person=person, message=message, published=published, idPost=idPost)
        post.save()

        inPost = InstagramPost(post=post, url=url, likes=likes)
        inPost.save()

        for h in media.tags:
            hasht = "#"+str(h.name) 
            ht = hashtag(name=hasht)
            ht.save()
            ht.posts.add(post)

    return render_to_response('polls/index.html')

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
    person.countOfPosts = person.countOfPosts +1 
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
