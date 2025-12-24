import { redirect } from "next/navigation";

export default function DashboardContactMentorPage() {
  // Provide a stable route that sends students to the messaging/support entrypoint.
  redirect("/dashboard/feedback");
}
