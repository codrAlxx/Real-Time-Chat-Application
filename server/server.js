import express from "express"

import http from "http"

import databaseConnect from "./config/database.js"
import authRouter from "./routes/authRoute.js"
import uploadRouter from "./routes/uploadRoutes.js"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import messengerRouter from "./routes/messengerRoute.js"

import { createServer } from "http";
import { Server } from "socket.io";


const app = express();

app.use(cors({
     origin: '*'
 }));
const server = http.createServer(app); // Add this

app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/messenger',authRouter);
app.use('/api/messenger',messengerRouter);
app.use('/api/upload',uploadRouter);

const PORT = 5050


const httpServer = createServer();
const io = new Server(httpServer, {
     cors : {
          origin : '*',
          methods : ['GET','POST']
     }
});




// const io = require('socket.io')(8000,{
//      cors : {
//           origin : '*',
//           methods : ['GET','POST']
//      }
// })
 
let users = [];
const addUser = (userId,socketId,userInfo) => {
     const checkUser = users.some(u=> u.userId === userId );

     if(!checkUser){
          users.push({userId,socketId,userInfo});
     }
}
const userRemove = (socketId) => {
     users = users.filter(u=>u.socketId !== socketId );
}

const findFriend = (id) => {
     return users.find(u=>u.userId === id);
}

const userLogout = (userId) => {
     users = users.filter(u=>u.userId !== userId)
}


io.on('connection',(socket)=>{
     console.log('Socket is connecting...')
     socket.on('addUser',(userId,userInfo)=>{
          addUser(userId,socket.id,userInfo);
          io.emit('getUser',users);

     const us = users.filter(u=>u.userId !== userId);
     const con = 'new_user_add';
     for(var i = 0; i <us.length; i++ ){
          socket.to(us[i].socketId).emit('new_user_add',con);
     }




     });
     socket.on('sendMessage',(data)=>{
          const user = findFriend(data.reseverId);
          
          if(user !== undefined){
               socket.to(user.socketId).emit('getMessage', data)
          }          
     })

     socket.on('messageSeen',msg =>{
          const user = findFriend(msg.senderId);          
          if(user !== undefined){
               socket.to(user.socketId).emit('msgSeenResponse', msg)
          }          
     })

     socket.on('delivaredMessage',msg =>{
          const user = findFriend(msg.senderId);          
          if(user !== undefined){
               socket.to(user.socketId).emit('msgDelivaredResponse', msg)
          }          
     })
     socket.on('seen',data =>{
          const user = findFriend(data.senderId);          
          if(user !== undefined){
               socket.to(user.socketId).emit('seenSuccess', data)
          } 
     })


     socket.on('typingMessage',(data)=>{
          const user = findFriend(data.reseverId);
          if(user !== undefined){
               socket.to(user.socketId).emit('typingMessageGet',{
                    senderId : data.senderId,                   
                    reseverId :  data.reseverId,
                    msg : data.msg                    
                     
               })
          }
     })

     socket.on('logout',userId => {
          userLogout(userId);
     })


     socket.on('disconnect',() =>{
          console.log('user is disconnect... ');
          userRemove(socket.id);
          io.emit('getUser',users);
     })
})




app.get('/', (req, res)=>{
     console.log(process.env.PORT)
     res.send('This is from backend Sever')
})


httpServer.listen(8000);
databaseConnect();

app.listen(PORT, ()=>{
     console.log(`Server is running on port ${PORT}`)
})