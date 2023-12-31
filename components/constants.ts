export const STATUS_TO_NUMBER = {
	Present: 0,
	Doctor: 1,
	Family: 2,
	Clubs: 3,
	Homework: 4,
	Other: 5,
	Absent: 6,
};
export function convertStatus(status: number) {
	switch (status) {
		case 0:
			return "Present";
		case 1:
			return "Doctor's Appointment";
		case 2:
			return "Family Issues";
		case 3:
			return "Busy With Other Clubs";
		case 4:
			return "Homework";
		case 5:
			return "Other";
		default:
			return "Absent";
	}
}
export function convertRole(role: string): 0 | 1 {
	if (role === "HOST") {
		return 0;
	}
	if (role === "ATTENDEE") {
		return 1;
	}
	throw new Error("Invalid role");
}
export const ROOT_URL = process.env.NEXT_PUBLIC_SITE_URL
	? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
	: "http://localhost:3000";
