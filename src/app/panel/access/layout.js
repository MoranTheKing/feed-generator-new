"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AccessLayout({ children }) {
  const [allowed, setAllowed] = useState(null);
  const router = useRouter();

  const pathname = usePathname();
  useEffect(() => {
    const checkAccess = async () => {
      const code = sessionStorage.getItem("panelCode");
      console.log('[DEBUG] access/layout: panelCode from sessionStorage:', code);
      if (!code) {
        console.log('[DEBUG] access/layout: Not connected, redirecting to login');
        setAllowed(false);
        router.push("/panel/login");
        return;
      }
      try {
        const res = await fetch("/api/panel/get-access");
        const data = await res.json();
        const found = Array.isArray(data) ? data.find((item) => item.code === code) : null;
        console.log('[DEBUG] access/layout: found entry:', found);
        if (found && (found.panels.includes("admin") || found.panels.includes("leader"))) {
          console.log('[DEBUG] access/layout: Access granted for code', code, 'with panels', found.panels);
          setAllowed(true);
        } else {
          console.log('[DEBUG] access/layout: Access denied for code', code, 'with panels', found ? found.panels : null);
          setAllowed(false);
          router.push("/panel/login");
        }
      } catch (err) {
        console.log('[DEBUG] access/layout: Error during access check', err);
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
  }, [router, pathname]);

  if (allowed === null) {
    return null;
  }
  if (allowed === false) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-8 bg-transparent text-white">
        <div className="max-w-xl w-full bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col gap-8 items-center">
          <h1 className="text-3xl mb-4 font-bold text-red-500">אין לך הרשאה</h1>
          <p className="text-lg text-gray-300">גישה לדף זה מותרת רק לאדמין או ראש צוות.</p>
        </div>
      </main>
    );
  }
  return <>{children}</>;
}
