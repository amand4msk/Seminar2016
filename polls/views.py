from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

from .models import Person


def index(request):
    return render(request, 'polls/index.html')


def like_category(request):
    likes = 0
    p = Person(forname="Maria", surname="Schmidt")
    p.save() 

    return HttpResponse('success')
