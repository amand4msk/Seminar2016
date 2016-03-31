from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^savePerson/$', views.savePerson, name='savePerson'),

    url(r'^saveFB/$', views.saveFB, name='saveFB'),
     url(r'^savePost/$', views.savePost, name='savePost'),
]

