import { redirect } from "next/navigation";

// Root page — redirect to chat
export default function HomePage() {
  redirect("/chat");
}
