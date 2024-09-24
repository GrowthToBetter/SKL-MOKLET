"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { userFullPayload } from "@/utils/relationsip";
import { Class, Gender, Religion, Title } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import RedirectArrow from "@/app/components/Icons/RedirectArrow";
import LinkedinIcon from "@/app/components/Icons/LinkedinIcon";
import GithubIcons from "@/app/components/Icons/GithubIcons";
import WhatsappIcons from "@/app/components/Icons/WhatsappIcons";
import InstagramIcons from "@/app/components/Icons/InstagramIcons";
import { FormButton } from "@/app/components/utils/Button";
import ModalProfile from "@/app/components/utils/Modal";
import { DropDown, TextArea, TextField } from "@/app/components/utils/Form";
import toast from "react-hot-toast";
import { UpdateGeneralProfileById } from "@/utils/server-action/userGetServerSession";
import List from "./_components/List/page";

export default function Profile() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<userFullPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [modal, setModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<{ [key: string]: string }>({});
  const [selectedSpecialist, setSelectedSpecialist] = useState<{ [key: string]: string }>({});
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
  const handleRoleChangeClass = (userId: string, newClass: string) => {
    setSelectedClass((prev) => ({
      ...prev,
      [userId]: newClass, 
    }));
  };
  const handleRoleChangeSpecialist = (userId: string, newSpecialist: string) => {
    setSelectedSpecialist((prev) => ({
      ...prev,
      [userId]: newSpecialist, 
    }));
  };
  const handleModal = () => {
    setModal(!modal);
  };
  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);

    try {
      await UpdateGeneralProfileById(formData);
      toast.success("Sukses Mengisi Data");
      setIsLoading(false);
      router.push("/profile");
      window.location.reload();
    } catch (error) {
      console.log((error as Error).message);
      setIsLoading(false);

      toast.error("Gagal Mengedit Profil");
    }
  };
  if (status === "unauthenticated") return router.push("/signin");
  if (status === "loading") return "Loading...";
  return (
    <div className="bg-slate-100 p-0 sm:p-5 md:p-10 lg:p-15 xl:p-20">
      <div className="mt-24 bg-white rounded-3xl p-10 sm:p-10 md:p-15 lg:p-20 xl:p-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0 h-72"></div>
        <div className="relative z-10 flex flex-col items-start mt-44 sm:mt-48 md:mt-44 lg:mt-32 xl:mt-28">
          <div className="w-32 h-32 sm:w-24 md:w-32 flex place-items-center lg:w-36 xl:w-40 sm:h-24 md:h-32 lg:h-36 xl:h-40 rounded-full bg-gray-300 mb-4 overflow-hidden">
            <Image
              src={session?.user?.image as string}
              alt="Image Profile"
              width={180}
              height={180}
              className="mx-auto"
            />
          </div>
          <div className="mt-4 flex w-full justify-between">
            <h1 className="text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-normal">
              {userData?.name}
              {
                `${
                  userData?.clasess ? `(${userData?.clasess})` : " "
                }` as string
              }
            </h1>
            <div className="flex gap-x-2">
              <FormButton variant="base" onClick={handleModal}>
                Edit Profile
              </FormButton>
              <FormButton
                variant="base"
                onClick={() => router.push("/profile/notification")}
              >
                Notification
              </FormButton>
            </div>
          </div>
          <div className="h-2"></div>
        </div>

        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h2 className="text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-normal mb-4">
              {userData?.role == "SISWA"
                ? "Teacher List"
                : "List Kelas Yang Diampu"}
            </h2>
            <ul className="space-y-2">
              {session?.user?.role=="SISWA" ? 
                <List userData={userData?.Teacher} />
              : session?.user?.role=="GURU" ? <List userData={userData?.classTeacher} />:""}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-normal mb-4">
              Social Media
            </h2>
            <ul className="space-y-6">
              <li className="flex items-center gap-x-3">
                <WhatsappIcons />
                <p className="text-sm sm:text-sm md:text-lg lg:text-xl xl:text-xl text-slate-800">
                  wa.me/{userData?.whatsapp}
                </p>
                <Link
                  href={`https://wa.me/${userData?.whatsapp}`}
                  target="_blank"
                >
                  <RedirectArrow />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {modal && (
        <ModalProfile onClose={() => setModal(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formdata = new FormData(e.currentTarget);

              handleSubmit(formdata);
            }}
          >
            <TextField
              type="text"
              label="Name"
              readOnly
              disabled
              defaultValue={userData?.name as string}
            />
            <TextField
              type="text"
              label="Email"
              readOnly
              disabled
              defaultValue={userData?.email as string}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-3">
              {session?.user ? (<>
                <DropDown
                  label="Class"
                  options={Object.values(Class).map((classes) => ({
                    label: classes,
                    value: classes,
                  }))}
                  className="rounded-xl flex justify-center items-center bg-moklet text-black p-3 m-3 font-bold"
                  name={`classes`}
                  value={selectedClass[userData?.id || 0] || (userData?.clasess||undefined)}
                  handleChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleRoleChangeClass((userData?.id || ""), e.target.value)
                  }
                />
                <DropDown
                  label="Specialist"
                  options={Object.values(Title).map((special) => ({
                    label: special,
                    value: special,
                  }))}
                  className="rounded-xl flex justify-center items-center bg-moklet text-black p-3 m-3 font-bold"
                  name={`specialist`}
                  value={selectedSpecialist[userData?.id || 0] || (userData?.title||undefined)}
                  handleChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleRoleChangeSpecialist((userData?.id || ""), e.target.value)
                  }
                />
              <TextField
                type="text"
                label="Absent"
                name="absent"
                defaultValue={userData?.absent as string}
              />
              </>): (<>
                <TextField
                type="text"
                label="Subject"
                name="clasess"
                defaultValue={userData?.clasess as string}
              />
              <TextField
                type="text"
                label="No. Rank"
                name="absent"
                defaultValue={userData?.absent as string}
              />
              </>)}
              
              <TextField
                type="text"
                label="Phone"
                name="Phone"
                defaultValue={userData?.Phone as string}
              />
              <TextField
                type="date"
                label="Birth Date"
                name="BirthDate"
                defaultValue={userData?.BirthDate as string}
              />
              <TextField
                type="text"
                label="NIS"
                name="NIS"
                defaultValue={userData?.NIS as string}
              />
              <TextField
                type="text"
                label="NISN"
                name="NISN"
                defaultValue={userData?.NISN as string}
              />
              <TextField
                type="text"
                label="school Origin"
                name="schoolOrigin"
                defaultValue={userData?.schoolOrigin as string}
              />

              <DropDown
                label="Gender"
                defaultValue={userData?.gender as string}
                options={Object.values(Gender).map((x) => ({
                  label: x,
                  value: x,
                }))}
                name="gender"
              />
              <DropDown
                name="religion"
                label="Religion"
                defaultValue={userData?.religion as string}
                options={Object.values(Religion).map((x) => ({
                  label: x,
                  value: x,
                }))}
              />
            </div>
            <div>
              <div className="flex gap-x-3 items-center">
                <WhatsappIcons />
                <TextField
                  type="text"
                  label="Whatsapp"
                  name="whatsapp"
                  className="w-full"
                  defaultValue={userData?.whatsapp as string}
                />
              </div>
            </div>
            <div className="flex justify-end w-full gap-x-4 pb-4">
              <FormButton onClick={() => setModal(false)} variant="white">
                Close
              </FormButton>
              <FormButton type="submit" variant="base">
                {!isLoading ? (
                  "Edit"
                ) : (
                  <div className="flex gap-x-3 items-center">
                    <svg
                      aria-hidden="true"
                      className="inline w-5 h-5 animate-spin text-red-500 fill-white"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span>Loading...</span>
                  </div>
                )}
              </FormButton>
            </div>
          </form>
        </ModalProfile>
      )}
    </div>
  );
}
