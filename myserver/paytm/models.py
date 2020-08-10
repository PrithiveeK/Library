from datetime import datetime
from mongoengine import Document, fields

class PlaceOrder(Document):
    user_id = fields.ObjectIdField()
    book_id = fields.ObjectIdField()
    time_order = fields.DateTimeField(default=datetime.now())
    txn_id = fields.StringField()
    payment_mode = fields.StringField()

    def __str__(self):
        return self.txn_id
