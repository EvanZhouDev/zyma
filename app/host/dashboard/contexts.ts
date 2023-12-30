import { createContext } from "react";
export type Metadata = {
	attendanceHistory: { [key: string]: [string, number] };
	customProperties: { [key: string]: string };
};
export type Attendee = {
	email: string;
	username: string;
	metadata: Metadata;
	id: string;
	group: number;
};

export const AttendeesInClassContext = createContext<Attendee[]>([]);
