"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Eye, EyeOff } from "lucide-react";

import api from "@/lib/axios";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchema = z.object({
  username: z.string().min(3, { message: "Username minimal 3 karakter" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  role: z.enum(["User", "Admin"], { required_error: "Role wajib dipilih" }),
});

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
      role: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setError("");
    setSuccess("");

    try {
      await api.post("api/auth/register", values);
      setSuccess("Registrasi berhasil! Silakan login.");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      console.error("REGISTER ERROR:", err.response?.data);
      setError(err.response?.data?.message || "Registrasi gagal.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="w-96 bg-gradient-to-br from-blue-50 to-white">
        <CardHeader className="flex flex-col items-center justify-center space-y-2">
          <img
            src="/assets/logoipsum.svg"
            alt="Logoipsum"
            className="w-30 h-30"
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
                        className="w-full p-2 rounded-xl border"
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
                        className="w-full p-2 rounded-xl border pr-10"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute right-2 top-0 text-gray-400 text-sm hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full p-2 rounded-xl border">
                          <SelectValue placeholder="-- Pilih Role --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="User">User</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              {success && (
                <p className="text-green-600 text-sm text-center">{success}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
              >
                Register
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter>
          <p className="text-sm text-gray-600 text-center w-full">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
