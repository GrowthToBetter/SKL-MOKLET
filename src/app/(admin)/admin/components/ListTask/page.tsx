"use client";

import {  userFullPayload } from "@/utils/relationsip";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { FormButton } from "@/app/components/utils/Button";
import ModalProfile from "@/app/components/utils/Modal";
import toast from "react-hot-toast";
import { UpdateTaskUserAuth } from "@/utils/server-action/userGetServerSession";
import { DropDown, TextField } from "@/app/components/utils/Form";
import { Class, Title } from "@prisma/client";

export default function ListTask(props:any) {
  const { data: session, status } = useSession();
  const [modal, setModal] = useState(false);
  const [userData, setUserData] = useState<userFullPayload | null>(null);
  const handleModal = () => {
    setModal(!modal);
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
      const TaskString = formData.get("Task") as string;
      const classes=formData.get("classes") as Class;
      const title=formData.get("title") as Title;
      const filteredTeacher = props.teacherData.filter((teacher: userFullPayload) => 
        teacher.clasess?.toLowerCase() === classes.toLowerCase() && 
      teacher.title?.toLowerCase() === title.toLowerCase()
    );      
    for (const teacher of props.teacherData ?? []) {
      let taskTeacherData = {
        connect: [{ id: teacher.id }],
      };
        console.log(teacher.Student)
        for(const student of teacher.Student){
          let userConnection = {
            connect: { id: student.id },
          };
          formData.set("Task", TaskString);
          toast.loading("Loading...");
          await UpdateTaskUserAuth(formData, taskTeacherData, userConnection);
        }
      }
      setModal(false);
      toast.success("Task updated successfully!");
    } catch (error) {
      throw new Error((error as Error).message);
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
                <div className="flex items-center m-5 w-full justify-between p-3 bg-white drop-shadow rounded-[12px]">
                  <TextField
                    type="input"
                    label="ADD TASK"
                    name="Task"
                    className="w-full"
                  />
                <div className="flex justify-between m-3 flex-col">
                <DropDown options={Object.values(Class).map((classes) => ({
                    label: classes,
                    value: classes,
                  }))} name="classes" className="m-1 w-fit"/>
                <DropDown options={Object.values(Title).map((title) => ({
                    label: title,
                    value: title,
                  }))} name="title" className="m-1 w-fit"/>
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
