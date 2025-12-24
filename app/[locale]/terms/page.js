import { redirect } from "next/navigation";

export default function TermsPage() {
  // Placeholder page so footer/signup links never 404.
  // If you later add real terms content, replace this redirect.
  redirect("/contact");
}
