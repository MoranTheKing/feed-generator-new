"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const [allowed, setAllowed] = useState(null); // null: לא נבדק, true: אדמין, false: לא אדמין
  const router = useRouter();

  const pathname = usePathname();
  useEffect(() => {
    const checkAccess = async () => {
      const code = sessionStorage.getItem("panelCode");
      console.log('[DEBUG] admin/layout: panelCode from sessionStorage:', code);
      if (!code) {
        console.log('[DEBUG] admin/layout: Not connected, redirecting to login');
        setAllowed(false);
        router.push("/panel/login");
        return;
      }
      try {
        const res = await fetch("/api/panel/get-access");
        const data = await res.json();
        const found = Array.isArray(data) ? data.find((item) => item.code === code) : null;
        console.log('[DEBUG] admin/layout: found entry:', found);
        if (found && found.panels.includes("admin")) {
          console.log('[DEBUG] admin/layout: Access granted for code', code, 'with panels', found.panels);
          setAllowed(true);
        } else {
          console.log('[DEBUG] admin/layout: Access denied for code', code, 'with panels', found ? found.panels : null);
          setAllowed(false);
          router.push("/panel/login");
        }
      } catch (err) {
        console.log('[DEBUG] admin/layout: Error during access check', err);
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
    return null; // טוען הרשאות
  }
  if (allowed === false) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-8 bg-transparent text-white">
        <div className="max-w-xl w-full bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col gap-8 items-center">
          <h1 className="text-3xl mb-4 font-bold text-red-500">אתה לא אדמין</h1>
          <p className="text-lg text-gray-300">אין לך הרשאה לגשת לפאנל זה.</p>
        </div>
      </main>
    );
  }
  return <>{children}</>;
}
