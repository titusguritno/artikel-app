"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/axios";

interface Article {
  id: string;
  title: string;
  image: string;
  created_at: string;
  content: string;
}

export default function ArticlePreviewPage() {
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [otherArticles, setOtherArticles] = useState<Article[]>([]);
  const [username, setUsername] = useState<string>("Guest");
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(true);

  useEffect(() => {
    const previewData = localStorage.getItem("previewArticle");
    const storedUsername = localStorage.getItem("username");

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (previewData) {
      const parsedArticle = JSON.parse(previewData);
      setArticle(parsedArticle);
    } else {
      router.push("/admin/articles/add");
    }
  }, [router]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await api.get("api/articles"); // Fetch semua artikel
        const data: Article[] = res.data.data; // Sesuaikan structure API kamu

        const filtered = data.filter((a) => a.title !== article?.title);

        setOtherArticles(filtered.slice(0, 3)); // TAMPILKAN maksimal 3 artikel
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoadingArticles(false);
      }
    }

    if (article) {
      fetchArticles();
    }
  }, [article]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    router.push("/login");
  };

  if (!article) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading preview...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
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
            className="w-24 h-auto object-contain"
          />
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded-md"
              >
                <Avatar className="w-8 h-8 bg-blue-200">
                  <AvatarFallback className="text-gray-700 font-semibold text-sm">
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-bold text-black">{username}</span>
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
          onClick={() => router.push("/admin/articles/add")}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-12">
        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm">
            {new Date(article.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · {username}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold mt-3 leading-tight text-gray-800">
            {article.title}
          </h1>
        </div>

        {/* Image */}
        <div className="w-full mb-8 rounded-lg overflow-hidden">
          <img
            src={article.image || "https://via.placeholder.com/800x400"}
            alt={article.title}
            className="w-full h-auto max-h-[500px] object-cover mx-auto"
          />
        </div>

        {/* Full Content */}
        <div className="prose lg:prose-lg max-w-none text-justify mb-16">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* Related Articles */}
        {loadingArticles ? (
          <div className="text-center text-gray-500">Loading articles...</div>
        ) : otherArticles.length > 0 ? (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Others article
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherArticles.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <img
                    src={item.image || "https://via.placeholder.com/400x200"}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                  />
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {new Date(item.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="mt-2 text-gray-600 text-sm">{username}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center text-gray-400">
            Tidak ada artikel lain
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white mt-20">
        <div className="flex items-center justify-center w-full px-2 py-2 gap-2">
          <img
            src="/assets/logoipsum2.svg"
            alt="Logoipsum"
            className="w-20 h-20 object-contain"
          />
          <p className="text-sm text-center">
            © 2025 Blog genzet. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
