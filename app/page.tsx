import { redirect } from "next/navigation"

export default function Home() {
  redirect("/rules")
  return null
}