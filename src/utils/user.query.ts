import { Task, Prisma, RequestStatus } from "@prisma/client";
import prisma from "./../lib/prisma";
import { userFullPayload } from "./relationsip";

export const findAllUsers = async (filter?: Prisma.UserWhereInput) => {
  return await prisma.user.findMany({
    where: filter,
    include: { userAuth: { select: { last_login: true } }, TaskUser:true, Teacher:true, Student:true, classTeacher:true, TaskTeacher:true},
  });
};

export const findUser = async (filter: Prisma.UserWhereInput) => {
  return await prisma.user.findFirst({
    where: filter,
    include: { userAuth: { select: { last_login: true } }, TaskUser:true, Teacher: true, Student:true, classTeacher:true, TaskTeacher:true},
  });
};

export const findTaskList = async( filter: Prisma.taskListWhereInput)=>{
  return await prisma.taskList.findMany({
    where:filter
  })
}

export const findUserAuth = async (email: string) => {
  return await prisma.userAuth.findUnique({ where: { userEmail: email } });
};

export const createUser = async (data: Prisma.UserUncheckedCreateInput) => {
  return await prisma.user.create({ data });
};
export const createTaskUser = async (data: Prisma.TaskUncheckedCreateInput) => {
  return await prisma.task.create({ data });
};

export const UpdateTaskUser=async (where:Prisma.TaskWhereUniqueInput, update:Prisma.TaskUncheckedUpdateInput)=>{
  return await prisma.task.update({ where, data:update });
}

export const updateUser = async (where: Prisma.UserWhereUniqueInput, update: Prisma.UserUncheckedUpdateInput) => {
  return await prisma.user.update({ where, data: update });
};

export const findTaskIdWithName=async(where: Prisma.TaskWhereInput)=>{
  return await prisma.task.findFirst({where})
}

export const updateUserAuth = async (where: Prisma.UserAuthWhereUniqueInput, update: Prisma.UserAuthUncheckedUpdateInput) => {
  return await prisma.userAuth.update({ where, data: update });
};

export const deleteUser = async (user_id: string) => {
  return await prisma.user.delete({ where: { id: user_id } });
};

