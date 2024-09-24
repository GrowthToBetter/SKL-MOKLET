"use client";

import { useSession } from "next-auth/react";
import CheckSquare from "@/app/components/Icons/Check-square";
import XSquare from "@/app/components/Icons/Xsquare";
import { useEffect, useState } from "react";
import Hero from "./_components/Hero/page";
import { userFullPayload } from "@/utils/relationsip";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";

export default function User(props: any) {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<userFullPayload | null>(null);
  const [taskAuths, setTaskAuths] = useState<{ [key: string]: { userAuthTask: boolean; teacherAuth: boolean } }>({});
  const router= useRouter();
  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          const response = await fetch(`/api/user?userId=${session.user?.id}`);
          if (response.ok) {
            const { user } = await response.json();
            setUserData(user);
            const initialTaskAuths = Object.fromEntries(
              user.TaskUser.map((task: any) => [
                task.id,
                { userAuthTask: task.userAuthTask, teacherAuth: task.teacherAuth }
              ])
            );
            setTaskAuths(initialTaskAuths);
          } else {
            throw new Error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [session]);
  
  const filteredTask=userData?.TaskUser.filter((x)=>x.userId==session?.user?.id)
  const tempVerif = filteredTask?.filter((x) => x.status == "VERIFIED");
  const tempDontVerif = filteredTask?.filter((x) => x.status == "PENDING");
  let verif = 0;
  let dontVerif = 0;
  if (tempVerif && userData?.TaskUser) {
    verif = (tempVerif.length / userData.TaskUser.length) * 100;
  }
  if (tempDontVerif && userData?.TaskUser) {
    dontVerif = (tempDontVerif.length / userData.TaskUser.length) * 100;
  }
  if (status === "unauthenticated") return router.push("/signin");

  if (status === "loading") return "Loading...";
  return (
    <>
      <div className="mt-[100px] p-5 max-w m-10 flex justify-center flex-col">
        <h1 className="font-semibold text-xl text-highlight p-3">
          Welcome back, {session?.user ? session?.user?.name : "user"}!
        </h1>
        {userData?.role == "SISWA" ? (
          <div className="bg-moklet lg:w-[40rem] rounded-xl p-3 m-5">
            <h1 className="font-semibold text-lg m-3 text-white">
              Keterangan yang sudah dikonfirmasi oleh guru pengajar
            </h1>
            <div className="bg-white border-2 border-highlight rounded-md p-5">
              <div className="flex items-center">
                <CheckSquare />
                <h1 className="m-3">
                  {" "}
                  Terverifikasi oleh guru pengajar :{" "}
                  <span className="font-bold text-xl">{verif ? verif : 0}%</span>
                </h1>
              </div>
              <div className="flex items-center">
                <XSquare />
                <h1 className="m-3">
                  Belum Terverifikasi oleh guru pengajar :{" "}
                  <span className="font-bold text-xl">{dontVerif? dontVerif: 0}%</span>
                </h1>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="bg-moklet lg:w-full rounded-xl p-3 m-5">
          <h1 className="font-bold text-lg m-3 text-white">
            Evaluasi Kompetensi
          </h1>
          <div className="bg-white border-2 flex w-full border-highlight rounded-md p-5">
            {userData?.role == "SISWA" ? (
              <Hero userData={userData.Teacher} />
            ) : userData?.role == "GURU" ? (
              userData.Student.map((id, i) => <Hero userData={id} key={i} />)
            ) : (
              <h1 className="text-moklet"> Loading...</h1>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
