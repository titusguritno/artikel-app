"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import axios from "axios";

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please login.");
        }

        const res = await axios.get(
          "https://test-fe.mysellerpintar.com/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.data || typeof res.data !== "object") {
          throw new Error("Invalid user data received.");
        }

        // Ambil password dari localStorage
        const savedPassword = localStorage.getItem("password") || "";

        // Gabungkan data API + password dari localStorage
        setUserData({
          ...res.data,
          password: savedPassword,
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleBack = () => {
    router.push("/");
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center mb-6">Profile</h2>

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

          <Button onClick={handleBack} className="w-full mt-6">
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
