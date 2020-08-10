from mongoengine import Document, fields
from datetime import datetime
from user_account.models import Users
from re import compile


class ChatThread(Document):
    thread_name = fields.StringField(unique=True)
    members = fields.ListField(field=fields.ObjectIdField())

    def get_and_validate(threadName, user=None):
        if user == None:
            return None
        thread = ChatThread.objects(thread_name=threadName).first()
        if thread == None:
            users = ChatThread.decode_threadName(threadName)
            thread = ChatThread.create_new_thread(threadName, users)
        if thread != None and threadName == "Global" or user in thread.members:
            return thread
        return None

    def create_new_thread(threadName, users=None):
        if users == None or len(users) < 2 :
            return None
        try:
            newThread = ChatThread.objects.create(thread_name=threadName, members=users)
            newThread.save()
            return newThread
        except:
            return None

    def get_groups(userID):
        return ChatThread.objects(__raw__={"$or": [{"thread_name": "Global"},{"members": userID}]})

    def decode_threadName(threadName):
        decode_list = threadName.split("_")
        if len(decode_list) < 2:
            return None
        return decode_list

    def __str__(self):
        return self.thread_name

class Messages(Document):
    message_thread = fields.ReferenceField(ChatThread, required=True)
    user_from = fields.ReferenceField(Users)
    message = fields.StringField(required=True)
    time_sent = fields.DateTimeField(default=datetime.utcnow())

    def new_message(data):
        if data["thread"] == None:
            return None
        newMessage = Messages.objects.create(
            message_thread=data["thread"],
            user_from=data["user_from"],
            message=data["message"]
        )
        newMessage.save()
        MessageNotification.create_notification(newMessage)
        return newMessage
        
    def get_messages(header):
        if header["thread"] == None:
            return []
        # pageNo = header["page_no"]
        # offset = (pageNo-1)*10
        return Messages.objects(message_thread=header["thread"].id)

    def __str__(self):
        return str(self.id)


class MessageNotification(Document):
    thread_id = fields.ObjectIdField()
    message_id = fields.ObjectIdField()
    user_to = fields.ObjectIdField()
    seen = fields.BooleanField(default=False)

    def create_notification(message):
        send_to = message.message_thread.members
        if send_to == []:
            send_to = [
                MessageNotification(
                    thread_id=message.message_thread.id,
                    message_id=message.id,
                    user_to=user.id
                )
                for user in Users.objects.all() 
                if user.id != message.user_from.id
            ]
        else:
            send_to = [
                MessageNotification(
                    thread_id=message.message_thread.id,
                    message_id=message.id,
                    user_to=user
                ) 
                for user in send_to 
                if user != message.user_from.id
            ]
        MessageNotification.objects.insert(send_to)
        return

    def update_notification(threadID, userID):
        MessageNotification.objects(thread_id=threadID,user_to=userID).update(set__seen=True)

    def get_notifications(userID):
        pipeline = [
            {"$group": {
                "_id": "$thread_id",
                "count": {
                    "$sum": 1,
                },
            }},
        ]
        return list(MessageNotification.objects(user_to=userID,seen=False).aggregate(pipeline))

    def __str__(self):
        return str(self.id)