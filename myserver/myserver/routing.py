from django.conf.urls import url
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from chat.consumer import *
application = ProtocolTypeRouter({
    'websocket': AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                url(r'api/chat/$', NotificationConsumer),
                url(r'api/chat/(?P<room_name>\w+)/$', ChatConsumer),
            ])
        ),
    ),
})