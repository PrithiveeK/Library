from django.shortcuts import render, redirect

# Create your views here.

from user_account.models import Users

def index(request):
    return render(request, 'chat/index.html')

def ChatRoom(request, room_name):
    email = request.POST.get('username')
    password = request.POST.get('password')
    user = Users.objects.get(email=email)
    if user.password == password:
        return render(request, 'chat/room.html', {
            "room_name": room_name,
            "username": str(user.id)
        })
    else:
        return redirect('http://localhost:8000/api/chat/')
        