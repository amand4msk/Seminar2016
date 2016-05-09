from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^savePerson/$', views.savePerson, name='savePerson'),

    url(r'^saveFB/$', views.saveFB, name='saveFB'),
    url(r'^savePerson/$', views.savePerson, name='savePerson'),
     url(r'^savePost/$', views.savePost, name='savePost'),
     url(r'^wordCloud/$', views.wordCloud, name='wordCloud'),
     url(r'^initTemplate/$', views.initTemplate, name='initTemplate'),
     url(r'^coOccurence/$', views.coOccurence, name='coOccurence'),
     url(r'^posts/$', views.posts, name='posts'),
     url(r'^postsByDate/$', views.postsByDate, name='postsByDate'),
     url(r'^selectQuery/$', views.selectQuery, name='selectQuery')
    
    
]

