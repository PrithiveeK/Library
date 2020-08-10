from mongoengine import Document, fields

class Users(Document):
    username = fields.StringField(required=True)
    email = fields.EmailField(required=True,unique=True)
    password = fields.StringField(required=True)

    def __str__(self):
        return self.email