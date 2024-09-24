import { Prisma } from "@prisma/client";

export type userWithLastLogin = Prisma.UserGetPayload<{
  include: { userAuth: { select: { last_login: true} }, TaskUser:{include:{user:true, task:true}}, Student:true, TaskTeacher:true,Teacher:true , classTeacher:true};
}>;

export type userFullPayload = Prisma.UserGetPayload<{
  include: {TaskUser: {include:{user:true, task:true}}, Student:true, TaskTeacher:true, Teacher:true, classTeacher:true }
}>;
export type teacherFullPayload = Prisma.UserGetPayload<{
  include: {Teacher: true, Student:true, classTeacher:true, TaskTeacher:true}
}>;
