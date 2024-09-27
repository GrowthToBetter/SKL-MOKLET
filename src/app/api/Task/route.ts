// src/pages/api/user.ts

import { deleteUser, findAllTask, findAllUsers, findUser } from "@/utils/user.query";
import { NextResponse } from "next/server";



export async function GET(req: Request) {
  const url = new URL(req.url);
  const user = await findAllTask({});
  if (!user) {
    return new NextResponse(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new NextResponse(JSON.stringify({ user }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });

}
