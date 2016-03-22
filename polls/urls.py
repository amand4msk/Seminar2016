from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^like_category/$', views.like_category, name='like_category'),

]

