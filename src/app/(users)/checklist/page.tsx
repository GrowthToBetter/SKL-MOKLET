"use client";

import { userFullPayload } from "@/utils/relationsip";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  updateRole,
  UpdateTaskUser,
} from "@/utils/server-action/userGetServerSession";
import { DropDown, TextField } from "@/app/components/utils/Form";
import { Role } from "@prisma/client";
import { FormButton } from "@/app/components/utils/Button";

export default function Checklist() {
  const { data: session, status } = useSession();
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const userAuthTask = formData.get("userAuthTask") === "on";
      const teacherAuth = formData.get("teacherAuth") === "on";

      const toastID = toast.loading("Updating task...");
      const updateResult = await UpdateTaskUser(userAuthTask, id, formData);
      if (updateResult) {
        toast.success("Task updated successfully!", { id: toastID });
      } else {
        toast.error("Failed to update task", { id: toastID });
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };
  if (status === "unauthenticated") return router.push("/signin");
  if (status === "loading") return "Loading...";
  return (
    <div className="grid grid-cols-1 grid-rows-3 p-4 pt-36 gap-y-4">
      {userData?.TaskUser && userData.TaskUser.length > 0 ? (
        userData.TaskUser.map((task, x: React.Key) => (
          <form onSubmit={(e) => handleSubmit(e, task.id)} key={x}>
            <div className="flex items-center m-5 justify-between p-3 bg-white drop-shadow rounded-[12px]">
              <div className="flex justify-between w-full">
                <p className="text-[20px] font-medium mx-5">{task.Task}</p>
                <span className="flex">
                  {session?.user?.role === "SISWA" ? (
                    <>
                      <h1 className="m-3">
                        Validate Siswa{" "}
                        <input
                          type="checkbox"
                          name="userAuthTask"
                          defaultChecked={task.userAuthTask}
                        />
                      </h1>
                      <h1 className="m-3">
                        Validate Teacher{" "}
                        <input
                          type="checkbox"
                          disabled={true}
                          name="teacherAuth"
                          defaultChecked={task.teacherAuth}
                        />
                      </h1>
                    </>
                  ) : (
                    <>
                      <h1 className="m-3">
                        Validate Siswa{" "}
                        <input
                          type="checkbox"
                          disabled={true}
                          name="userAuthTask"
                          defaultChecked={task.userAuthTask}
                        />
                      </h1>
                      <h1 className="m-3">
                        Validate Teacher{" "}
                        <input
                          type="checkbox"
                          disabled={false}
                          name="teacherAuth"
                          defaultChecked={task.teacherAuth}
                        />
                      </h1>
                    </>
                  )}
                </span>
              </div>
            </div>
            <FormButton type="submit" variant="base">
              Submit
            </FormButton>
          </form>
        ))
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
}
