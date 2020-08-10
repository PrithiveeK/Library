from django.urls import path, include
from .views import *

urlpatterns = [
    path('pay/', initiate_payment),
    path('callback/', callback),
]