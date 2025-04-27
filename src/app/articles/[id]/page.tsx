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

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/api/articles/${id}`);
        setArticle(res.data);

        const others = await api.get(`/api/articles`, { params: { limit: 3 } });
        setOtherArticles(others.data.data);
      } catch (error) {
        console.error(error);
        router.push("/not-found");
      }
    };

    fetchArticle();
    setUsername(localStorage.getItem("username"));
  }, [id, router]);

  if (!article) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b bg-white">
        {/* Logo kiri */}
        <div className="flex items-center gap-2">
          <img
            src="/assets/logoipsum.svg"
            alt="Logoipsum"
            className="w-25 h-auto object-contain"
          />
        </div>

        {/* Username kanan */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-black hover:bg-transparent"
              >
                <Avatar className="w-8 h-8 bg-blue-200">
                  <AvatarFallback className="text-blue-700 font-bold">
                    {username ? username.charAt(0).toUpperCase() : "G"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-semibold underline">
                  {username || "Guest"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  localStorage.clear();
                  router.push("/login");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-6">
          <p className="text-gray-400 text-xs">
            {new Date(article.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            • Created by Admin
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
            {otherArticles.map((other) => (
              <Card
                key={other.id}
                className="hover:shadow-lg transition rounded-xl overflow-hidden"
              >
                <img
                  src={other.image || "https://via.placeholder.com/400x250"}
                  alt={other.title}
                  className="w-full h-40 object-cover"
                />
                <CardContent className="p-4">
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white mt-20">
        <div className="flex items-center justify-center w-full px-6 py-6 gap-2">
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
