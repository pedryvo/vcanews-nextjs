import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message, captchaToken } = body;

    if (!captchaToken) {
      return NextResponse.json({ error: "CAPTCHA obrigatório." }, { status: 400 });
    }

    // Verificar Turnstile
    // Verificar Turnstile via API Siteverify
    const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: `secret=${encodeURIComponent(process.env.TURNSTILE_SECRET_KEY!)}&response=${encodeURIComponent(captchaToken)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const verifyData = await verifyRes.json();
    if (!verifyData.success) {
      return NextResponse.json({ error: "Falha na verificação do CAPTCHA." }, { status: 400 });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    // Capturar metadados do solicitante
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "Unknown";
    const userAgent = req.headers.get("user-agent") || "Unknown";
    
    const city = req.headers.get("x-vercel-ip-city");
    const country = req.headers.get("x-vercel-ip-country");
    const region = req.headers.get("x-vercel-ip-country-region");
    
    let location = "Localização desconhecida";
    if (city && country) {
      location = `${city}, ${region ? region + ", " : ""}${country}`;
    }

    const newMessage = await (prisma as any).contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
        ip,
        userAgent,
        location,
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("[CONTACT_API_POST]", error);
    return NextResponse.json(
      { error: "Erro ao enviar mensagem. Tente novamente mais tarde." },
      { status: 500 }
    );
  }
}
