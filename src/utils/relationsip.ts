import { Prisma } from "@prisma/client";

export type userWithLastLogin = Prisma.UserGetPayload<{
  include: { userAuth: { select: { last_login: true} }, TaskUser:{include:{user:true, task:true, DetailTask:true}}, Student:true, TaskTeacher:{include:{DetailTask:true, task:true, user:true}},Teacher:true };
}>;

export type userFullPayload = Prisma.UserGetPayload<{
  include: {TaskUser: {include:{user:true, task:true, DetailTask:true}}, Student:true, TaskTeacher:{include:{DetailTask:true, task:true, user:true}}, Teacher:true}
}>;
export type teacherFullPayload = Prisma.UserGetPayload<{
  include: {Teacher: true, Student:true, TaskTeacher:{include:{DetailTask:true, task:true, user:true}}}
}>;
export type TaskFullPayload = Prisma.TaskGetPayload<{
  include: {user:true, task:true, DetailTask:true}
}>;
