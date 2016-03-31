from __future__ import unicode_literals

from django.db import models


# Create your models here.


class Person(models.Model):
    usernameFB = models.CharField(max_length=200)
    usernameTwitter = models.CharField(max_length=200)
    usernameInstagram = models.CharField(max_length=200)
    
    forname = models.CharField(max_length=100)
    surname = models.CharField(max_length = 100)
    countOfPosts = models.IntegerField(default = 0)
    
class Post(models.Model):
    person = models.ForeignKey(Person, on_delete=models.CASCADE)
    message = models.TextField()
    published = models.DateTimeField('date published')
    idPost =models.CharField(max_length = 100)
    
    
class FacebookPost(models.Model):
    idPost =models.CharField(max_length = 100)
    likes = models.IntegerField(default = 0)
    shares = models.IntegerField(default = 0)
    countComment = models.IntegerField(default =0)
    
class TwitterPost(models.Model):
    post = models.OneToOneField(Post,on_delete=models.CASCADE, default=0)
    url = models.CharField(max_length = 200)
    likes = models.IntegerField(default = 0)
    retweet = models.IntegerField(default = 0)

class InstagramPost(models.Model):
    post = models.OneToOneField(Post,on_delete=models.CASCADE, default=0)
    url = models.CharField(max_length = 200)
    likes = models.IntegerField(default = 0)
    
class link(models.Model):
    posts = models.ManyToManyField(Post)
    url = models.CharField(max_length= 200)
    
class hashtag(models.Model):
    posts = models.ManyToManyField(Post)
    name = models.CharField(max_length= 200)
    
class comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    text = models.TextField() 
    

 
