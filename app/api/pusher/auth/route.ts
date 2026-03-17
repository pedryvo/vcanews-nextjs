import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    
    if (!(session as any)?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.formData();
    const socketId = body.get("socket_id") as string;
    const channel = body.get("channel_name") as string;
    
    const presenceData = {
      user_id: (session as any).user.id,
      user_info: {
        name: (session as any).user.name,
        image: (session as any).user.image,
      },
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, presenceData);
    
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher Auth Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
