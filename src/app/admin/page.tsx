'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [role, setRole] = useState(''); // 👈 ini penting
  const [email, setEmail] = useState(''); // 👈 ini juga penting

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
      router.push('/login');
    } else {
      setRole(role || '');
      const userEmail = token.split('_')[1];
      setEmail(userEmail);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-purple-700">⚙️ Admin Dashboard</h1>
      <p className="text-gray-700">Login sebagai <strong>{role}</strong> ({email})</p>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
