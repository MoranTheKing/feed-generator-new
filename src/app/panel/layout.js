"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PanelLayout({ children }) {
  const [allowed, setAllowed] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      // אל תגביל את דף הלוגין
      if (window.location.pathname === "/panel/login") {
        setAllowed(true);
        return;
      }
      const code = sessionStorage.getItem("panelCode");
      if (!code) {
        setAllowed(false);
        router.push("/panel/login");
        return;
      }
      try {
        const res = await fetch("/api/panel/get-access");
        const data = await res.json();
        const found = Array.isArray(data) ? data.find((item) => item.code === code) : null;
        if (found && found.panels.length > 0) {
          setAllowed(true);
        } else {
          setAllowed(false);
          router.push("/panel/login");
        }
      } catch {
        setAllowed(false);
        router.push("/panel/login");
      }
    };

    checkAccess();

    const handleFocus = () => checkAccess();
    const handleStorage = (e) => {
      if (e.key === "panelCode") checkAccess();
    };
    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, [router]);

  if (allowed === null) {
    return null;
  }
  if (allowed === false) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-8 bg-transparent text-white">
        <div className="max-w-xl w-full bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col gap-8 items-center">
          <h1 className="text-3xl mb-4 font-bold text-red-500">אין לך הרשאה</h1>
          <p className="text-lg text-gray-300">גישה לאזור זה מותרת רק למשתמשים עם גישה לפחות לפאנל אחד.</p>
        </div>
      </main>
    );
  }
  return <>{children}</>;
}
