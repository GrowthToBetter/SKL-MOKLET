"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { FormButton } from "@/app/components/utils/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateRole, UpdateUserById } from "@/utils/server-action/userGetServerSession";
import { Role, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import { occupation } from "@/app/types/occupation";
import toast from "react-hot-toast";
import { DropDown } from "@/app/components/utils/Form";
import { userFullPayload } from "@/utils/relationsip";

export default function PilihKeahlian() {
  const { data: session, status } = useSession();
  const [selectedRoles, setSelectedRoles] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<userFullPayload | null>(null);

  const router = useRouter();

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

  if (status === "unauthenticated") router.push("/signin");

  const handleRoleChange = (userId: string, newRole: string) => {
    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: newRole, 
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const toastID = toast.loading("Loading ...");

      for (const userId in selectedRoles) {
        formData.set("role", selectedRoles[userId]); 
        await updateRole(userId, formData);
      }

      toast.success("Role updated successfully!", { id: toastID });
      router.push("/profile");
    } catch (error) {
      toast.error("Failed to update role!");
      throw new Error((error as Error).message);
    }
  };

  return (
    <React.Fragment>
      <main className="flex max-w-full w-full h-screen items-center justify-center">

        <div className="w-1/2 h-full pt-24">
          <div className="max-w-2xl mx-auto mt-12">
            <h3 className="text-[32px] font-medium text-black">What are You?</h3>
            <p className="text-[20px] font-medium text-black opacity-70 -mt-2">Decide what you want to be</p>
            <form onSubmit={handleSubmit}>
            <div
              className="flex items-center m-5 justify-between p-3 bg-white drop-shadow rounded-[12px]"
            >
              <p className="text-[10px] font-medium mx-5">{userData?.name}</p>
              <p className="text-[10px] font-medium mx-5">{userData?.email}</p>
              <div className="flex items-center">
                <DropDown
                  label="Role"
                  options={Object.values(Role).map((role) => ({
                    label: role,
                    value: role,
                  }))}
                  className="rounded-xl flex justify-center items-center bg-highlight text-black p-3 m-3"
                  name={`role-${userData?.id}`}
                  value={selectedRoles[userData?.id || 0] || userData?.role}
                  handleChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleRoleChange((userData?.id || ""), e.target.value)
                  }
                />
              </div>
            </div>
          <FormButton type="submit" variant="base">
            Submit
          </FormButton>
        </form>
          </div>
        </div>
      </main>
    </React.Fragment>
  );
}
