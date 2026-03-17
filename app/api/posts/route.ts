import { NextRequest, NextResponse } from "next/server";
import { blogPostRepository } from "@/repositories/blog-post-repository";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const skip = parseInt(searchParams.get("skip") || "0");
  const take = parseInt(searchParams.get("take") || "12");

  try {
    const posts = await blogPostRepository.getPaged(take, skip);
    return NextResponse.json(posts);
  } catch (error) {
    console.error("API Error fetching posts:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
