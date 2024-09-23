"use client";

import { taskListFullPayload, userFullPayload } from "@/utils/relationsip";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { FormButton } from "@/app/components/utils/Button";
import { RequestStatus, taskList } from "@prisma/client";
import ModalProfile from "@/app/components/utils/Modal";
import toast from "react-hot-toast";
import { UpdateTaskUserAuth } from "@/utils/server-action/userGetServerSession";

export default function ListTask(props: any) {
  const { data: session, status } = useSession();
  const [listData, setListData] = useState<taskListFullPayload[] | null>(null);
  const [modal, setModal] = useState(false);
  const handleModal = () => {
    setModal(!modal);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          const response = await fetch(`/api/Task`);
          if (response.ok) {
            const { task } = await response.json();
            setListData(task);
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      props.student.forEach(async (userStudent: string) => {
        const formData = new FormData(e.target as HTMLFormElement);
        const selectedTaskIds = formData.getAll("taskId") as string[];
        const filteredTaskId = listData?.filter((exe) =>
          selectedTaskIds.includes(exe.id)
        );
        for (const task of filteredTaskId ?? []) {
          const taskValue = task.task ?? "";
          let taskTeacherData = {
            connect: [{ id: props.userData.id }],
          };
          let userConnection = {
            connect: { id: userStudent },
          };
          formData.set("Task", taskValue);
          formData.set("user", userConnection.connect.id);
          
          await UpdateTaskUserAuth(formData, taskTeacherData);
        };
      });
      return toast.success("Task updated successfully!");
    } catch (error) {
      throw new Error((error as Error).message)
    }
  };
  return (
    <>
      <FormButton variant="base" className="w-32 h-16" onClick={handleModal}>
        Add Task
      </FormButton>
      {modal && (
        <ModalProfile
          onClose={() => {
            setModal(false);
          }}
        >
          <div className="grid grid-cols-1 grid-rows-3 p-4 pt-36 gap-y-4">
            <form onSubmit={(e) => handleSubmit(e)}>
              {listData?.map((useTask, x: React.Key) => (
                <>
                  <div
                    className="flex items-center m-5 justify-between p-3 bg-white drop-shadow rounded-[12px]"
                    key={x}
                  >
                    <div className="flex justify-between w-full">
                      <p className="text-[20px] font-medium mx-5">
                        {useTask.task}
                      </p>
                      <span className="flex">
                        <h1 className="m-3">
                          <input
                            type="checkbox"
                            name="taskId"
                            value={useTask.id}
                            defaultChecked={false}
                          />
                        </h1>
                      </span>
                    </div>
                  </div>
                </>
              ))}
              <FormButton type="submit" variant="base">
                Submit
              </FormButton>
            </form>
          </div>
        </ModalProfile>
      )}
    </>
  );
}
