"use client";

import { useSession } from "next-auth/react";
import CheckSquare from "@/app/components/Icons/Check-square";
import XSquare from "@/app/components/Icons/Xsquare";
import { useEffect, useState } from "react";
import Hero from "./_components/Hero/page";
import { userFullPayload } from "@/utils/relationsip";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import banner from "@/../public/img/imageHome1.png";
import { FormButton } from "../components/utils/Button";
import { fetcher } from "@/utils/server-action/Fetcher";
import useSWR from "swr";


export default function User(props: any) {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<userFullPayload | null>(null);
  const [taskAuths, setTaskAuths] = useState<{ [key: string]: { userAuthTask: boolean; teacherAuth: boolean } }>({});
  const { data, error } = useSWR(`/api/teacher`, fetcher, {
    refreshInterval: 1000,
  });
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
  let ListTeacher;
  if(data){
    const {user}=data;
    ListTeacher=user.filter((user:userFullPayload)=>user.role==="GURU")
  }
  if (status === "loading") return "Loading...";
  return (
    <>
    {status==="unauthenticated"?
    <div className="bg-[#EDE5E5]">
    <div className="mt-[100px] p-5 max-w m-10 flex flex-row justify-center">
      <div className="lg:w-1/2 w-full">
        <h1 className="font-bold text-3xl">SKL</h1>
        <p className="mt-0 mb-5 font-extralight">Syarat Ketentuan Lulus</p>
        <p className="lg:font-medium font-normal lg:text-base text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. At, maiores. Facere animi numquam ad itaque, 
          sint excepturi sequi. Quo vitae veniam vero eaque. Recusandae optio totam quas dolorem soluta repellendus.
          Eius, molestias quae? Soluta veniam, fugiat suscipit cum cupiditate obcaecati.
           Ut dignissimos vitae quidem reprehenderit voluptate asperiores cum quam ex iure aperiam.</p>
      </div>
      <div className="flex w-1/2 justify-center items-center flex-col">
      <Image src={banner} alt="banner" className="lg:w-2/4 w-full h-fit" />
      <FormButton variant="base" type="button" className="hover:bg-moklet hover:text-white m-3" onClick={()=>{router.push("/signin")}}>
        Get Started
      </FormButton>
      </div>
    </div>
    <div className="p-5 w-full flex flex-col flex-wrap justify-center h-[30rem] bg-highlight-2  overflow-auto">
      <h1 className="font-bold text-xl m-10 text-white">Guru Yang Terdaftar</h1>
      <div className="flex flex-row">
      {ListTeacher ? (ListTeacher.map((user:userFullPayload, i:React.Key)=>(
        <>
        <div className=" flex items-center bg-white p-3 rounded-lg m-10 w-[12rem] h-[3rem] md:w-[20rem] md:h-[8rem]" key={i}>
        <Image src={user.photo_profile as string} alt="photo guru" width={100} height={100} className="m-3 w-1/4 rounded-full" />
        <p className="font-normal md:font-semibold text-[0.6rem] md:text-lg">{user.name}</p>
        </div>
        </>
      ))): <div>Loading ...</div>}
      </div>
    </div>
    </div>:
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
        <div className="bg-moklet lg:w-[40rem] rounded-xl p-3 m-5">
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
  }
    </>
  );
}
