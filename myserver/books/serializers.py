from rest_framework_mongoengine.serializers import DocumentSerializer
from .models import *

class BooksSerializer(DocumentSerializer):
    class Meta:
        model = Books
        fields = '__all__'

class MyShelfCRSerializer(DocumentSerializer):
    book_id = BooksSerializer(read_only=True)

    class Meta:
        model = MyShelfCR
        fields = ('book_id',)

class MyShelfTRSerializer(DocumentSerializer):
    book_id = BooksSerializer(read_only=True)

    class Meta:
        model = MyShelfTR
        fields = ('book_id',)

class MyShelfRSerializer(DocumentSerializer):
    book_id = BooksSerializer(read_only=True)

    class Meta:
        model = MyShelfR
        fields = ('book_id',)