"use client";

import { userFullPayload } from "@/utils/relationsip";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { FormButton } from "@/app/components/utils/Button";
import ModalProfile from "@/app/components/utils/Modal";
import toast from "react-hot-toast";
import { UpdateTaskUserAuth, updateUserDetailTask } from "@/utils/server-action/userGetServerSession";
import { DropDown, TextField } from "@/app/components/utils/Form";
import { Class, Title } from "@prisma/client";
import useSWR from "swr";
import { fetcher } from "@/utils/server-action/Fetcher";

export default function ListTask(props: any) {
  const { data: session } = useSession();
  const [modal, setModal] = useState(false);
  const [taskFields, setTaskFields] = useState([{ task: "", details: [""] }]); 
  const [userData, setUserData] = useState<userFullPayload | null>(null);

  const handleModal = () => {
    setModal(!modal);
  };

  const handleAddTaskField = () => {
    setTaskFields([...taskFields, { task: "", details: [""] }]);
  };

  const handleAddDetailField = (index: number) => {
    const newTaskFields = [...taskFields];
    newTaskFields[index].details.push("");
    setTaskFields(newTaskFields);
  };

  const handleTaskChange = (index: number, value: string) => {
    const newTaskFields = [...taskFields];
    newTaskFields[index].task = value;
    setTaskFields(newTaskFields);
  };

  const handleDetailChange = (taskIndex: number, detailIndex: number, value: string) => {
    const newTaskFields = [...taskFields];
    newTaskFields[taskIndex].details[detailIndex] = value;
    setTaskFields(newTaskFields);
  };

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const classes = formData.get("classes") as Class;
      const title = formData.get("title") as Title;
      
      const toastID = toast.loading("Loading...");
      let updateResult = false;
      // filter guru yang mendapat task, sesuai kelas jurusannya{}
      for (const teacher of props.teacherData ?? []) {
        const taskTeacherData = {
          connect: [{ id: teacher.id }],
        };

        for (const student of teacher.Student) {
          const userConnection = {
            connect: { id: student.id },
          };

          for (const field of taskFields) {
            formData.set("Task", field.task);
            formData.set("Detail", field.details[0]); 
            const result = await UpdateTaskUserAuth(formData, taskTeacherData, userConnection);
            
            if (result && result.task) {
              await updateTaskWithDetails(result.task.id, field.details.slice(1));
              updateResult = true;
            }
          }
        }
      }
      
      setTaskFields([{ task: "", details: [""] }]);
      setModal(false);
      if (updateResult) {
        toast.success("Task and details updated successfully!", { id: toastID });
      } else {
        toast.error("Failed to update task and details", { id: toastID });
      }
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    }
  };

  const updateTaskWithDetails = async (taskId: string, details: string[]) => {
    try {
      for (const detail of details) {
        await updateUserDetailTask(detail, { connect: { id: taskId } });
      }
    } catch (error) {
      console.error("Error updating task details:", error);
      throw new Error("Failed to update task details");
    }
  };

  return (
    <>
      <FormButton
        variant="base"
        className="w-32 h-16 m-10"
        onClick={handleModal}
      >
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
              <>
                <div className="w-full">
                  {taskFields.map((field, taskIndex) => (
                    <div key={taskIndex} className="w-full mb-4 p-4 bg-white border-2 border-moklet drop-shadow rounded-[12px]">
                      <div className="flex items-center justify-between">
                        <TextField
                          type="input"
                          label={`ADD TASK ${taskIndex + 1}`}
                          name={`Task-${taskIndex}`} 
                          value={field.task}
                          handleChange={(e) => handleTaskChange(taskIndex, e.target.value)}
                          className="w-full m-3 text-black"
                        />
                      </div>
                      {field.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center m-3">
                          <TextField
                            type="input"
                            label={`Task Detail ${detailIndex + 1}`}
                            name={`TaskDetail-${taskIndex}-${detailIndex}`}
                            value={detail}
                            handleChange={(e) => handleDetailChange(taskIndex, detailIndex, e.target.value)}
                            className="w-full m-3 text-highlight"
                          />
                          <FormButton
                            type="button"
                            onClick={() => handleAddDetailField(taskIndex)} // Tambahkan detail task
                            className="rounded-full flex justify-center items-center text-center ml-2"
                            variant="base"
                          >
                            +
                          </FormButton>
                        </div>
                      ))}
                      <FormButton
                          type="button"
                          onClick={() => handleAddTaskField()}
                          className="rounded-full flex justify-center items-center text-center"
                          variant="base"
                        >
                          +
                        </FormButton>
                    </div>
                  ))}
                  <div className="flex justify-between m-3 flex-col">
                    <DropDown
                      options={Object.values(Class).map((classes) => ({
                        label: classes,
                        value: classes,
                      }))}
                      name="classes"
                      className="m-1 w-fit"
                    />
                    <DropDown
                      options={Object.values(Title).map((title) => ({
                        label: title,
                        value: title,
                      }))}
                      name="title"
                      className="m-1 w-fit"
                    />
                  </div>
                </div>
              </>
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
function updateTaskWithDetails(id: string, arg1: string[]) {
  throw new Error("Function not implemented.");
}

