from rest_framework_mongoengine.serializers import DocumentSerializer
from .models import Users

class InsertUsersSerializer(DocumentSerializer):
    class Meta:
        model = Users
        fields = '__all__'

class GetUsersSerializer(DocumentSerializer):
    class Meta:
        model = Users
        fields = ("id", "username")