"use client";
import { getPanelsForCode } from "./access.js";
import { useRouter } from "next/navigation";

export default function PanelLayout({ children }) {
  const router = useRouter();
  const code = typeof window !== 'undefined' ? sessionStorage.getItem("panelCode") : null;
  const panels = code ? getPanelsForCode(code) : [];
  if (typeof window !== 'undefined' && window.location.pathname !== "/panel/login" && (!code || panels.length === 0)) {
    router.push("/panel/login");
    return null;
  }
  return <>{children}</>;
}
