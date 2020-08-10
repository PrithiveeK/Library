import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  template: `<div class="chat-item" [class]="message.user_from.id===curUser ? 'sent' : 'received'">
                <small *ngIf="message.user_from.id!==curUser"
                [style.color]="'#'+message.user_from.id.substr(-6)">
                    {{message.user_from.username}}
                </small>
                <p>{{message.message}}</p>
                <small class="chat-time">{{getTime(message.time_sent)}}</small>
            </div>`,
  styles: [`
            .chat-item{
                margin: 2px 0;
                width: max-content;
                padding: 2px 5px;
                border-radius: 4px;
            }

            .sent{
                background-color: whitesmoke;
                align-self: flex-end;
                text-align: end;
            }
            .received{
                background-color: #e3864559;
                align-self: flex-start;
            }
            .chat-time{
                color: #777;
                text-align: right;
                display: block;
            }  
          `]
})
export class ChatMessageComponent implements OnInit {
  @Input() public message;
  public curUser = localStorage.getItem("liu");
  constructor() { }

  ngOnInit(): void {
  }

  getTime(date){
    return new Date(date).toLocaleString().substr(0,17);
  }

}
