'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ArticlesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Tambahkan loading supaya tunggu localStorage ready

  useEffect(() => {
    const checkAuth = () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      console.log('TOKEN CHECK:', token); // Log token di console

      if (!token) {
        router.push('/login');
      } else {
        setLoading(false); // Kalau token ada, stop loading
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-blue-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold text-blue-700">📰 List Artikel Berhasil!</h1>
    </div>
  );
}
