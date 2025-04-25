'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';

const schema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Minimal 6 karakter' }),
});

type FormData = z.infer<typeof schema>;

const dummyUsers = [
  { email: 'admin@example.com', password: 'Admin123!', role: 'admin' },
  { email: 'user@example.com', password: 'User123!', role: 'user' },
];


export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // const onSubmit = async (data: FormData) => {
  //   try {
  //     const response = await axios.post('https://test-fe.mysellerpintar.com/api/login', data);
  //     localStorage.setItem('token', response.data.data.token);
  //     router.push('/articles');
  //   } catch (err: any) {
  //     setError(err.response?.data?.message || 'Login gagal');
  //   }
  // };
  const onSubmit = async (data: FormData) => {
    setError('');
  
    const user = dummyUsers.find(
      (u) => u.email === data.email && u.password === data.password
    );
  
    if (!user) {
      setError('Email atau password salah');
      return;
    }
  
    // Simulasi "token"
    const fakeToken = 'token_' + user.email;
    localStorage.setItem('token', fakeToken);
    localStorage.setItem('role', user.role);
  
    router.push('/articles');
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-blue-700 mb-6">Welcome Back 👋</h1>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800" size={18} />
              <input
                type="email"
                {...register('email')}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              />
            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800" size={18} />
              <input
                type="password"
                {...register('password')}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            {isSubmitting ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Belum punya akun? <a href="/register" className="text-blue-600 hover:underline">Daftar</a>
        </p>
      </div>
    </div>
  );
}
