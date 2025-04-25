'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Lock, Mail, User } from 'lucide-react';

// Validasi form
const schema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
  role: z.enum(['user', 'admin'], {
    required_error: 'Role wajib dipilih',
  }),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post('https://test-fe.mysellerpintar.com/api/register', data);
      setSuccess('Registrasi berhasil! Silakan login.');
      setError('');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
        console.log('REGISTER ERROR:', err);
      
        if (axios.isAxiosError(err)) {
          const message = err.response?.data?.message || 'Registrasi gagal (server error)';
          setError(message);
        } else {
          setError('Terjadi kesalahan yang tidak terduga');
        }
      
        setSuccess('');
      }      
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-blue-700 mb-6">Register</h1>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4 bg-red-50 border border-red-300 p-2 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 text-sm text-center mb-4 bg-green-50 border border-green-300 p-2 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                {...register('email')}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              />

            </div>
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                {...register('password')}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              />
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                {...register('role')}
                className="w-full pl-10 pr-3 py-2 border rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">-- Pilih Role --</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role.message}</p>}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            {isSubmitting ? 'Memproses...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600">
          Sudah punya akun? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
