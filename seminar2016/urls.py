from django.conf.urls import include, url
from django.contrib import admin

urlpatterns = [
    # Examples:
    #blabla
    # url(r'^$', 'seminar2016.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^polls/', include('polls.urls')),
    url(r'^admin/', include(admin.site.urls)),
]
