import prisma from "../../lib/prisma";
import { CheckCondition, findAllUsers } from "@/utils/user.query";
import Hero from "./Components/Hero/page";
import { Prisma } from "@prisma/client";
import { nextGetServerSession } from "@/lib/authOption";
export default async function Home() {
  const session = await nextGetServerSession();
  const datas = await findAllUsers({
    role:"GURU"
  });

  return (
    <>
      <Hero datas={datas} />
    </>
  );
}
