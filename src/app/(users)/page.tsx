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
  const [teacherData, setTeacherData] = useState<teacherFullPayload | null>(null);
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
  return (
    <>
      <div className="mt-[100px] p-5 max-w m-10 flex justify-center flex-col">
        <h1 className="font-semibold text-xl text-highlight p-3">
          Welcome back, {session?.user ? session?.user?.name : "user"}!
        </h1>
        <div className="bg-moklet lg:w-[40rem] rounded-xl p-3 m-5">
          <h1 className="font-semibold text-lg m-3 text-white">
            Keterangan yang sudah dikonfirmasi oleh guru pengajar
          </h1>
          <div className="bg-white border-2 border-highlight rounded-md p-5">
            <div className="flex items-center">
              <CheckSquare />
              <h1 className="m-3"> Terverifikasi oleh guru pengajar : </h1>
            </div>
            <div className="flex items-center">
              <XSquare />
              <h1 className="m-3">Belum Terverifikasi oleh guru pengajar : </h1>
            </div>
          </div>
        </div>
        <div className="bg-moklet lg:w-[40rem] rounded-xl p-3 m-5">
          <h1 className="font-bold text-lg m-3 text-white">
            Evaluasi Kompetensi
          </h1>
          <div className="bg-white border-2 border-highlight rounded-md p-5">
           {userData ? <Hero userData={userData}/> : <h1 className="text-moklet"> Loading...</h1>} 
          </div>
        </div>
      </div>
    </>
  );
}
