"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";

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
import Link from "next/link";
import axios from "axios";

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
      const res = await axios.post("/api/admin/login", values);
      const { user } = res.data;

      localStorage.setItem("username", user.username);
      localStorage.setItem("role", user.role);

      if (user.role === "Admin") {
        router.push("/admin");
      } else {
        router.push("/articles");
      }
    } catch (err: any) {
      console.error("Login Error:", err.response?.data);
      setError(err.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <Card className="w-full max-w-sm p-6">
        <CardHeader className="flex flex-col items-center justify-center">
          <img
            src="/assets/logoipsum.svg"
            alt="Logo"
            className="w-30 h-30 object-contain mb-4"
          />
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
                      <Input
                        placeholder="Username"
                        className="rounded-lg"
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
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="rounded-lg pr-10"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute right-2 top-0 text-gray-400 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
              >
                Login
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center mt-2">
          <p className="text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              href="/admin/register"
              className="text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
