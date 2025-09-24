"use client";
import { getPanelsForCode } from "../access.js";
import { useRouter } from "next/navigation";

export default function FeedLayout({ children }) {
  const router = useRouter();
  const code = typeof window !== 'undefined' ? sessionStorage.getItem("panelCode") : null;
  const panels = code ? getPanelsForCode(code) : [];
  if (typeof window !== 'undefined' && (!code || !panels.includes("feed"))) {
    router.push("/panel/login");
    return null;
  }
  return <>{children}</>;
}
