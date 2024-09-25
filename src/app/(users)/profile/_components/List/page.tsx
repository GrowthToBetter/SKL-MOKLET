"use client";

import { teacherFullPayload } from "@/utils/relationsip";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function List(props: any) {
  const { data: session, status } = useSession();
  const [teacherData, setTeacherData] = useState<teacherFullPayload[]>([]);
  useEffect(() => {
    const fetchUserData = async () => {
      if (session && session.user?.role == "SISWA") {
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
    <>
    {session?.user?.role=="SISWA"? teacherData.map((teacher, i) => (
        <>
          {
            <li>
              <Link
                href="#"
                className="text-sm sm:text-sm md:text-lg lg:text-xl xl:text-xl text-slate-800"
              >
                {
                  <>
                    {teacher.name} -{" "}
                    {teacher.clasess
                      ? teacher.clasess
                      : "guru belum mengatur jenis kelas yang dia ampu"}
                  </>
                }
              </Link>
            </li>
          }
        </>
      )):(
        <li>
          <Link
            href="#"
            className="text-sm sm:text-sm md:text-lg lg:text-xl xl:text-xl text-slate-800"
          >
                {props.userData
                  ? props.userData.title
                  : "anda belum mengatur kelas yang diampu"}
          </Link>
        </li>
      ) }
      
      
    </>
  );
}
