"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInitializer = async () => {
      await fetch("/api/socket");

      const socketInstance = io();

      socketInstance.on("connect", () => {
        console.log("Connected to websocket");
        if ((session?.user as any)?.id) {
          socketInstance.emit("join-user", (session.user as any).id);
        }
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    };

    socketInitializer();
  }, [session]);

  return socket;
};
