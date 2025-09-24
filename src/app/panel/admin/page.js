"use client";

import PanelButton from '../PanelButton';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PanelLayout from '../PanelLayout';

export default function AdminPanel() {
  const [allowedPanels, setAllowedPanels] = useState([]);
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const code = sessionStorage.getItem('panelCode');
    if (!code) {
      router.push('/panel/login');
      return;
    }
    (async () => {
      try {
        const res = await fetch('/api/panel/get-access');
        const data = await res.json();
        if (!Array.isArray(data)) {
          setAllowedPanels([]);
          setRole('');
          router.push('/panel/login');
          return;
        }
        const found = data.find(item => item.code === code);
        setAllowedPanels(found && found.panels ? found.panels : []);
        setRole(found && found.role ? found.role : '');
        if (!(found && found.panels && found.panels.includes('admin'))) {
          router.push('/panel/login');
        }
      } catch (err) {
        setAllowedPanels([]);
        setRole('');
        router.push('/panel/login');
      }
    })();
  }, [router]);

  return (
    <PanelLayout title="פאנל אדמין" role={role}>
      <div className="w-full grid grid-cols-2 gap-4">
        {(() => {
          const buttons = [
            { href: "/panel/access", label: "ניהול גישות", className: "bg-gray-700 hover:bg-gray-800 text-gray-200" },
            { href: "/panel/admin/credits", label: "ניהול קרדיטים בפוטר", className: "bg-blue-700 hover:bg-blue-800 text-blue-200" },
          ];
          const rows = [];
          for (let i = 0; i < buttons.length; i += 2) {
            const row = buttons.slice(i, i + 2);
            row.forEach((btn, j) => {
              rows.push(
                <PanelButton
                  as="a"
                  href={btn.href}
                  key={btn.href}
                  className={
                    `text-xl text-center rounded-lg shadow-md font-bold ${btn.className}` +
                    (row.length === 1 ? " col-span-2" : "")
                  }
                >
                  {btn.label}
                </PanelButton>
              );
            });
          }
          return rows;
        })()}
      </div>
    </PanelLayout>
  );
}
