"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PanelLayout from '../PanelLayout';
import PanelButton from '../PanelButton';

export default function FeedPanel() {
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const code = sessionStorage.getItem('panelCode');
    if (!code) {
      router.push('/panel/login');
      return;
    }
    try {
      const accessList = require('../access.json');
      const found = accessList.find(item => item.code === code);
      setRole(found && found.role ? found.role : '');
      if (!(found && found.panels && found.panels.includes('feed'))) {
        router.push('/panel/login');
      }
    } catch (err) {
      setRole('');
      router.push('/panel/login');
    }
  }, [router]);

  return (
    <PanelLayout title="פאנל עורך פיד" role={role}>
      <div className="w-full grid grid-cols-2 gap-4">
        {(() => {
          const buttons = [
            { label: "פעולה לדוגמה", className: "bg-blue-700 hover:bg-blue-800 text-white" },
          ];
          const rows = [];
          for (let i = 0; i < buttons.length; i += 2) {
            const row = buttons.slice(i, i + 2);
            row.forEach((btn, j) => {
              rows.push(
                <PanelButton
                  key={btn.label}
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
