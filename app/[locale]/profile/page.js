import { redirect } from "next/navigation";

export default function ProfilePage() {
  // The UI links to /profile, but profile management lives under dashboard settings.
  redirect("/dashboard/settings");
}
