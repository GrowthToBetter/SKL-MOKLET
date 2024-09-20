import { Prisma } from "@prisma/client";

export type userWithLastLogin = Prisma.UserGetPayload<{
  include: { userAuth: { select: { last_login: true } }, TaskUser:true };
}>;

export type userFullPayload = Prisma.UserGetPayload<{
  include: {TaskUser: true}
}>;
export type teacherFullPayload = Prisma.UserGetPayload<{
  include: {Teacher: true}
}>;