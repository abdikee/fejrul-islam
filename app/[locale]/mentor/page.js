import { redirect } from 'next/navigation';

export default function MentorPage({ params }) {
  redirect(`/${params.locale}/mentor/dashboard`);
}