"use client";

import { userFullPayload } from "@/utils/relationsip";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  updateRole,
  UpdateTaskTeacher,
  UpdateTaskUser,
} from "@/utils/server-action/userGetServerSession";
import { DropDown, TextField } from "@/app/components/utils/Form";
import { RequestStatus, Role } from "@prisma/client";
import { FormButton } from "@/app/components/utils/Button";
import ListTask from "../../(admin)/admin/components/ListTask/page";
import { Result } from "postcss";

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

      const task =
        userData?.role === "SISWA"
          ? userData?.TaskUser.find((task) => task.id === id)
          : userData?.TaskTeacher.find((task) => task.id === id);
      let userAuthTaskValidation =
        userData?.role == "SISWA" ? userAuthTask : task?.userAuthTask;
      let teacherAuthValidation =
        userData?.role == "GURU" ? teacherAuth : task?.teacherAuth;
      const normalizedTask = task
        ? {
            id: task.id,
            Task: task.Task,
            userId: task.userId,
            userAuthTask: userAuthTaskValidation,
            teacherAuth: teacherAuthValidation,
            status: task.status || "PENDING",
          }
        : null;
      let status: RequestStatus = normalizedTask?.status ?? "PENDING";
      if (normalizedTask?.userAuthTask && normalizedTask?.teacherAuth) {
        status = "VERIFIED";
      }
      const toastID = toast.loading("Updating task...");
      let updateResult;
      if (userData?.role === "SISWA") {
        updateResult = await UpdateTaskUser(status, id, formData);
      }
      if (userData?.role === "GURU") {
        updateResult = await UpdateTaskTeacher(status, id, formData);
      }
      if (updateResult) {
        toast.success("Task updated successfully!", { id: toastID });
        console.log(updateResult)
      } else {
        toast.error("Failed to update task", { id: toastID });
      }
      return updateResult;
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };
  if (status === "unauthenticated") return router.push("/signin");
  if (status === "loading") return "Loading...";
  return (
    <div className="grid grid-cols-1 grid-rows-3 p-4 pt-36 gap-y-4">
      {userData?.role === "SISWA" ? (
        userData?.TaskUser.map((task, x: React.Key) => (
          <form onSubmit={(e) => handleSubmit(e, task.id)} key={x}>
            <div className="flex items-center m-5 justify-between p-3 bg-white drop-shadow rounded-[12px]">
              <div className="flex justify-between w-full">
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-900 uppercase dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Task Type
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Task Detail
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Student Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Student Class
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Validate Siswa
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Validate Teacher
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-white dark:bg-gray-800">
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {task.Task}
                        </th>
                        {task.DetailTask && task.DetailTask.length > 0 ? (
                          <th>
                            {task.DetailTask.map((detail, i) => (
                              <li key={i} className="text-center">
                                {detail.Detail}
                              </li>
                            ))}
                          </th>
                        ) : (
                          "No details available"
                        )}
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {userData.name}
                        </th>
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {userData.title && userData.ClassNumber
                            ? userData.title + userData.ClassNumber
                            : "None"}
                        </th>
                        <td className="px-6 py-4">
                          {" "}
                          <input
                            type="checkbox"
                            disabled={false}
                            name="userAuthTask"
                            defaultChecked={task.userAuthTask}
                          />
                        </td>
                        <td className="px-6 py-4">
                          {" "}
                          <input
                            type="checkbox"
                            disabled={true}
                            name="teacherAuth"
                            defaultChecked={task.teacherAuth}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <FormButton type="submit" variant="base">
              Submit
            </FormButton>
          </form>
        ))
      ) : userData?.role === "GURU" ? (
        userData?.TaskTeacher.map((task, i) => (
          <>
            <form onSubmit={(e) => handleSubmit(e, task.id)} key={i}>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-900 uppercase dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Task Type
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Task Detail
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Student Name
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Student Class
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Validate Siswa
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Validate Teacher
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white dark:bg-gray-800">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {task.Task}
                      </th>
                      {task.DetailTask && task.DetailTask.length > 0 ? (
                        <th>
                          {task.DetailTask.map((detail, i) => (
                            <li key={i} className="text-center">
                              {detail.Detail}
                            </li>
                          ))}
                        </th>
                      ) : (
                        "No details available"
                      )}
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {
                          userData.Student.find(
                            (student) => student.id === task.userId
                          )?.name
                        }
                      </th>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {
                          userData.Student.map(
                            (student) =>( <>
                            <p>{student.clasess&&student.title&&student.ClassNumber?student.clasess+student.title+student.ClassNumber:""}</p>
                            </>)
                          )
                        }
                      </th>
                      <td className="px-6 py-4">
                        {" "}
                        <input
                          type="checkbox"
                          disabled={true}
                          name="userAuthTask"
                          defaultChecked={task.userAuthTask}
                        />
                      </td>
                      <td className="px-6 py-4">
                        {" "}
                        <input
                          type="checkbox"
                          disabled={false}
                          name="teacherAuth"
                          defaultChecked={task.teacherAuth}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <FormButton type="submit" variant="base">
                Submit
              </FormButton>
            </form>
          </>
        ))
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
}
