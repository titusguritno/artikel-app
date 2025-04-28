"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, ArrowLeft } from "lucide-react";
import Logout from "@/components/modals/logout";

interface Article {
  id: number;
  title: string;
  image: string;
  created_at: string;
  short_description: string;
  content: string;
  category: { name: string };
}

export default function ArticleDetailPage() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [otherArticles, setOtherArticles] = useState<Article[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/api/articles/${id}`);
        setArticle(res.data);

        const others = await api.get(`/api/articles`, {
          params: { limit: 4 }, // Bisa diubah limitnya
        });

        const filteredOthers = others.data.data.filter(
          (item: Article) => item.id !== Number(id)
        );

        setOtherArticles(filteredOthers.slice(0, 3));
      } catch (error) {
        console.error(error);
        router.push("/not-found");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    setUsername(localStorage.getItem("username"));
    setRole(localStorage.getItem("role") || "user");
  }, [id, router]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    router.push("/login");
  };

  const handleBack = () => {
    if (role === "admin") {
      router.push("/admin/articles");
    } else {
      router.push("/articles");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Article not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Modal Logout */}
      <Logout
        open={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
      />

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <img
            src="/assets/logoipsum.svg"
            alt="Logoipsum"
            className="w-25 h-auto object-contain"
          />
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
                    {username ? username.charAt(0).toUpperCase() : "G"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-bold text-black underline">
                  {username || "Guest"}
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

      {/* Back Button */}
      <div className="px-6 pt-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-700 hover:text-black transition-all"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-6">
          <p className="text-gray-400 text-xs">
            {new Date(article.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            • {role === "admin" ? "Created by Admin" : "Created by User"}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mt-3 leading-tight">
            {article.title}
          </h1>
        </div>

        {/* Image */}
        <div className="w-full mb-8">
          <img
            src={article.image || "https://via.placeholder.com/800x400"}
            alt={article.title}
            className="rounded-lg w-full object-cover max-h-[500px] mx-auto"
          />
        </div>

        {/* Short Description */}
        <p className="text-gray-600 text-base leading-relaxed mb-6 text-justify">
          {article.short_description}
        </p>

        {/* Full Content */}
        <Card className="shadow-md">
          <CardContent className="prose lg:prose-lg p-6 max-w-none">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </CardContent>
        </Card>

        {/* Other Articles */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Other articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherArticles.length > 0 ? (
              otherArticles.map((other) => (
                <Card
                  key={other.id}
                  onClick={() => router.push(`/articles/${other.id}`)}
                  className="hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden cursor-pointer group"
                >
                  <div className="relative w-full h-40">
                    <img
                      src={other.image || "https://via.placeholder.com/400x250"}
                      alt={other.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-400 mb-1">
                      {new Date(other.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
                      {other.title}
                    </h3>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-gray-400">Tidak ada artikel lain.</p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white mt-20">
        <div className="flex items-center justify-center w-full px-2 py-2 gap-2">
          <img
            src="/assets/logoipsum2.svg"
            alt="Logoipsum"
            className="w-20 h-20 object-contain"
          />
          <p className="text-sm">© 2025 Blog genzet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
