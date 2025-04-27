"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

// Validasi form
const FormSchema = z.object({
  username: z.string().min(3, { message: "Username minimal 3 karakter" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setError("");

    try {
      const res = await axios.post("/api/admin/login", values); // 🔥 endpoint API admin
      const { user } = res.data;

      // Simpan ke localStorage
      localStorage.setItem("username", user.username);
      localStorage.setItem("role", user.role);

      if (user.role === "Admin") {
        router.push("/admin/dashboard"); // 🔥 masuk ke dashboard admin
      } else {
        setError("Kamu bukan admin.");
      }
    } catch (err: any) {
      console.error("Login Admin Error:", err.response?.data);
      setError(err.response?.data?.message || "Login gagal.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-96 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader className="flex flex-col items-center justify-center space-y-2">
          <img src="/assets/logoipsum.svg" alt="Logo" className="w-32 h-auto" />
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Username" {...field} />
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
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 text-gray-400 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <p className="text-red-500 text-center text-sm">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
              >
                Login Admin
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter>
          <p className="text-sm text-gray-600 text-center w-full">
            Belum punya akun?{" "}
            <Link
              href="/admin/register"
              className="text-blue-600 hover:underline"
            >
              Daftar Admin
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
