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
import { Archivo_Black } from "next/font/google";
const archivo_black = Archivo_Black({ weight: "400", subsets: ["latin"] });
import { connect } from "http2";
import ModalProfile from "@/app/components/utils/Modal";

export default function Checklist() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<userFullPayload | null>(null);
  const [modal, setModal] = useState(false);
  const [taskToLoop, setTaskToLoop] = useState<string | null>(null);
  const router = useRouter();
  const[detailId, setDetailId]=useState<string>("");

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
  const ListTaskToDefined: (string | null)[] = [];
  userData?.TaskTeacher.forEach((task) => {
    if (!ListTaskToDefined.includes(task.Task)) {
      ListTaskToDefined.push(task.Task);
    }
  });
  const handleClick = (task: string | null) => {
    setModal(true);
    setTaskToLoop(task);
  };
  const TaskTeacher = userData?.TaskTeacher.find(
    (task) => task.Task === taskToLoop
  );
  const handleSubmit = async (e: FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const userAuthTask = formData.get("userAuthTask") === "on";
      const teacherAuth = formData.get("teacherAuth") === "on";
      let task =
        userData?.role === "SISWA"
          ? userData?.TaskUser.find((task) => task.id === id)
          : userData?.TaskTeacher.find((task) => task.id === id);
      let detail = task?.DetailTask.find((detail) => detail.id === detailId);
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
      } else {
        toast.error("Failed to update task", { id: toastID });
      }
      return updateResult;
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };
  const filteredTasks = userData?.TaskTeacher.filter(
    (task) => task.Task === taskToLoop
  );
  const handleForm=(detail: string)=>{
    setDetailId(detail)
  }
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
                            Task Type
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Task Detail
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Teacher Name
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Teacher Subject
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Validate Siswa
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Validate Teacher
                          </th>
                        </tr>
                      </thead>
                      <tbody className="p-10">
                        {task.DetailTask.map((detail, index) => (
                          <tr
                            key={detail.id}
                            className="bg-white border-double border-2 p-5 border-moklet"
                          >
                            {index === 0 && (
                              <th
                                scope="row"
                                className={`px-6 py-4 font-medium ${archivo_black.className} whitespace-nowrap dark:text-gray-800`}
                                rowSpan={task.DetailTask.length}
                              >
                                {task.Task}
                              </th>
                            )}
                            <td className="px-6 py-4">{detail.Detail}</td>
                            <td className="px-6 py-4">
                              {userData.Teacher?.name}
                            </td>
                            <td className="px-6 py-4">
                              {userData.Teacher?.clasess &&
                              userData.Teacher.title
                                ? `${userData.Teacher.clasess}${userData.Teacher.title}`
                                : "None"}
                            </td>
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
                            <td className="px-6 py-4">
                              <input
                                type="text"
                                name="detailId"
                                className="invisible"
                                defaultValue={detail.id}
                              />
                              <FormButton
                                type="submit"
                                className="p-5"
                                variant="base"
                                onClick={()=>{handleForm(detail.id)} }
                              >
                                Submit
                              </FormButton>
                            </td>
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
        <>
          {ListTaskToDefined.map((task, i) => (
            <div key={i} className="flex justify-center">
              <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400">
                <li className="flex items-center">
                  <FormButton
                    type="button"
                    onClick={() => handleClick(task)}
                    className="w-screen"
                    variant="base"
                  >
                    <svg
                      className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                    </svg>
                    {task}
                  </FormButton>
                </li>
              </ul>
            </div>
          ))}
          {modal && (
            <ModalProfile
              onClose={() => {
                setModal(false);
              }}
            >
              {filteredTasks ? (
                filteredTasks.map((task) => (
                  <div key={task.id}>
                    <form
                      onSubmit={(e) => handleSubmit(e, task.id)}
                      key={task.id}
                    >
                      <div className="flex items-center m-5 justify-between p-3 bg-white drop-shadow rounded-[12px]">
                        <div className="flex justify-between w-full">
                          <div className="relative overflow-x-auto">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                              <thead className="text-xs text-gray-900 uppercase dark:text-gray-400">
                                <tr>
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
                                    <td className="px-6 py-4">
                                      {detail.Detail}
                                    </td>
                                    <td className="px-6 py-4">
                                      {
                                        userData.Student.find(
                                          (student) =>
                                            student.id === task.userId
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
                                        disabled={detail.userAuthTask ? false:true}
                                        defaultChecked={detail.teacherAuth}
                                      />
                                    </td>
                                    <td className="px-6 py-4">
                                      <input
                                        type="text"
                                        name="detailId"
                                        className="invisible"
                                        defaultValue={detail.id}
                                      />
                                      <FormButton
                                        type="submit"
                                        className="p-5"
                                        variant="white"
                                        onClick={() => handleForm(detail.id)}
                                      >
                                        Submit
                                      </FormButton>
                                    </td>
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
                <></>
              )}
            </ModalProfile>
          )}
        </>
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
}
