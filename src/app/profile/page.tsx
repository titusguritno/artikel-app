"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, ArrowLeft } from "lucide-react";
import axios from "axios";
import Logout from "@/components/modals/logout";
import Image from "next/image";
interface UserData {
  id: string;
  username: string;
  password: string;
  role: string;
}

const initialUserData: UserData = {
  id: "",
  username: "",
  password: "",
  role: "",
};

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData>(initialUserData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const savedPassword = localStorage.getItem("password") || "";

        if (!token) throw new Error("No token found. Please login.");

        const res = await axios.get(
          "https://test-fe.mysellerpintar.com/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.data || typeof res.data !== "object") {
          throw new Error("Invalid user data received.");
        }

        setUserData({
          ...res.data,
          password: savedPassword,
        });
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          setError(err.message || "Failed to fetch user");
        } else {
          setError("Failed to fetch user");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleBack = () => {
    const role = localStorage.getItem("role");

    if (role === "Admin") {
      router.push("/admin/articles");
    } else {
      router.push("/articles");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("role");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={handleBack}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Modal Logout */}
      <Logout
        open={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
      />

      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
        <div className="flex items-center gap-2">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-gray-700 hover:text-black transition-all"
            onClick={handleBack}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-500 rounded-md"
              >
                <Avatar className="w-8 h-8 bg-blue-200">
                  <AvatarFallback className="text-gray-700 font-semibold text-sm">
                    {userData.username
                      ? userData.username.charAt(0).toUpperCase()
                      : "G"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-bold text-black underline">
                  {userData.username || "Guest"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 rounded-md shadow-md bg-white py-2"
            >
              <DropdownMenuItem
                className="text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => router.push("/profile")}
              >
                My Account
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-sm text-red-500 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                onClick={() => setIsLogoutOpen(true)}
              >
                <LogOut size={16} /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Profile Content */}
      <main className="flex-1 flex justify-center items-center bg-gray-100 p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">
              User Profile
            </h2>

            <div className="flex flex-col items-center mb-6">
              <Avatar className="w-16 h-16 bg-blue-200">
                <AvatarFallback className="text-blue-700 font-bold text-xl">
                  {userData.username
                    ? userData.username.charAt(0).toUpperCase()
                    : "G"}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <Input type="text" value={userData.username} readOnly />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input type="text" value={userData.password} readOnly />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <Input type="text" value={userData.role} readOnly />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white py-6">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/assets/logoipsum2.svg"
            alt="Logoipsum"
            width={100}
            height={100}
          />
          <p className="text-sm">© 2025 Blog genzet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
