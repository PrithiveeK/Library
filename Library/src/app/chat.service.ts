import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public notifications: WebSocketSubject<any>;
  public userID:string ;
  constructor() { 
    this.userID = localStorage.getItem("liu");
    this.notifications = this.notify();
  }
  connect(room_name: string): WebSocketSubject<any> {
    const ws:WebSocketSubject<any> = webSocket(`ws://localhost:8000/api/chat/${room_name}/?${this.userID}`);
    return ws; 
  }
  notify(){
    const ws:WebSocketSubject<any> = webSocket(`ws://localhost:8000/api/chat/?${this.userID}`);
    return ws; 
  }
  fetchMessages(instance){
    instance.next({
      command: "fetch_messages"
    })
  }
  fetchGroups(instance){
    instance.next({
      command: "fetch_groups"
    })
  }
  sendMessage(instance, message, thread_id) {
    instance.next({
      command: "new_message",
      message
    });
    this.notifications.next({
      user_from: this.userID,
      thread_id
    })
  }
  createGroup(instance, data) {
    instance.next({
      command: "create_group",
      thread_name: data.groupName,
      users: data.users
    });
  }
  markRead(instance){
    instance.next({
      command: "mark_read",
    })
  }
}
