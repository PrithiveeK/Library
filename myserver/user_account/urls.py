from django.urls import path

from .views import *

urlpatterns = [
    path('all/', AllUsers),
    path('one/', OneUser),
    path('login/', UserLogin),
    path('signup/', UserSignup),
    path('mail/', sendMail),
]