"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 🔥 Tambahin ini
import api from "@/lib/axios";
import { debounce } from "lodash";

interface Article {
  id: number;
  title: string;
  image: string;
  created_at: string;
  short_description: string;
  category: { name: string };
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [username, setUsername] = useState<string | null>(null);

  const router = useRouter(); // 🔥

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    setUsername(savedUsername);
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [debouncedSearch, category, page]);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearch(search);
    }, 400);
    handler();
    return () => {
      handler.cancel();
    };
  }, [search]);

  const fetchArticles = async () => {
    try {
      const res = await api.get("api/articles", {
        params: {
          search: debouncedSearch,
          category,
          page,
          limit: 9,
        },
      });
      setArticles(res.data.data);
      setTotalData(res.data.total || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const totalPages = Math.ceil(totalData / 9);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* BANNER */}
      <div
        className="relative w-full min-h-[600px] text-white bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/assets/background.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800/80 to-blue-600/70 z-0"></div>

        {/* Header */}
        <div className="relative z-10 flex justify-between items-center px-8 py-6">
          <img
            src="/assets/logoipsum2.svg"
            alt="Logo"
            className="w-32 h-auto"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-white hover:bg-blue-700"
              >
                <Avatar className="w-8 h-8 bg-blue-200">
                  <AvatarFallback className="text-blue-800 font-bold">
                    {username ? username.charAt(0).toUpperCase() : "G"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium underline">
                  {username || "Guest"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("username");
                  router.push("/login");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center Banner */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-10 md:pt-20">
          <p className="text-sm md:text-base font-medium mb-2">Blog GenZet</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-3">
            The Journal: Design Resources,
          </h1>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-5">
            Interviews, and Industry News
          </h1>
          <p className="text-lg md:text-xl mb-10">
            Your daily dose of design insights!
          </p>

          {/* Search & Select */}
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-3xl">
            <Select
              onValueChange={(value) => {
                setCategory(value === "all" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-1/3 bg-white text-black rounded-lg">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Tech">Technology</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Sport">Sport</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search articles"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-2/3 bg-white text-black rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* List Artikel */}
      <div className="flex-1 max-w-7xl mx-auto p-6">
        {/* Showing Info */}
        <div className="text-sm text-gray-600 mb-6">
          Showing: {articles.length} of {totalData} articles
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card
              key={article.id}
              className="hover:shadow-lg transition rounded-xl overflow-hidden"
            >
              <img
                src={article.image || "https://via.placeholder.com/400x250"}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-4">
                <p className="text-xs text-gray-400 mb-1">
                  {new Date(article.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {article.short_description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    isActive={page === index + 1}
                    onClick={() => setPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-blue-600 text-white">
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
