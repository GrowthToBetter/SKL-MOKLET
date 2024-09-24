"use client";

import { useSession } from "next-auth/react";
import {useEffect, useState } from "react";
import AdminHeaders from "../components/main/AdminHeaders";
import { teacherFullPayload } from "@/utils/relationsip";
import ListTask from "../components/ListTask/page";

export default function TeamData() {
  const { data: session, status } = useSession();
  const [modal, setModal] = useState(false);
  const [teacherData, setTeacherData] = useState<teacherFullPayload | null>(null);
  const handleModal = () => {
    setModal(!modal);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          const response = await fetch(`/api/teacher`);
          if (response.ok) {
            const { user } = await response.json();
            setTeacherData(user);
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
  return (
    <div className="flex flex-col">
      <AdminHeaders data="Add Task By Admin" />
      <>
      
      </>
      <div className="container">
      <ListTask teacherData={teacherData}/>
      </div>
    </div>
  );
}
