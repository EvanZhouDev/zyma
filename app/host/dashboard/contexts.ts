import { createContext } from "react";
export type AttendeeMetadata = {
	attendanceHistory: { [key: string]: [string, number] };
	customProperties: { [key: string]: string };
};
export type Attendee = {
	email: string;
	username: string;
	metadata: AttendeeMetadata;
	id: string;
	group: number;
};

export const AttendeesInClassContext = createContext<Attendee[]>([]);
