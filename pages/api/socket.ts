import { NextApiRequest, NextApiResponse } from "next";
import { Server as SocketServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { Socket as NetSocket } from "net";

interface SocketServerConfigs extends HTTPServer {
  io?: SocketServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServerConfigs;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export default function SocketHandler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new SocketServer(res.socket.server);
    res.socket.server.io = io;
    
    // Tornar o io acessível globalmente para as rotas do App Router
    (global as any).io = io;

    io.on("connection", (socket) => {
      socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User joined dynamic room: ${roomId}`);
      });

      socket.on("join-user", (userId) => {
        socket.join(`user-${userId}`);
        console.log(`User ${userId} joined their private notification room`);
      });

      socket.on("update-conversation-status", (data) => {
        // Notifica todos na sala da conversa (incluindo o outro usuário)
        io.to(data.conversationId).emit("conversation-status-updated", data);
      });
    });
  }
  res.end();
}
