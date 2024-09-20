"use client";

import { useSession } from "next-auth/react";
import CheckSquare from "@/app/components/Icons/Check-square";
import XSquare from "@/app/components/Icons/Xsquare";
import banner from "@/../public/img/banner ryo.png";
import Image from "next/image";
import { LinkButton } from "@/app/components/utils/Button";
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode, Key } from "react";

export default function Hero(props:any){
    const { data: session, status } = useSession();
    return <>
    <div className="mt-[100px] p-5 max-w m-10 flex justify-center flex-col">
        <h1 className="font-semibold text-xl text-highlight p-3">
          Welcome back, {session?.user ? session?.user?.name: "user"}!
        </h1>
        <div className="bg-moklet lg:w-[40rem] rounded-xl p-3 m-5">
          <h1 className="font-semibold text-lg m-3 text-white">Keterangan yang sudah dikonfirmasi oleh guru pengajar</h1>
          <div className="bg-white border-2 border-highlight rounded-md p-5">
            <div className="flex items-center">
            <CheckSquare />
            <h1  className="m-3"> Terverifikasi oleh guru pengajar : </h1>
            </div>
            <div className="flex items-center">
            <XSquare/>
            <h1 className="m-3">Belum Terverifikasi oleh guru pengajar : </h1>
            </div>
          </div>
        </div>
        <div className="bg-moklet lg:w-[40rem] rounded-xl p-3 m-5">
          <h1 className="font-bold text-lg m-3 text-white">Evaluasi Kompetensi</h1>
          <div className="bg-white border-2 border-highlight rounded-md p-5">
            <div className="flex items-center flex-col">
            {props.datas.map((user: { photo_profile: string; name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; job: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; status: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined; whatsapp: any; }, i: Key | null | undefined) => (
                <div key={i} id="container" className="w-full bg-slate-50 rounded-3xl pb-6 border border-slate-200">
                  <Image src={banner} alt="banner" className="w-full" />
                  <div className="rounded-full overflow-hidden -mt-12 relative w-[60px] h-[60px] ml-4">
                    <Image src={user.photo_profile as string} height={60} width={60} alt="image" className="absolute" />
                  </div>
                  <div className="ml-12 mt-2">
                    <p className="font-medium xl:text-[20px] lg:text-[19px] md:text-[18px] sm:text-[17px] text-[16px] text-black">{user.name}</p>
                    <p className="font-normal xl:text-[15px] lg:text-[14px] md:text-[13px] sm:text-[12px] text-[11px] text-slate-600">{user.job} | </p>
                    <p className={`font-normal xl:text-[15px] lg:text-[14px] md:text-[13px] sm:text-[12px] text-[11px] mt-2 ${user?.status === "Dont_Have_Team" ? "text-red-500" : user?.status === "Have_Team" ? "text-green-500" : ""}`}>
                      Status: {user?.status}
                    </p>
                    <div className="mt-6 justify-start">
                      <LinkButton variant="white" href="#" className="bg-transparent border rounded-full">
                        Profil
                      </LinkButton>
                      <LinkButton variant="white" href={`https://wa.me/${user.whatsapp}`} target="_blank" className="bg-transparent border rounded-full">
                        Chat
                      </LinkButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
}