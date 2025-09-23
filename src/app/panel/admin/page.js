"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <main className="flex flex-1 flex-col items-center justify-center p-8 bg-transparent text-white">
      <div className="max-w-xl w-full bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col gap-8 items-center">
        <h1 className="text-4xl mb-4 font-bold">פאנל אדמין</h1>
        <p className="text-xl text-gray-400 mb-8">דרגתך: {role || '---'}</p>
        <div className="w-full grid grid-cols-1 gap-6">
          <Link href="/panel/access" className="block w-full border border-gray-500 text-gray-300 font-semibold py-4 rounded text-center text-xl hover:bg-gray-700 transition" style={{background:'transparent'}}>
            ניהול גישות
          </Link>
        </div>
      </div>
    </main>
  );
}
