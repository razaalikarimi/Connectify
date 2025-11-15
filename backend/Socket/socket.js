import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:['https://snaptalk-8lkt.onrender.com', 'http://localhost:5173', 'http://localhost:3000'],
        methods:["GET","POST"]
    }
});

export const getReciverSocketId = (receverId)=>{
    return userSocketmap[receverId];
};

const userSocketmap={}; //{userId,socketId}
io.on('connection',(socket)=>{
    const userId = socket.handshake.query.userId;

    if(userId !== "undefined" && userId) userSocketmap[userId] = socket.id;
    io.emit("getOnlineUsers",Object.keys(userSocketmap))

    socket.on('disconnect',()=>{
        delete userSocketmap[userId],
        io.emit('getOnlineUsers',Object.keys(userSocketmap))
    });
});

export { app, io, server };
