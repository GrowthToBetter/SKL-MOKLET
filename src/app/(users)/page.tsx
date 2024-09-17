"use client";

import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  return (
    <>
    <div className="mt-[100px] p-5 max-w-max m-10">
      <h1 className="font-semibold text-xl text-highlight">Hello, {session?.user?.name}</h1>
      <div className="bg-moklet w-full rounded-xl ">
      </div>
    </div>
    </>
  );
}
