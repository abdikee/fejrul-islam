import { redirect } from "next/navigation";

export default function PublicStudyGroupsPage() {
  // Public route kept for compatibility; the actual UI lives in the dashboard.
  redirect("/dashboard/study-groups");
}
