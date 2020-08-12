import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { UserAccountService } from '../user-account.service';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @ViewChild('chatContent', {static: false}) chatContent: ElementRef; 
  @ViewChildren('chatItem') chatItem: QueryList<any>;
  public chatViewPage = 0;
  public chatNotifications: any;
  public allNotification = 0;
  public optionsClicked = false;
  public openChat = false;
  public allThreads: any[] = [];
  public groupError = "";
  public allUsers = [];
  public chatWith = false;
  public currChat = "Global";
  public threadName = "Global"
  public currentThread = "5f269f2d6df622a58724b3f6";
  private webSocket: any;
  public chatMessages = [];
  public curUser = localStorage.getItem("liu");
  constructor(
    private userAcc: UserAccountService,
    private wsService: ChatService
  ) { }

  getAllNotifications(){
    this.allNotification = +Object.values(this.chatNotifications).reduce((prev:number,ele)=>
      prev + +(!!ele)
    , 0)
  }
  checkMAR(){
    if(this.chatNotifications[this.currentThread]){
      this.wsService.markRead(this.webSocket);
      this.chatNotifications[this.currentThread] = 0;
      this.allNotification -= 1;
    }
  }

  initChat(threadName:string){
    this.webSocket = this.wsService.connect(threadName);
    this.webSocket.subscribe(
      message => {
        if(message.type === "fetch_messages")
        this.chatMessages = message.data
        else if(message.type === "receive_message")
        this.chatMessages.push(message.data)
        else if(message.type === "fetch_groups")
        this.allThreads = message.data;
        else if(message.type === "create_group" && message.ok){
          this.allThreads.push(message.data)
          this.chatWith = true;
        }
      },
      error => {
        console.log(error);
        this.chatMessages = [];
      },
      () => {
        console.log("Disconnected");
      }
    );
    this.wsService.fetchMessages(this.webSocket);
  }

  get_notifications(){
    this.wsService.notifications.subscribe(
      message => {
        if(message.type === "fetch_notifications"){
          this.chatNotifications = message.data;
        }
        else if(message.type === "new_notification"){
          if(message.data.user_from !== this.curUser){
            if(this.chatNotifications[message.data.thread_id])
            this.chatNotifications[message.data.thread_id] += 1;
            else
            this.chatNotifications[message.data.thread_id] = 1
          }
        }
        this.getAllNotifications();
      },
      error => {
        console.log(error);
        this.chatMessages = [];
      },
      () => {
        console.log("Disconnected");
      }
    )
  }

  ngOnInit(): void {
    this.userAcc.getAllUser().subscribe(data=>{
      this.allUsers = data;
    });
    this.get_notifications();
    this.initChat(this.threadName);
    this.wsService.fetchGroups(this.webSocket);
  }
  ngOnDestroy(): void{
    this.webSocket.unsubscribe();
  }
  ngAfterViewInit(): void{
    this.chatItem.changes.subscribe(_=>{
      this.chatContent.nativeElement.scroll({
        top: this.chatContent.nativeElement.scrollHeight,
        left: 0,
        behavior: "smooth"
      })
    })
  }

  viewChat(){
    this.openChat = !this.openChat;
    if(this.openChat){
      this.checkMAR();
    }
  }

  sendMessage(event){
    const inputTag = event.target[0];
    if(!inputTag.value) return;
    this.wsService.sendMessage(this.webSocket, inputTag.value, this.currentThread);
    inputTag.value = "";
  }

  createGroup(event){
    const groupName = event.target[0].value;
    const selectedUsers = this.allUsers.filter(user=>user.selected===true)
                          .map(user=>user.id)
    
    if(!groupName || !selectedUsers.length){
      this.groupError = "Invalid Group Details";
      return;
    }
    const data = {
      groupName,
      users: [this.curUser, ...selectedUsers]
    };
    this.groupError = "";
    this.wsService.createGroup(this.webSocket, data);
    this.chatViewPage = 0;
  }

  changeChat(thread){
    this.currChat = thread.displayname;
    const newThreadName = thread.id==="0" ? thread.displayname : [this.curUser, thread.id].sort().join("_");
    if(newThreadName != this.threadName){
      this.webSocket.unsubscribe();
      this.initChat((thread.id === "0" && newThreadName !== "Global" ? "room_" : "") +newThreadName);
      this.currentThread = thread.thread_id;
      this.threadName = newThreadName;
      this.checkMAR();
    }
    this.chatWith = false;
  }
  selectMember(user){
    if(this.chatViewPage===1){
      const thread = {
        id: user.id,
        displayname: user.username
      }
      this.changeChat(thread);
      this.chatViewPage = 0;
    } else if(this.chatViewPage===2){
      user.selected = !user.selected;
    }
  }
}
