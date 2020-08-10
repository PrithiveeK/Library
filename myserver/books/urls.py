from django.urls import path

from .views import *

urlpatterns = [
    path('in/', filterBooks),
    path('all/', AllBooks),
    path('one/<str:bookID>/', OneBook),
    path('r/<str:userID>/', ReadBooks),
    path('tr/<str:userID>/', ToReadBooks),
    path('cr/<str:userID>/', ContReadBooks),
]