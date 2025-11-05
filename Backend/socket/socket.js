import {Server} from 'socket.io';
import express from 'express';
import http from 'http';
const app = express();

const server = http.createServer(app);
 
const io = new Server(server , {
     cors : {
        origin : 'https://instagram-ajpd.onrender.com',
        methods : ['GET','POST']
     }
} );

const userSocketMap = {}; 

export const getRecieverSocketId = (recieverId)=> userSocketMap[recieverId];

io.on('connection',(socket)=>{
    
    const userId = socket?.handshake?.query?.userId;
    
    if(userId)
     {
       userSocketMap[userId] = socket.id;
      //  console.log(`User Connected : UserId = ${userId} , SocketId = ${socket.id}`); 
     } 
    else
     {
      console.error('User ID is missing in handshake query');
      return;
     }    
     
    io.emit('getOnlineUsers',Object.keys(userSocketMap));   
    
    socket.on('sendMessage', (data) => {
    const { receiverId, message } = data;
    const receiverSocketId = getRecieverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', { senderId: userId, message });
     }
    });
    
    socket.on('disconnect',()=>{
        if(userId)
         {
            delete userSocketMap[userId];
            // console.log(`User Connected : UserId = ${userId} , SocketId = ${socket.id}`); 
         }
        io.emit('getOnlineUsers',Object.keys(userSocketMap));   
    }); 
    
    socket.on('reconnect', () => {
    console.log(`User Reconnected: UserId = ${userId}, SocketId = ${socket.id}`);
     });
    
});

export {app,server,io};