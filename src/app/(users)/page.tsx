"use client";

import { useSession } from "next-auth/react";
import CheckSquare from "@/app/components/Icons/Check-square";
import XSquare from "@/app/components/Icons/Xsquare";
import {
  useEffect,
  useState,
} from "react";
import Hero from "./Components/Hero/page";
import { teacherFullPayload, userFullPayload } from "@/utils/relationsip";

export default function User(props: any) {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<userFullPayload | null>(null);
  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          const response = await fetch(`/api/user?userId=${session.user?.id}`);
          if (response.ok) {
            const { user } = await response.json();
            setUserData(user);
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
  const tempVerif= userData?.TaskUser.filter((x)=>(x.status=="VERIFIED"))
  const tempDontVerif= userData?.TaskUser.filter((x)=>(x.status=="PENDING"))
  let verif=0;
  let dontVerif=0;
  if (tempVerif && userData?.TaskUser) {
    verif = (tempVerif.length / userData.TaskUser.length) * 100;
  } 
  if (tempDontVerif && userData?.TaskUser) {
    dontVerif = (tempDontVerif.length / userData.TaskUser.length) * 100;
  } 

  return (
    <>
      <div className="mt-[100px] p-5 max-w m-10 flex justify-center flex-col">
        <h1 className="font-semibold text-xl text-highlight p-3">
          Welcome back, {session?.user ? session?.user?.name : "user"}!
        </h1>
        {userData?.role=="SISWA"?
        (<div className="bg-moklet lg:w-[40rem] rounded-xl p-3 m-5">
          <h1 className="font-semibold text-lg m-3 text-white">
            Keterangan yang sudah dikonfirmasi oleh guru pengajar
          </h1>
          <div className="bg-white border-2 border-highlight rounded-md p-5">
            <div className="flex items-center">
              <CheckSquare />
              <h1 className="m-3"> Terverifikasi oleh guru pengajar : <span className="font-bold text-xl">{verif}%</span></h1>
            </div>
            <div className="flex items-center">
              <XSquare />
              <h1 className="m-3">Belum Terverifikasi oleh guru pengajar : <span className="font-bold text-xl">{dontVerif}%</span></h1>
            </div>
          </div>
        </div>):
        ""
      }
        <div className="bg-moklet lg:w-full rounded-xl p-3 m-5">
          <h1 className="font-bold text-lg m-3 text-white">
            Evaluasi Kompetensi
          </h1>
          <div className="bg-white border-2 flex w-full border-highlight rounded-md p-5">
            {userData?.role=="SISWA"? userData.Teacher.map((id, i)=>(<Hero userData={id} key={i}/>)) : userData?.role=="GURU"?  userData.Student.map((id, i)=>(<Hero userData={id} key={i}/>)) : <h1 className="text-moklet"> Loading...</h1>}
          </div>
        </div>
      </div>
    </>
  );
}
