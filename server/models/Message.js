import moment from 'moment';
import user from '../models/User';
import InboxMod from './Inbox';
const Inbox = new InboxMod();
import Sent from './Sent';
class Message {
   constructor(){
    this.data ={"type":"dataList"}
    this.MessagesList = [ 
        {
            "id": 2,
            "createdOn": "2019-03-04T05:44:00.494Z",
            "subject": "Invitation to mariage",
            "senderId":1,
            "receiverId":6,
            "message": "Hello guys, we would to invite you to our mariage celemony which will take place at kacyiro suday pack 11:00 am, Thank you!",
            "parentMessageId": "1",
            "status": "sent"
        },  {
            "id": 1,
            "createdOn": "2019-03-04T05:44:00.494Z",
            "subject": "Invitation to mariage",
            "senderId":3,
            "receiverId":6,
            "message": "Hello guys, we would to invite you to our mariage celemony which will take place at kacyiro suday pack 11:00 am, Thank you!",
            "parentMessageId": "1",
            "status": "sent"
        },  {
            "id": 3,
            "createdOn": "2019-03-04T05:44:00.494Z",
            "subject": "Invitation to mariage",
            "senderId":2,
            "receiverId":6,
            "message": "Hello guys, we would to invite you to our mariage celemony which will take place at kacyiro suday pack 11:00 am, Thank you!",
            "parentMessageId": "1",
            "status": "sent"
        },  {
            "id": 4,
            "createdOn": "2019-03-04T05:44:00.494Z",
            "subject": "Invitation to mariage",
            "senderId":2,
            "receiverId":3,
            "message": "Hello guys, we would to invite you to our mariage celemony which will take place at kacyiro suday pack 11:00 am, Thank you!",
            "parentMessageId": "1",
            "status": "draft"
        },  {
            "id": 5,
            "createdOn": "2019-03-04T05:44:00.494Z",
            "subject": "Invitation to mariage",
            "senderId":3,
            "receiverId":6,
            "message": "Hello guys, we would to invite you to our mariage celemony which will take place at kacyiro suday pack 11:00 am, Thank you!",
            "parentMessageId": "1",
            "status": "read"
        },   {
            "id": 6,
            "createdOn": "2019-03-04T05:44:00.494Z",
            "subject": "Invitation to mariage",
            "senderId":1,
            "receiverId":6,
            "message": "Hello guys, we would to invite you to our mariage celemony which will take place at kacyiro suday pack 11:00 am, Thank you!",
            "parentMessageId": "1",
            "status": "read"
        }
    ];
   }  
   async addMessage(myEmail,message){
    if(!message){
        return false;
    }else{
        if(message.status == 'sent'){
            let sent = {senderId:myEmail,messageId:message.id,createdOn:moment(new Date())}
             Sent.addSent(sent);
            let inbox = {receiverId:message.receiverId,messageId:message.id,createdOn:moment(new Date())}
             Inbox.addInbox(inbox);
         }
         this.MessagesList.push(message); 
         return  true;
    }
   }
   async getAllReceivedEmails(myUsername){
     // Fetch all Inbox Messages which their receiverId is equal to my UserId 
     // (1) get UserId by username which is user email 'myUsername'
     // (2) Go in Inbox and search where message.receiverId === userId
     // (3) then use Inbox messageId to search and get message details from all messages 
     let userId = await user.getUserIdByEmail(myUsername);
     let received_messages=[];  
     if(!userId){
         return received_messages;
     }else
     {     
        Inbox.getAllInbox().then((inbox) => {
            inbox.forEach((message) => {
               if(message.receiverId == userId){
                let mail_message = this.MessagesList.find((m_message) => m_message.id ==  message.messageId);
                     const f_message = {
                       id : mail_message.id,
                       createdOn : mail_message.createdOn,
                       subject : mail_message.subject,
                       message : mail_message.message,
                       senderId: mail_message.senderId,
                       receiverId: mail_message.receiverId,
                       parentMessageId : mail_message.parentMessageId,
                       status : mail_message.status
                   }
                   received_messages.push(f_message);
                   
                }
            })
      
        });
        return received_messages;
     }
    
   }
   async geAlltUnReadReceivedMessages(myUsername){
     // Fetch all Inbox Messages which their receiverId is equal to my UserId and status is still sent not read
     // (1) get UserId by username which is user email 'myUsername'
     // (2) Go in Inbox and search where message.receiverId === userId
     // (3) then use Inbox messageId to search and get details of messages which their status is still sent not read, from all messages
        let userId = await user.getUserIdByEmail(myUsername);
        let unread_received_messages=[];  
        if(!userId){
            return [];
        }else{ 
        Inbox.getAllInbox().then((inbox) => {
            inbox.forEach((message) => {
               if(message.receiverId == userId){
                    let mail_message = this.MessagesList.find((mail_message) => mail_message.id == message.messageId);
                    if(mail_message.status == 'sent'){
                        const f_message = {
                            id : mail_message.id,
                            createdOn : mail_message.createdOn,
                            subject : mail_message.subject,
                            message : mail_message.message,
                            senderId: mail_message.senderId,
                            receiverId: mail_message.receiverId,
                            parentMessageId : mail_message.parentMessageId,
                            status : mail_message.status
                        }
                        unread_received_messages.push(f_message);
                    }

                }
            })
      
        });

     return unread_received_messages;
    }
   }
   async getAllSentMessages(myUsername){
     // Fetch all Sent Messages which their senderId is equal to my UserId 
     // (1) get UserId by username which is user email 'myUsername'
     // (2) Go in Sent and search where message.senderId === userId
     // (3) then use Sent messageId to search and get details of messages from all messages
       
      let userId = await user.getUserIdByEmail(myUsername);
      let sent_message =[];

      if(!userId){
          return [];
      }else{
        Sent.getSentList().then((sent) => {
            sent.forEach((sentMessage) => {
                if (sentMessage.senderId == userId){
                  let mail_message = this.MessagesList.find((message) => message.id == sentMessage.messageId);
                  if(!mail_message){
                      return sent_message;
                  }else{
                    if(mail_message.status == 'sent'){                
                        const f_message = {
                            id : mail_message.id,
                            createdOn : mail_message.createdOn,
                            subject : mail_message.subject,
                            message : mail_message.message,
                            senderId: mail_message.senderId,
                            receiverId: mail_message.receiverId,
                            parentMessageId : mail_message.parentMessageId,
                            status : mail_message.status
                        }
                        sent_message.push(f_message);
                    }
                  }
                }
            });
          });
          return sent_message;
      }
   }
   async getMessage(myUsername,id){
    //Before send the requested message to the user
    //We have to detemine whether user is the sender 
    //Or receiver of the message
    let userId = await user.getUserIdByEmail(myUsername);  
    if(!userId){
        return [];
    }else{
        const msg = this.MessagesList.find((message) => message.id == id );
        if(!msg){
            //If Message not found, we going to return 
            //underfined object 
            return msg;
        }else if(msg.id != 'underfined'){
            //If Message found, we going to chech if user is sender 
            //or receiver of the message
            if(msg.senderId == userId || msg.receiverId == userId){
                //If user is sender or receiver 
                //Then send message
                return msg;
            }
            else{
                //If user is not sender or receiver 
                //then retun 0
                return 0;
            }
        } 
    }
   }
   async deleteMessage(myUsername,id){
    //Before selete message
    //We have to detemine whether user is the sender 
    //Or receiver of the message
        let userId = await user.getUserIdByEmail(myUsername);   
        const msg = this.MessagesList.find((message) => message.id == id);
        
        if(msg.senderId == userId || msg.receiverId == userId){
            //If user is sender or receiver 
            //Then delete themessage
            let messages = this.MessagesList.filter(message => message.id != id);
            this.MessagesList = '',
            this.MessagesList = messages;
            return true;
        }else{
            //otherwise return false  
           return false;
        }

     
   }
}
export default new Message();