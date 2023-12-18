export const ATTENDENCE_STATUS_PRESENT = 0;
export const STATUS_MAP = { 0: "Present" };
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
export const ROOT_URL = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "http://localhost:3000";
