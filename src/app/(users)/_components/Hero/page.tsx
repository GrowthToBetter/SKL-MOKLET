"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { teacherFullPayload, userFullPayload } from "@/utils/relationsip";
import { LinkButton } from "@/app/components/utils/Button";
import banner from "@/../public/img/banner ryo.png";
import Image from "next/image";

export default function Hero(props: any) {
  const { data: session, status } = useSession();
  const [teacherData, setTeacherData] = useState<teacherFullPayload[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          const response = await fetch(
            `/api/teacher?teacherId=${props.userData?.id}`,
            {
              method: "GET",
            }
          );
          if (response.ok) {
            const { user }: { user: teacherFullPayload[] } =
              await response.json();
            setTeacherData(user);
          } else {
            throw new Error("Failed to fetch teacher data");
          }
        } catch (error) {
          console.error("Error fetching teacher data:", error);
        }
      }
    };
    fetchUserData();
  }, [session, props]);
  return (
    <div className="grid lg:grid-rows-2 grid-rows-1 gap-2 bg-white rounded-xl p-8 mt-4">
      {teacherData?.length != 0 ? (
        teacherData?.map((user, i) => (
          <>
            <div
              id="container"
              key={i}
              className="w-full bg-slate-50 rounded-3xl pb-6 border border-slate-200"
            >
              <Image src={banner} alt="banner" className="w-full" />
              <div className="rounded-full overflow-hidden -mt-12 relative w-[60px] h-[60px] ml-4">
                <Image
                  src={user.photo_profile as string}
                  height={user ? 60 : 0}
                  width={user ? 60 : 0}
                  alt="image"
                  className="absolute"
                />
              </div>
              <div className="ml-12 mt-2">
                <p className="font-medium xl:text-[20px] lg:text-[19px] md:text-[18px] sm:text-[17px] text-[16px] text-black">
                  {user.name}
                </p>
                <p
                  className={`font-normal xl:text-[15px] lg:text-[14px] md:text-[13px] sm:text-[12px] text-[11px] mt-2 text-highlight`}
                >
                  Status: {user.role}
                </p>
                <div className="mt-6 justify-start">
                  <LinkButton
                    variant="white"
                    href="#"
                    className="bg-transparent border rounded-full"
                  >
                    Profil
                  </LinkButton>
                  <LinkButton
                    variant="white"
                    href={`https://wa.me/${user.whatsapp}`}
                    target="_blank"
                    className="bg-transparent border rounded-full"
                  >
                    Chat
                  </LinkButton>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-center font-bold rounded-lg bg-moklet">
                Sugestion:
              </h1>
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Possimus rerum impedit, nesciunt laboriosam sint non. Voluptatem
                laboriosam omnis atque, cum inventore alias fuga necessitatibus?
                Esse quo atque dolorum accusamus. Aliquam.
              </p>
            </div>
          </>
        ))
      ) : (
        <>
          <h1>NO SUGESTION HERE</h1>
        </>
      )}
    </div>
  );
}
