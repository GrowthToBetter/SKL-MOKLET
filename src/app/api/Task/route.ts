import { findTaskList } from "@/utils/user.query";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
  
    try {
      const task = await findTaskList({});
      if (!task) {
        return new NextResponse(JSON.stringify({ error: "task not found" }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
  
      return new NextResponse(JSON.stringify({ task }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error fetching task data:", error);
      return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }