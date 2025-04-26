'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/axios'; // axios instance
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Validasi Zod
const FormSchema = z.object({
  username: z.string().min(3, { message: 'Username minimal 3 karakter' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
});

// type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
  //   resolver: zodResolver(schema),
  // });

  const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
            // Step 1: Login ➔ ambil token
            const loginRes = await api.post('api/auth/login', {
              username: values.username,
              password: values.password,
            });
      
            const token = loginRes.data.token;
            console.log('TOKEN DAPAT:', token);
      
            if (!token) {
              setError('Login gagal. Token tidak ditemukan.');
              return;
            }
      
            localStorage.setItem('token', token); // Simpan token
      
            // Step 2: Ambil profile
            const profileRes = await api.get('api/auth/profile', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
      
            console.log('PROFILE:', profileRes.data);
      
            const profileData = profileRes.data;
      
              let role = '';
              if (profileData?.data?.role) {
                role = profileData.data.role;
              } else if (profileData?.role) {
                role = profileData.role;
              }
      
      if (!role) {
        setError('Login gagal. Role tidak ditemukan.');
        return;
      }
      
      localStorage.setItem('role', role);
      
      
            // Step 3: Redirect berdasarkan role
            if (role === 'Admin') {
              router.push('/admin');
            } else {
              router.push('/articles');
            }
          } catch (err: any) {
            console.error('ERROR:', err.response?.data);
      
            if (err.response) {
              if (err.response.status === 401) {
                setError('Username atau Password salah.');
              } else if (err.response.status === 404) {
                setError('Endpoint tidak ditemukan.');
              } else {
                setError(err.response.data.message || 'Login gagal.');
              }
            } else if (err.request) {
              setError('Tidak dapat terhubung ke server.');
            } else {
              setError('Terjadi kesalahan.');
            }
          }
        };
  

//   const onSubmit = async (data: FormData) => {
//     setError('');
//     try {
//       // Step 1: Login ➔ ambil token
//       const loginRes = await api.post('api/auth/login', {
//         username: data.username,
//         password: data.password,
//       });

//       const token = loginRes.data.token;
//       console.log('TOKEN DAPAT:', token);

//       if (!token) {
//         setError('Login gagal. Token tidak ditemukan.');
//         return;
//       }

//       localStorage.setItem('token', token); // Simpan token

//       // Step 2: Ambil profile
//       const profileRes = await api.get('api/auth/profile', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       console.log('PROFILE:', profileRes.data);

//       const profileData = profileRes.data;

//         let role = '';
//         if (profileData?.data?.role) {
//           role = profileData.data.role;
//         } else if (profileData?.role) {
//           role = profileData.role;
//         }

// if (!role) {
//   setError('Login gagal. Role tidak ditemukan.');
//   return;
// }

// localStorage.setItem('role', role);


//       // Step 3: Redirect berdasarkan role
//       if (role === 'Admin') {
//         router.push('/admin');
//       } else {
//         router.push('/articles');
//       }
//     } catch (err: any) {
//       console.error('ERROR:', err.response?.data);

//       if (err.response) {
//         if (err.response.status === 401) {
//           setError('Username atau Password salah.');
//         } else if (err.response.status === 404) {
//           setError('Endpoint tidak ditemukan.');
//         } else {
//           setError(err.response.data.message || 'Login gagal.');
//         }
//       } else if (err.request) {
//         setError('Tidak dapat terhubung ke server.');
//       } else {
//         setError('Terjadi kesalahan.');
//       }
//     }
//   };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
    //   <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
    //     <h1 className="text-2xl font-semibold text-center text-blue-700 mb-6">👋 Logoipsum</h1>

    //     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
    //       {/* Username */}
    //       <div>
    //         <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
    //         <input
    //           type="text"
    //           placeholder="Masukkan username"
    //           {...register('username')}
    //           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
    //         />
    //         {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
    //       </div>

    //       {/* Password */}
    //       <div className="relative">
    //         <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
    //         <input
    //           type={showPassword ? 'text' : 'password'}
    //           placeholder="Masukkan password"
    //           {...register('password')}
    //           className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black pr-10"
    //         />
    //         <div
    //           onClick={() => setShowPassword(!showPassword)}
    //           className="absolute right-3 top-10 transform -translate-y-1/2 cursor-pointer text-gray-400"
    //         >
    //           {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    //         </div>
    //         {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
    //       </div>

    //       {/* Error Message */}
    //       {error && <p className="text-red-500 text-sm text-center">{error}</p>}

    //       {/* Button */}
    //       <button
    //         type="submit"
    //         disabled={isSubmitting}
    //         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
    //       >
    //         {isSubmitting ? 'Memproses...' : 'Login'}
    //       </button>
    //     </form>

    //     {/* Link ke Register */}
    //     <p className="text-sm text-gray-600 mt-6 text-center">
    //       Don't have an account?{' '}
    //       <a href="/register" className="text-blue-600 hover:underline">Register</a>
    //     </p>
    //   </div>
    // </div>
    <div className='h-screen flex items-center justify-center'>
    <Card className="flex max-h-96 w-96 items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <CardHeader className='w-full'>
        <CardTitle className="text-2xl font-semibold text-center text-blue-700 mb-6">👋 Logoipsum</CardTitle>
      </CardHeader>
      {/* <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"> */}
      <CardContent className='w-full'>

    <Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="w-full flex flex-col gap-4"
			>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input
									placeholder="Username"
									className="w-full p-2 mt-8 rounded-xl border"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem className="relative">
							<FormControl>
								<Input
									placeholder="Password"
									type={showPassword ? 'text' : 'password'}
									className="p-2 rounded-xl border w-full"
									{...field}
								/>
							</FormControl>
							<Button
								variant="ghost"
								className="absolute hover:bg-inherit right-0 -top-2 text-gray-400 text-sm"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<Eye className="w-4 h-4" />
								) : (
									<EyeOff className="w-4 h-4" />
								)}
							</Button>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					type="submit"
					className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
				>
					Login
				</Button>
			</form>
		</Form>
    </CardContent>

{/* Link ke Register */}
  <CardFooter>
     <p className="text-sm text-gray-600 mt-6 text-center">
           Don't have an account?{' '}
           <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
      </p>
       {/* </div> */}
  </CardFooter>
   </Card>
    </div>
  );
}
