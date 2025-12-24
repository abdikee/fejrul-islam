import { redirect } from "next/navigation";

export default function MentorSessionsSchedulePage() {
  // Header links to "schedule session"; redirect to sessions page until scheduling UI exists.
  redirect("/mentor/sessions");
}
