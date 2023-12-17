export const ATTENDENCE_STATUS_PRESENT = 0;
export const STATUS_MAP = { 0: "Present" };
export function convertStatus(status: number) {
	if (status === 0) return "Present";
	if (status === 1) return "Doctor's Appointment";
	if (status === 2) return "Family Issues";
	if (status === 3) return "Busy With Other Clubs";
	if (status === 4) return "Homework";
	if (status === 5) return "Other";
	return "Absent";
}
