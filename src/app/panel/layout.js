"use client";
import { useEffect, useState } from "react";
import { getPanelsForCode } from "./access.js";
import { useRouter, usePathname } from "next/navigation";

export default function PanelLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (pathname === "/panel/login") {
      setChecked(true);
      return;
    }
    const code = sessionStorage.getItem("panelCode");
    const panels = code ? getPanelsForCode(code) : [];
    if (!code || panels.length === 0) {
      router.push("/panel/login");
    } else {
      setChecked(true);
    }
  }, [router, pathname]);

  if (!checked) {
    // מציג Loader רק אם לא ב-/panel/login
    return (
      <div className="flex items-center justify-center min-h-[200px] text-lg text-gray-400">
        טוען...
      </div>
    );
  }
  return <>{children}</>;
}
