"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher-client";

export const useSocket = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      const channelName = `user-${session.user.id}`;
      pusherClient.subscribe(channelName);

      return () => {
        pusherClient.unsubscribe(channelName);
      };
    }
  }, [session]);

  return pusherClient;
};
