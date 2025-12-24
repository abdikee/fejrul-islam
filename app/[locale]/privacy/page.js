import { redirect } from "next/navigation";

export default function PrivacyPage() {
  // Placeholder page so footer/signup links never 404.
  // If you later add a real privacy policy page in CMS, replace this redirect.
  redirect("/contact");
}
