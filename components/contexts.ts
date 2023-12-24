import { createContext } from "react";
export type Metadata = { attendence?: [number, number] };
export type Attendee = { email: string; username: string; metadata?: Metadata };

export const StudentsInClassContext = createContext<Attendee[]>([]);
