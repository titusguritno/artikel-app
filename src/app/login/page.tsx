"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Eye, EyeOff } from "lucide-react";

import api from "@/lib/axios"; // axios instance

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Validasi Zod
const FormSchema = z.object({
  username: z.string().min(3, { message: "Username minimal 3 karakter" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

// type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
  //   resolver: zodResolver(schema),
  // });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      // Step 1: Login ➔ ambil token
      const loginRes = await api.post("api/auth/login", {
        username: values.username,
        password: values.password,
      });

      const token = loginRes.data.token;
      console.log("TOKEN DAPAT:", token);

      if (!token) {
        setError("Login gagal. Token tidak ditemukan.");
        return;
      }

      localStorage.setItem("token", token); // Simpan token

      // Step 2: Ambil profile
      const profileRes = await api.get("api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("PROFILE:", profileRes.data);

      const profileData = profileRes.data?.data;
      const username = profileData?.username || profileData?.name;

      let role = "";
      if (profileData?.data?.role) {
        role = profileData.data.role;
      } else if (profileData?.role) {
        role = profileData.role;
      }

      if (!role) {
        setError("Login gagal. Role tidak ditemukan.");
        return;
      }

      localStorage.setItem("role", role);

      // Step 3: Redirect berdasarkan role
      if (role === "Admin") {
        router.push("/admin");
      } else {
        router.push("/articles");
      }
    } catch (err: any) {
      console.error("ERROR:", err.response?.data);

      if (err.response) {
        if (err.response.status === 401) {
          setError("Username atau Password salah.");
        } else if (err.response.status === 404) {
          setError("Endpoint tidak ditemukan.");
        } else {
          setError(err.response.data.message || "Login gagal.");
        }
      } else if (err.request) {
        setError("Tidak dapat terhubung ke server.");
      } else {
        setError("Terjadi kesalahan.");
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-96 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader className="flex flex-col items-center justify-center space-y-2">
          <img
            src="https://logoipsum.com/logo/logo-1.svg"
            alt="Logo"
            className="w-28 h-10"
          />
        </CardHeader>
        <CardContent className="w-full">
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
                        type={showPassword ? "text" : "password"}
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
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
          {/* </div> */}
        </CardFooter>
      </Card>
    </div>
  );
}
