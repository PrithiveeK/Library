import json
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncConsumer, SyncConsumer
from .models import *
from user_account.models import Users

class ChatConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        self.chat_room = self.scope["url_route"]["kwargs"]["room_name"]
        self.notify = "notifications"
        self.scope["user"] = await self.get_user()
        self.thread = await self.get_thread()
        if self.scope["user"] == None or self.thread == None:
            await self.send({
                "type": "websocket.accept"
            })
            await self.send({
                "type": "websocket.close"
            })
            return
        await self.channel_layer.group_add(
            self.chat_room,
            self.channel_name
        )
        await self.send({
            "type": "websocket.accept"
        })
    
    async def websocket_disconnect(self, event):
        await self.channel_layer.group_discard(
            self.chat_room,
            self.channel_name
        )

    async def websocket_receive(self, event):
        data = json.loads(event["text"])
        if data["command"] == "fetch_messages":
            await self.fetch_messages()
        elif data["command"] == "new_message":
            await self.new_message(data)
        elif data["command"] == "create_group":
            await self.create_new_group(data)
        elif data["command"] == "fetch_groups":
            await self.fetch_all_groups()
        elif data["command"] == "mark_read":
            await self.mark_as_read()

    async def fetch_messages(self):
        messages = await self.get_messages()
        messages = self.messages_to_json(messages)
        response = {
            "type": "fetch_messages",
            "data": messages
        }
        await self.send_message({"text" : response})

    async def new_message(self, data):
        message = await self.create_new_message(data["message"])
        message = self.message_to_json(message)
        response = response = {
            "type": "receive_message",
            "data": message
        }
        await self.broadcast_message(response)

    async def create_new_group(self, data):
        newGroup = await self.create_group(data)
        if newGroup == None:
            response = {
                "text": {
                    "type": "create_group",
                    "ok": False
                }
            }
            await self.send_message(response)
        else:
            response = {
                "text": {
                    "type": "create_group",
                    "ok": True,
                    "data": self.group_to_json(newGroup)
                }
            }
            await self.send_message(response)
    
    async def fetch_all_groups(self):
        groups = await self.get_groups()
        groups = self.groups_to_json(groups)
        response = {
            "type": "fetch_groups",
            "data": groups
        }
        await self.send_message({"text":response})

    async def broadcast_message(self, event):
        await self.channel_layer.group_send(
            self.chat_room,{
            "type": "send_message",
            "text": event
        })

    async def send_message(self, event):
        await self.send({
            "type": "websocket.send",
            "text": json.dumps(event["text"])
        })

    def messages_to_json(self, messages):
        return [self.message_to_json(message) for message in messages]

    def message_to_json(self, message):
        return {
            "id": str(message.id),
            "message": message.message,
            "time_sent": str(message.time_sent),
            "user_from": {
                "id": str(message.user_from.id),
                "username": message.user_from.username,
            }
        }

    def groups_to_json(self, groups):
        return [self.group_to_json(group) for group in groups]

    def group_to_json(self, group):
        displayName = "Global"
        groupId = "0"
        if group.thread_name.startswith("room_"):
            displayName = group.thread_name[5:]
        elif group.thread_name != "Global":
            idx = group.members.index(self.scope["user"].id)
            displayName = Users.objects.get(id=group.members[not idx]).username
            groupId = str(group.members[not idx])
        return {
            "id": groupId,
            "thread_id": str(group.id),
            "displayname": displayName,
            "users": [str(member) for member in group.members]
        }

    @database_sync_to_async
    def get_messages(self):
        header = {
            "thread": self.thread,
            "user_from": self.scope["user"].id,
            "page_no": 1
        }
        return Messages.get_messages(header)
    
    @database_sync_to_async
    def create_new_message(self, message):
        header = {
            "thread": self.thread,
            "user_from": self.scope["user"],
            "message": message
        }
        return Messages.new_message(header)
    
    @database_sync_to_async
    def get_user(self):
        userID = self.scope["query_string"].decode()
        return Users.objects.get(id=userID)

    @database_sync_to_async
    def get_thread(self):
        return ChatThread.get_and_validate(self.chat_room, self.scope["user"].id)

    @database_sync_to_async
    def create_group(self, data):
        return ChatThread.create_new_thread("room_"+data["thread_name"], data["users"])
    
    @database_sync_to_async
    def get_groups(self):
        return ChatThread.get_groups(self.scope["user"].id)

    @database_sync_to_async
    def get_user(self):
        userID = self.scope["query_string"].decode()
        return Users.objects.get(id=userID)

    @database_sync_to_async
    def mark_as_read(self):
        MessageNotification.update_notification(self.thread.id, self.scope["user"].id)

class NotificationConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        self.notify = "notifications"
        self.scope["user"] = await self.get_user()
        if self.scope["user"] == None:
            await self.send({
                "type": "websocket.accept"
            })
            await self.send({
                "type": "websocket.close"
            })
            return
        await self.channel_layer.group_add(
            self.notify,
            self.channel_name
        )
        await self.send({
            "type": "websocket.accept"
        })
        await self.fetch_notifications()

    async def websocket_disconnect(self, event):
        await self.channel_layer.group_discard(
            self.notify,
            self.channel_name
        )

    async def websocket_receive(self, event):
        data = json.loads(event["text"])
        await self.new_notification(data)

    async def fetch_notifications(self):
        notifications = await self.get_notifications()
        notifications = self.notifications_to_json(notifications)
        response = {
            "type": "fetch_notifications",
            "data": notifications
        }
        await self.send_message({"text": response})

    async def new_notification(self, data):
        response = {
            "type": "new_notification",
            "data": {
                "user_from": str(self.scope["user"].id),
                "thread_id": str(data["thread_id"]),
            }
        }
        await self.broadcast_notifications(response)

    async def broadcast_notifications(self, event):
        await self.channel_layer.group_send(
            self.notify, {
            "type": "send_message",
            "text": event
        })

    async def send_message(self, event):
        await self.send({
            "type": "websocket.send",
            "text": json.dumps(event["text"])
        })
    
    def notifications_to_json(self, notifications):
        return {str(notification["_id"]): notification["count"] for notification in notifications}
    
    @database_sync_to_async
    def get_user(self):
        userID = self.scope["query_string"].decode()
        return Users.objects.get(id=userID)
    
    @database_sync_to_async
    def get_notifications(self):
        return MessageNotification.get_notifications(self.scope["user"].id)