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
export const ROOT_URL = process.env.NEXT_PUBLIC_SITE_URL
  ? `https://${process.env.NEXT_PUBLIC_SITE_URL}`
  : "http://localhost:3000";
