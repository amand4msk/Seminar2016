from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse

from .models import Person

import logging

def index(request):
    return render(request, 'polls/index.html')


def like_category(request):
    likes = 0
    p = Person(forname="Maria", surname="Schmidt")
    p.save() 
    logger = logging.getLogger(__name__)
    logger.info(request)

    return HttpResponse('success')
