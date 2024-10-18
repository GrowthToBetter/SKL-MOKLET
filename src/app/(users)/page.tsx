import { nextGetServerSession } from "@/lib/authOption";
import { userFullPayload } from "@/utils/relationsip";
import { redirect } from "next/navigation";
import Home from "./_components/Home";
import prisma from "@/lib/prisma";

export default async function page() {
  const session = await nextGetServerSession();
  const userData = await prisma.user.findFirst({
    where: {
      id: session?.user?.id,
    },
    include: {
      TaskUser: { include: { user: true, task: true, DetailTask: true } },
      Student: true,
      TaskTeacher: { include: { DetailTask: true, task: true, user: true } },
      Teacher: true,
      userAuth: { select: { last_login: true } },
    },
  });
  if (userData) {
    if (session?.user?.email && !userData.title && userData.role === "SISWA")
      return redirect("/pilihRole");
  }
  return <Home userData={userData as userFullPayload} />;
}
