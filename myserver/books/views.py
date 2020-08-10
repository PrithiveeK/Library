from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import StreamingHttpResponse
from .models import *
from .serializers import *
from re import compile, IGNORECASE, sub

def sendData(datas):
    for data in datas:
        yield json.dumps(data)

@api_view(['GET'])
def AllBooks(request):
    books = Books.objects.all()
    serBooks = BooksSerializer(books, many=True)
    # return StreamingHttpResponse(sendData(serBooks.data), content_type='application/stream+json')
    return Response(serBooks.data)

@api_view(['GET'])
def OneBook(request, bookID):
    book = Books.objects.get(id=bookID)
    serBook = BooksSerializer(book, many=False)
    isBook = MyShelfTR.objects(book_id=bookID)
    return Response({**serBook.data,"isTR": not not isBook})


@api_view(['GET','POST'])
def ReadBooks(request, userID):
    if request.method == 'POST':
        try:
            newAddition = MyShelfRSerializer(data=request.data)
            if newAddition.is_valid():
                newAddition.save()
            return Response({'ok': True})
        except:
            return Response({'ok': False})
    elif request.method == 'GET':
        try:
            rBooks = MyShelfR.objects(user_id=userID)
            serRB = MyShelfRSerializer(rBooks, many=True)
            return Response(serRB.data) 
        except:
            return Response([])

@api_view(['GET','POST'])
def ToReadBooks(request, userID):
    if request.method == 'POST':
        try:
            newAddition = MyShelfTRSerializer(data=request.data)
            if newAddition.is_valid():
                newAddition.save()
            return Response({'ok': True})
        except:
            return Response({'ok': False})
    elif request.method == 'GET':
        try:
            trBooks = MyShelfTR.objects(user_id=userID)
            serTRB = MyShelfTRSerializer(trBooks, many=True)
            return Response(serTRB.data) 
        except:
            return Response([])

@api_view(['GET','POST'])
def ContReadBooks(request, userID):
    if request.method == 'POST':
        try:
            newAddition = MyShelfCRSerializer(data=request.data)
            if newAddition.is_valid():
                newAddition.save()
            return Response({'ok': True})
        except:
            return Response({'ok': False})
    elif request.method == 'GET':
        try:
            crBooks = MyShelfCR.objects(user_id=userID)
            serCRB = MyShelfCRSerializer(crBooks, many=True)
            return Response(serCRB.data) 
        except:
            return Response([])

@api_view(['POST'])
def filterBooks(request):
    regex = compile(sub("[^\w]+",".*",request.data["q"]), IGNORECASE)
    query = []
    if request.GET.get("t","0") == "1":
        query.append({"title": {"$regex": regex}})
    if request.GET.get("a","0") == "1":
        query.append({"author": {"$regex": regex}})
    if request.GET.get("p","0") == "1":
        query.append({"publisher": {"$regex": regex}})
    if request.GET.get("d","0") == "1":
        query.append({"description": {"$regex": regex}})
    if query:
        books = Books.objects(__raw__={ "$or": query})
        serBooks = BooksSerializer(books, many=True)
        return Response(serBooks.data)
    return Response([])