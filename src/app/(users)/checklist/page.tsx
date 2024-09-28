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
import { connect } from "http2";

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
      const detailId = formData.get("detailId") as string;
      const task =
        userData?.role === "SISWA"
          ? userData?.TaskUser.find((task) => task.id === id)
          : userData?.TaskTeacher.find((task) => task.id === id);
      const detail = task?.DetailTask.find((detail) => detail.id === detailId);

      if (!detail) {
        toast.error("Detail not found");
        return;
      }
      let userAuthTaskValidation =
        userData?.role === "SISWA" ? userAuthTask : detail.userAuthTask;
      let teacherAuthValidation =
        userData?.role === "GURU" ? teacherAuth : detail.teacherAuth;
      const normalizedTask = task
        ? {
            id: task.id,
            Task: task.Task,
            userId: task.userId,
          }
        : null;
      let status: RequestStatus = "PENDING";
      if (userAuthTaskValidation && teacherAuthValidation) {
        status = "VERIFIED";
      }
      const toastID = toast.loading("Updating task...");
      let updateResult;
      if (userData?.role === "SISWA") {
        updateResult = await UpdateTaskUser(status, detailId, formData);
      }
      if (userData?.role === "GURU") {
        updateResult = await UpdateTaskTeacher(status, detailId, formData);
      }
      if (updateResult) {
        toast.success("Task updated successfully!", { id: toastID });
        console.log(updateResult);
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
        userData?.TaskUser.map((task) => (
          <div key={task.id}>
            <form onSubmit={(e) => handleSubmit(e, task.id)} key={task.id}>
              <div className="flex items-center m-5 justify-between p-3 bg-white drop-shadow rounded-[12px]">
                <div className="flex justify-between w-full">
                  <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-900 uppercase dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Task Name
                          </th>
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
                        {task.DetailTask.map((detail, index) => (
                          <tr
                            key={detail.id}
                            className="bg-white dark:bg-gray-800"
                          >
                            {index === 0 && (
                              <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                rowSpan={task.DetailTask.length}
                              >
                                {task.Task}
                              </th>
                            )}
                            <td className="px-6 py-4">{detail.Detail}</td>
                            <td className="px-6 py-4">{userData.name}</td>
                            <td className="px-6 py-4">
                              {userData.clasess &&
                              userData.title &&
                              userData.ClassNumber
                                ? `${userData.clasess}${userData.title}${userData.ClassNumber}`
                                : "None"}
                            </td>
                            <input
                              type="text"
                              name="detailId"
                              className="invisible"
                              defaultValue={detail.id}
                            />
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                name="userAuthTask"
                                defaultChecked={detail.userAuthTask}
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                disabled
                                name="teacherAuth"
                                defaultChecked={detail.teacherAuth}
                              />
                            </td>
                            <FormButton type="submit" className="p-5" variant="white">
                              Submit
                            </FormButton>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ))
      ) : userData?.role === "GURU" ? (
        userData?.TaskTeacher.map((task) => (
          <div key={task.id}>
            <form onSubmit={(e) => handleSubmit(e, task.id)} key={task.id}>
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
                        {task.DetailTask.map((detail, index) => (
                          <tr
                            key={detail.id}
                            className="bg-white dark:bg-gray-800"
                          >
                            {index === 0 && (
                              <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                rowSpan={task.DetailTask.length}
                              >
                                {task.Task}
                              </th>
                            )}
                            <td className="px-6 py-4">{detail.Detail}</td>
                            <td className="px-6 py-4">
                              {
                                userData.Student.find(
                                  (student) => student.id === task.userId
                                )?.name
                              }
                            </td>
                            <td className="px-6 py-4">
                              {userData.Student.map((student) => (
                                <p key={student.id}>
                                  {student.clasess &&
                                  student.title &&
                                  student.ClassNumber
                                    ? `${student.clasess}${student.title}${student.ClassNumber}`
                                    : ""}
                                </p>
                              ))}
                            </td>
                            <input
                              type="text"
                              name="detailId"
                              className="invisible"
                              defaultValue={detail.id}
                            />
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                disabled
                                name="userAuthTask"
                                defaultChecked={detail.userAuthTask}
                              />
                            </td>
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                name="teacherAuth"
                                defaultChecked={detail.teacherAuth}
                              />
                            </td>
                            <FormButton type="submit" className="p-5" variant="white">
                              Submit
                            </FormButton>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ))
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
}
