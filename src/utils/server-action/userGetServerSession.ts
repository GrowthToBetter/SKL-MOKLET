"use server";

import { Gender, Religion, RequestStatus, Role, Status, Task } from "@prisma/client";
import prisma from "@/lib/prisma";
import { createUser, findUser, updateUser } from "../user.query";
import { revalidatePath } from "next/cache";
import { nextGetServerSession } from "@/lib/authOption";


export const UpdateUserById = async (data: FormData) => {
  try {
    const session = await nextGetServerSession();

    const id = session?.user?.id;

    const email = data.get("email") as string;
    const photo_profile = data.get("photo_profile") as string;
    const name = data.get("name") as string;
    const role = data.get("role") as Role;
    const clasess = data.get("clasess") as string;
    const absent = data.get("absent") as string;
    const Phone = data.get("Phone") as string;
    const NIS = data.get("NIS") as string;
    const NISN = data.get("NISN") as string;
    const schoolOrigin = data.get("schoolOrigin") as string;
    const status = data.get("status") as Status;
    const BirthDate = data.get("BirthDate") as string;
    const religion = data.get("religion") as Religion;
    const gender = data.get("gender") as Gender;
    if (!id) {
      const create = await createUser({
        email,
        photo_profile,
        name,
        role,
        clasess,
        absent,
        NIS,
        NISN,
        Phone,
        schoolOrigin,
        status,
        BirthDate,
        religion,
        gender,
      });
      if (!create) throw new Error("Failed to create");
    } else if (id) {
      const findUserWithId = await prisma.user.findUnique({
        where: { id },
      });

      const update = await updateUser(
        { id: id ?? findUserWithId?.id },
        {
          email: email ?? findUserWithId?.email,
          name: name ?? findUserWithId?.name,
          absent: absent ?? findUserWithId?.absent,
          clasess: clasess ?? findUserWithId?.clasess,
          NIS: NIS ?? findUserWithId?.NIS,
          NISN: NISN ?? findUserWithId?.NISN,
          schoolOrigin: schoolOrigin ?? findUserWithId?.schoolOrigin,
          Phone: Phone ?? findUserWithId?.Phone,
          BirthDate: BirthDate ?? findUserWithId?.BirthDate,
          gender: gender ?? findUserWithId?.gender,
          role: role ?? findUserWithId?.role,
          status: status ?? findUserWithId?.status,
          photo_profile: photo_profile ?? findUserWithId?.photo_profile,
          religion: religion ?? findUserWithId?.religion,
        }
      );
      if (!update) throw new Error("Update failed");
    } else {
      throw new Error("Email already exists");
    }
    revalidatePath("/profile");
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const updateRole = async (id: string, data: FormData) => {
  try {
    const session = await nextGetServerSession();
    if (!session) {
      throw new Error("eror");
    }

    const role = data.get("role") as Role;
    const update = await prisma.user.update({where: {id: id} , data:{
      role
    }});
    if(!update){
      throw new Error("eror");

    }
    revalidatePath("/admin/studentData")
    return update
  } catch (error) {
    throw new Error((error as Error).message)
  }
};



export const UpdateTaskUser = async (id: RequestStatus, taskId: string, data: FormData) => {
  try {
    const session = await nextGetServerSession();
    if (!session) {
      throw new Error("Error while getting session");
    }
    const userAuthTask = data.get("userAuthTask") === "on";

    const update = await prisma.task.update({
      where: { id: taskId },
      data: {
        userAuthTask: userAuthTask,
        status:id,
      }
    });

    if (!update) {
      throw new Error("Error while updating data");
    }
    revalidatePath("/checklist");
    revalidatePath("/");
    return update;
  } catch (err) {
    console.error(err); 
    throw new Error((err as Error).message);
  }
};
export const UpdateTaskTeacher = async (id:RequestStatus , taskId: string, data: FormData) => {
  try {
    const session = await nextGetServerSession();
    if (!session) {
      throw new Error("Error while getting session");
    }
    const teacherAuth = data.get("teacherAuth") === "on";

    const update = await prisma.task.update({
      where: { id: taskId },
      data: {
        teacherAuth: teacherAuth,
        status:id,
      }
    });

    if (!update) {
      throw new Error("Error while updating data");
    }
    revalidatePath("/checklist");
    revalidatePath("/");
    return update;
  } catch (err) {
    console.error(err); 
    throw new Error((err as Error).message);
  }
};


export const UpdateGeneralProfileById = async (data: FormData) => {
  try {
    const session = await nextGetServerSession();

    const id = session?.user?.id;

    const email = data.get("email") as string;
    const photo_profile = data.get("photo_profile") as string;
    const name = data.get("name") as string;
    const role = data.get("role") as Role;
    const clasess = data.get("clasess") as string;
    const absent = data.get("absent") as string;
    const Phone = data.get("Phone") as string;
    const NIS = data.get("NIS") as string;
    const NISN = data.get("NISN") as string;
    const schoolOrigin = data.get("schoolOrigin") as string;
    const status = data.get("status") as Status;
    const BirthDate = data.get("BirthDate") as string;
    const religion = data.get("religion") as Religion;
    const gender = data.get("gender") as Gender;

    if (!id) {
      const create = await createUser({
        email,
        photo_profile,
        name,
        role,
        clasess,
        absent,
        NIS,
        NISN,
        Phone,
        schoolOrigin,
        status,
        BirthDate,
        religion,
        gender,
      });
      if (!create) throw new Error("Failed to create");
    } else if (id) {
      const findUserWithId = await prisma.user.findUnique({
        where: { id },
      });

      const update = await updateUser(
        { id: id ?? findUserWithId?.id },
        {
          email: email ?? findUserWithId?.email,
          name: name ?? findUserWithId?.name,
          absent: absent ?? findUserWithId?.absent,
          clasess: clasess ?? findUserWithId?.clasess,
          NIS: NIS ?? findUserWithId?.NIS,
          NISN: NISN ?? findUserWithId?.NISN,
          schoolOrigin: schoolOrigin ?? findUserWithId?.schoolOrigin,
          Phone: Phone ?? findUserWithId?.Phone,
          BirthDate: BirthDate ?? findUserWithId?.BirthDate,
          role: role ?? findUserWithId?.role,
          status: status ?? findUserWithId?.status,
          photo_profile: photo_profile ?? findUserWithId?.photo_profile,
          religion: religion ?? findUserWithId?.religion,
        }
      );
      if (!update) throw new Error("Update failed");
    } else {
      throw new Error("Email already exists");
    }
    revalidatePath("/profile");
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};




