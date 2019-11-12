'use strict';
const {Contract} = require('fabric-contract-api');

class Chat extends Contract {

    async register(ctx,userId,key,name,email,bio) {
       
        let userAsBytes = await ctx.stub.getState(userId);
       
       if (!userAsBytes || userAsBytes.toString().length <= 0) {

          let userData={
              UserId:userId,
              Name:name,
              Email:email,
              About:bio,
              SentMessages:[],
              ReceivedMessages:[],
              Friends:[],
              AccessKey:key
              };

      await ctx.stub.putState(userId, Buffer.from(JSON.stringify(userData)));
      return('User Registration Successful..');
         }

       else {
      return('Username is already taken.!');
        }
   }
  
  async sendMessage(ctx,userId,key,recipient,message) {
       
        let userAsBytes = await ctx.stub.getState(userId);
        let recipientAsBytes = await ctx.stub.getState(recipient);
     if (!userAsBytes || userAsBytes.toString().length <= 0) {

       return('Error:Incorrect UserId..!');
        }
     let user=JSON.parse(userAsBytes);
     if (user.AccessKey!=key) {
        return('Error:Incorrect AccessKey..!');
          
          }
     if (!recipientAsBytes || recipientAsBytes.toString().length <= 0) {
         
       return('Error:Incorrect RecipientId..!');
         }

     else {
         
      let Recipient=JSON.parse(recipientAsBytes);
      let timeStamp= await ctx.stub.getTxTimestamp();
      const timestamp = new Date(timeStamp.getSeconds() * 1000).toISOString();
        let messageData={ 
            Message:message,
            Time:timestamp,
            From:userId,
            To:recipient
            };

        user.SentMessages.push(messageData);
        Recipient.ReceivedMessages.push(messageData);
        await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));
        await ctx.stub.putState(recipient, Buffer.from(JSON.stringify(Recipient)));
        return('Message Sent.');
        }


     }

     async inbox(ctx,userId,key) {
       
        let userAsBytes = await ctx.stub.getState(userId);
     if (!userAsBytes || userAsBytes.toString().length <= 0) {

       return('Error:Incorrect UserId..!');
          }
     
     let user=JSON.parse(userAsBytes);
     if (user.AccessKey!=key) {
        return('Error:Incorrect AccessKey..!');
          
          }
      else {
      
      let inbox= user.ReceivedMessages;
      let inboxMessages=JSON.stringify(inbox);

      return inboxMessages;
       }
    }
async outbox(ctx,userId,key) {
       
        let userAsBytes = await ctx.stub.getState(userId);
     if (!userAsBytes || userAsBytes.toString().length <= 0) {

       return('Error:Incorrect UserId..!');
          }
     
     let user=JSON.parse(userAsBytes);
     if (user.AccessKey!=key) {
        return('Error:Incorrect AccessKey..!');
          
          }

     else {
      
      let outbox= user.SentMessages;
      let outboxMessages=JSON.stringify(outbox);

      return outboxMessages;
       }
    }

    async addFriend(ctx,userId,key,friendUserId) {
       
        let userAsBytes = await ctx.stub.getState(userId);
        let friendAsBytes = await ctx.stub.getState(friendUserId);
     if (!userAsBytes || userAsBytes.toString().length <= 0) {

       return('Error:Incorrect UserId..!');
          }
      let user=JSON.parse(userAsBytes);
 	 if (user.AccessKey!=key) {
        return('Error:Incorrect AccessKey..!');
         }

    if (!friendAsBytes || friendAsBytes.toString().length <= 0) {

       return('Error:No User found with this Id!');
          }

     else {
      
      user.Friends.push(friendUserId);
      await ctx.stub.putState(userId, Buffer.from(JSON.stringify(user)));
      return('Friend Added to List.');
       }
    }

   async myFriends(ctx,userId,key) {
       
        let userAsBytes = await ctx.stub.getState(userId);
     if (!userAsBytes || userAsBytes.toString().length <= 0) {

       return('Error:Incorrect UserId..!');
          }
     
     let user=JSON.parse(userAsBytes);
 	if (user.AccessKey!=key) {
        return('Error:Incorrect AccessKey..!');
           }
     else {
      
      let friends= JSON.stringify(user.Friends);
      return friends;
       }
    }

 }

 module.exports = Chat;
