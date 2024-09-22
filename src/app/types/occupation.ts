import { Role } from "@prisma/client";

export interface occupationProps {
  occupation: string;
  value: Role;
  id: number;
}

export const occupation: occupationProps[] = [
  {
    occupation: "Teacher",
    value: "GURU",
    id: 1,
  },
  {
    occupation: "Student",
    value: "SISWA",
    id: 2,
  },
];
