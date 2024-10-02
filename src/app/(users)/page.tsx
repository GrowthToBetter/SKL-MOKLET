"use client";

import { Archivo_Black } from "next/font/google";
const archivo_black = Archivo_Black({ weight: "400", subsets: ["latin"] });


import { signIn, useSession } from "next-auth/react";
import CheckSquare from "@/app/components/Icons/Check-square";
import XSquare from "@/app/components/Icons/Xsquare";
import { useEffect, useState } from "react";
import Hero from "./_components/Hero/page";
import gambar1 from "@/../public/img/Gambar.png";
import { userFullPayload } from "@/utils/relationsip";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import banner from "@/../public/img/imageHome1.png";
import { FormButton } from "../components/utils/Button";
import { fetcher } from "@/utils/server-action/Fetcher";
import useSWR from "swr";
import Footer from "../components/utils/Footer";

export default function User(props: any) {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<userFullPayload | null>(null);
  const [taskAuths, setTaskAuths] = useState<{
    [key: string]: { userAuthTask: boolean; teacherAuth: boolean };
  }>({});
  const { data, error } = useSWR(`/api/teacher`, fetcher, {
    refreshInterval: 1000,
  });
  const router = useRouter();
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
                {
                  userAuthTask: task.userAuthTask,
                  teacherAuth: task.teacherAuth,
                },
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
  const allTaskDetails =
    userData?.TaskUser?.flatMap((task) => task.DetailTask) || [];
  const filteredTask =
    userData?.TaskUser?.flatMap((task) =>
      task.DetailTask?.filter((detail) => detail.Detail)
    ) || [];

  const tempVerif = filteredTask?.filter(
    (detail) => detail.status == "VERIFIED"
  );
  const tempDontVerif = filteredTask?.filter(
    (detail) => detail.status == "PENDING"
  );

  let verif = 0;
  let dontVerif = 0;

  if (tempVerif && allTaskDetails.length > 0) {
    verif = (tempVerif.length / allTaskDetails.length) * 100;
  }
  if (tempDontVerif && allTaskDetails.length > 0) {
    dontVerif = (tempDontVerif.length / allTaskDetails.length) * 100;
  }
  let ListTeacher;
  if (data) {
    const { user } = data;
    ListTeacher = user.filter((user: userFullPayload) => user.role === "GURU");
  }
  if (status === "loading") return "Loading...";
  return (
    <div>
      {status === "unauthenticated" ? (
        <div className="bg-white">
          <div className="justify-center flex bg-white pt-40 flex-col h-screen xl:flex-row items-center px-4">
            <div className="max-w-[800px]">
              <h1
                className={`text-[64px] text-start ${archivo_black.className} leading-none`}
              >
                Moklet <span className="text-red-500">Scholar</span>
              </h1>
              <p className="xl:text-[32px] lg:text-[30px] md:text-[28px] sm:text-[26px] text-[24px] font-normal my-2">
                Find Your Skill, For Your Future!
              </p>
              <FormButton
                onClick={() => signIn()}
                className="mt-[17px] scale-125 ml-4"
                variant="base"
              >
                Get Started Now!
              </FormButton>
            </div>
            <div className="mt-12">
              <Image
                src={gambar1}
                width={500}
                height={500}
                alt="Orang Sukses Amin"
              />
            </div>
          </div>
          <div className="mt-[100px] p-5 bg-[#E7E7E7] flex flex-row justify-center">
            <div className="lg:w-1/2 w-full">
              <h1 className={`font-bold text-3xl ${archivo_black.className}`}>SKL</h1>
              <p className={`mt-0 mb-5 font-light`}>
                Syarat Ketentuan Lulus
              </p>
              <p className="lg:font-medium font-normal indent-14 lg:text-base text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem
                ipsum, dolor sit amet consectetur adipisicing elit. At, maiores.
                Facere animi numquam ad itaque, sint excepturi sequi. Quo vitae
                veniam vero eaque. Recusandae optio totam quas dolorem soluta
                repellendus. Eius, molestias quae? Soluta veniam, fugiat
                suscipit cum cupiditate obcaecati. Ut dignissimos vitae quidem
                reprehenderit voluptate asperiores cum quam ex iure aperiam.
              </p>
              <p className="lg:font-medium font-normal lg:text-base indent-14 m-5 text-sm">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem
                ipsum, dolor sit amet consectetur adipisicing elit. At, maiores.
                Facere animi numquam ad itaque, sint excepturi sequi. Quo vitae
                veniam vero eaque. Recusandae optio totam quas dolorem soluta
                repellendus. Eius, molestias quae? Soluta veniam, fugiat
                suscipit cum cupiditate obcaecati. Ut dignissimos vitae quidem
                reprehenderit voluptate asperiores cum quam ex iure aperiam.
              </p>
            </div>
            <div className="flex w-1/2 justify-center items-center flex-col">
              <Image
                src={banner}
                alt="banner"
                className="lg:w-2/4 w-full h-fit"
              />
            </div>
          </div>
          <div className="p-2 lg:p-10 flex flex-col flex-wrap justify-center h-1/4 bg-highlight-2  overflow-auto">
            <h1 className="font-bold text-xl text-white">
              Guru Yang Terdaftar
            </h1>
            <div className="grid lg:grid-rows-2 md:grid-cols-2 grid-cols-1 md:grid-rows-4 lg:grid-cols-4 gap-2">
              {ListTeacher ? (
                ListTeacher.map((user: userFullPayload, i: React.Key) => (
                  <>
                    <div
                      className=" flex items-center bg-white p-5 rounded-lg m-3 w-[15rem] h-1/2 md:w-[20rem] md:h-[8rem]"
                      key={i}
                    >
                      <Image
                        src={user.photo_profile as string}
                        alt="photo guru"
                        width={100}
                        height={100}
                        className="m-3 w-1/4 rounded-full"
                      />
                      <p className="font-normal md:font-semibold p-2 text-[0.6rem] md:text-lg">
                        {user.name}
                      </p>
                    </div>
                  </>
                ))
              ) : (
                <div>Loading ...</div>
              )}
            </div>
          </div>
          <div className="justify-center flex bg-white pt-40 flex-col h-screen xl:flex-row items-center px-4">
            <div className="max-w-[800px]">
            </div>
          </div>
            <Footer variants="red"/>
        </div>
      ) : (
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
                    <span className="font-bold text-xl">
                      {verif ? verif : 0}%
                    </span>
                  </h1>
                </div>
                <div className="flex items-center">
                  <XSquare />
                  <h1 className="m-3">
                    Belum Terverifikasi oleh guru pengajar :{" "}
                    <span className="font-bold text-xl">
                      {dontVerif ? dontVerif : 0}%
                    </span>
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
            <div className="bg-white border-2 flex w-full border-highlight rounded-md p-0 md:p-5">
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
      )}
    </div>
  );
}
