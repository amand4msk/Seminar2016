from django.shortcuts import render, render_to_response

# Create your views here.
from django.http import HttpResponse

from .models import Person, Post, FacebookPost, TwitterPost, link, hashtag, comment
from dateutil.parser import parse
import logging
import tweepy 

#Twitter API credentials
consumer_key = "WKIVk3Rbmw88iz9MjkBdjFxzo"
consumer_secret = "vldfWfXDTVYJzJ0rKWAdTsdJRGQaElN4NjBh1ljEwj5kzqpjVB"
access_key = "840300386-OObp0Uk2kGfp4y5KFtC7evyaIYsA9ZIE64ozeB3w"
access_secret = "krL6FvULRsvw5FInqbwkJNPMnBslYQwPFQ9I0bNuxmli4"


def get_all_tweets(request):
    screen_name = "realDonaldTrump"
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_key, access_secret)
    api = tweepy.API(auth)
    
    alltweets = []  
    new_tweets = api.user_timeline(screen_name = screen_name,count=200)
    alltweets.extend(new_tweets)
    oldest = alltweets[-1].id - 1
    while len(new_tweets) > 0:
        print "getting tweets before %s" % (oldest)
        new_tweets = api.user_timeline(screen_name = screen_name,count=200,max_id=oldest)
        alltweets.extend(new_tweets)
        oldest = alltweets[-1].id - 1
        print "...%s tweets downloaded so far" % (len(alltweets))
    
    username = screen_name
    name = alltweets[0]._json['user']['name']
    person = Person(usernameFB="", usernameTwitter=screen_name, usernameInstagram="", forname=name, surname="")
    person.save()

    for tweet in alltweets:
        message = tweet.text.encode("utf-8")
        date = tweet._json['user']['created_at']
        d = parse(date)
        published = d.strftime('%Y-%m-%d %H:%M:%S')
        url = "https://twitter.com/"+str(tweet._json['user']['screen_name'])+"/status/"+str(tweet.id)
        likes = tweet.favorite_count
        retweet = tweet.retweet_count

        post = Post(person=person, message=message, published=published)
        post.save()

        twPost = TwitterPost(post=post, url=url, likes=likes, retweet=retweet)
        twPost.save() 

        for h in tweet.entities['hashtags']:
            hasht = "#"+str(h['text'])
            ht = hashtag(name=hasht)
            ht.save()
            ht.posts.add(post)

        for h in tweet.entities['urls']:
            url_link =  str(h['url'])
            lk = link(url=url_link)
            lk.save()
            lk.posts.add(post)

    return render_to_response('polls/index.html')


def saveTwitter(request):
    usernameFB = request.POST['FB']
    person = Person.objects.get(usernameFB=usernameFB)
    countOfPosts = person.countOfPosts +1 
    
    message = request.POST['message']
    published = request.POST['created_time']
    idPost = request.POST['id']
    
    post = Post(person=person, message=message, published=published)
    post.save()
    
    fbPost = FacebookPost(post=post, idPost=idPost)
    
    
    person.save()
    return HttpResponse('success')

def index(request):
    return render(request, 'polls/index.html')

def savePerson(request):
    fb = request.POST['FB']
    tw = request.POST['Twitter']
    inst = request.POST['Instagram']
    forname = request.POST['forname']
    surname = request.POST['surname']
    
    if Person.objects.filter(usernameFB=fb).count() !=0:
        return HttpResponse('success')
    
    person = Person(usernameFB=fb, usernameTwitter=tw, usernameInstagram=inst, forname=forname, surname=surname)

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
    post.save()
    
    fbPost = FacebookPost(post=post, idPost=idPost)
    
    
    fbPost.save() 

    return HttpResponse('success')
