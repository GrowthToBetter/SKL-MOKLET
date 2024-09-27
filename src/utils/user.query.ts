import { Task, Prisma, RequestStatus } from "@prisma/client";
import prisma from "./../lib/prisma";


export const findAllUsers = async (filter?: Prisma.UserWhereInput) => {
  return await prisma.user.findMany({
    where: filter,
    include: { userAuth: { select: { last_login: true } }, TaskUser:{include:{DetailTask:true}}, Teacher:true, Student:true, TaskTeacher:{include:{DetailTask:true}}},
  });
};

export const findUser = async (filter: Prisma.UserWhereInput) => {
  return await prisma.user.findFirst({
    where: filter,
    include: { userAuth: { select: { last_login: true } }, TaskUser:{include:{DetailTask:true}}, Teacher: true, Student:true, TaskTeacher:{include:{DetailTask:true}}},
  });
};


export const findUserAuth = async (email: string) => {
  return await prisma.userAuth.findUnique({ where: { userEmail: email } });
};

export const findAllTask=async(filter: Prisma.TaskWhereInput)=>{
  return await prisma.task.findMany({
    where:filter,
    include:{user:true, task:true}
  })
}


export const createUser = async (data: Prisma.UserUncheckedCreateInput) => {
  return await prisma.user.create({ data });
};
export const createTaskUser = async (data: Prisma.TaskUncheckedCreateInput) => {
  return await prisma.task.create({ data });
};

export const createDetailUser=async(data:Prisma.DetailUncheckedCreateInput)=>{
  return await prisma.detail.create({ data });
}

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

