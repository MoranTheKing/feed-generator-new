"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <main className="flex flex-1 flex-col items-center justify-center p-8 bg-transparent text-white">
      <div className="max-w-xl w-full bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col gap-8 items-center">
        <h1 className="text-4xl mb-4 font-bold">פאנל עורך פיד</h1>
        <p className="text-xl text-gray-400 mb-8">דרגתך: {role || '---'}</p>
      </div>
    </main>
  );
}
