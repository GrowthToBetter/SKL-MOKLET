import { Prisma } from "@prisma/client";

export type userWithLastLogin = Prisma.UserGetPayload<{
  include: { userAuth: { select: { last_login: true } }, TaskUser:true, Teacher:true, Student:true };
}>;

export type userFullPayload = Prisma.UserGetPayload<{
  include: {TaskUser: true, Teacher:true, Student:true}
}>;
export type teacherFullPayload = Prisma.UserGetPayload<{
  include: {Teacher: true, Student:true}
}>;