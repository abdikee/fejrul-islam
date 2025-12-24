import { redirect } from "next/navigation";

export default function MentorAssignmentsNewPage() {
  // Header links to "new assignment"; redirect to assignments list until creation UI exists.
  redirect("/mentor/assignments");
}
