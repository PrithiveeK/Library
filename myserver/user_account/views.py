from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.mail import send_mail
import requests
from .models import Users
from .serializers import *

@api_view(['GET'])
def AllUsers(request):
    users = None
    userId = request.GET.get("u", None)
    if userId == None:
        users = Users.objects.all()
    else:
        users = Users.objects(id__ne=userId)
    serUsers = GetUsersSerializer(users, many=True)
    return Response(serUsers.data)

@api_view(["GET"])
def OneUser(request):
    user = Users.objects.get(id=request.GET.get("u"))
    serUser = GetUsersSerializer(user, many=False)
    return Response(serUser.data)

@api_view(['POST'])
def UserLogin(request):
    try:
        findUser = Users.objects.get(email=request.data['email'])
        if request.data['password'] != findUser.password:
            raise Exception('Invalid')
        return Response({'ok':True,'id': str(findUser.id)})
    except:
        return Response({'ok':False,'id': "0"})

@api_view(['POST'])
def UserSignup(request):
    try:
        newUser = InsertUsersSerializer(data=request.data)
        if newUser.is_valid():
            newUser.save()
            return Response({'ok':True,'id':str(newUser.data['id'])})
        return Response({'ok':False,'id': "0"})
    except:
        return Response({'ok':False,'error': 'something went wrong'})

@api_view(['GET',"POST"])
def sendMail(request):
    res = requests.get('https://www.googleapis.com/books/v1/volumes/'+request.GET.get("book")).json()
    epub = ''
    pdf = ''
    if res["accessInfo"]["epub"]["isAvailable"]:
        epub = 'EPUB: '+res["accessInfo"]["epub"]["acsTokenLink"]
    if res["accessInfo"]["pdf"]["isAvailable"]:
        epub = 'EPUB: '+res["accessInfo"]["pdf"]["acsTokenLink"]
    
    user = Users.objects.get(id=request.GET.get('user'))
    response = send_mail(
        'Book You Bought from Library',
        'Hi dear friend, Here is the link for your book.\n'+epub+pdf,
        '17l233@kce.ac.in',
        [user["email"]],
        fail_silently=False,
    )
    return Response({"Ok": response == 1})