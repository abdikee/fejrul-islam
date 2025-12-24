import { redirect } from "next/navigation";

export default function DashboardHelpPage() {
  // Provide a stable help route for nav/links.
  redirect("/dashboard/feedback");
}
