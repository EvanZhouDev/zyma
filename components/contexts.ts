import { createContext } from "react";
export type Metadata = { attendence?: [number, number] };
export type Student = { email: string; username: string; metadata?: Metadata };

export const StudentsInClassContext = createContext<Student[]>([]);
