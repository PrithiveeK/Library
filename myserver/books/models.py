from mongoengine import Document, fields

class Books(Document):
    title = fields.StringField()
    author = fields.StringField()
    description = fields.StringField()
    publisher = fields.StringField()
    generes = fields.ListField(field=fields.StringField())
    ISBN = fields.StringField()
    published_date = fields.DateTimeField()

    def __str__(self):
        return self.ISBN

class MyShelfCR(Document):
    user_id = fields.ObjectIdField()
    book_id = fields.ReferenceField(Books, unique=True)

class MyShelfTR(Document):
    user_id = fields.ObjectIdField()
    book_id = fields.ReferenceField(Books, unique=True)

class MyShelfR(Document):
    user_id = fields.ObjectIdField()
    book_id = fields.ReferenceField(Books, unique=True)