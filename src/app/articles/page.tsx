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
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { LogOut } from "lucide-react";
import Logout from "@/components/modals/logout";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  imageUrl: string;
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
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    setUsername(savedUsername);
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [debouncedSearch, category, page]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(handler);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Logout Modal */}
      <Logout
        open={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
      />

      {/* Banner */}
      <div
        className="relative w-full min-h-[600px] text-white bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/background.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800/80 to-blue-600/70 z-0"></div>

        <div className="relative z-10 flex justify-between items-center px-6 py-4">
          <Image
            src="/assets/logoipsum2.svg"
            alt="Logo"
            width={150}
            height={150}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-2 py-1 hover:bg-blue-700 rounded-md"
              >
                <Avatar className="w-7 h-7 bg-blue-200">
                  <AvatarFallback className="text-gray-700 font-semibold text-sm">
                    {username ? username.charAt(0).toUpperCase() : "G"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-bold text-white underline">
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

        {/* Center Banner */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-8 md:pt-20">
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
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Politic">Politic</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Sport">Sport</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-full md:w-2/3">
              {/* Icon Search */}
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
              </div>

              {/* Input Search */}
              <Input
                placeholder="Search articles"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setDebouncedSearch(search);
                    setPage(1);
                  }
                }}
                className="pl-10 bg-white text-black rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* List Artikel */}
      <div className="flex-1 max-w-7xl mx-auto p-6">
        <div className="text-sm text-gray-600 mb-6">
          Showing: {articles.length} of {totalData} articles
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Card
              key={article.id}
              onClick={() => router.push(`/articles/${article.id}`)}
              className="hover:shadow-lg transition rounded-xl overflow-hidden cursor-pointer flex items-center justify-center"
            >
              <Image
                src={article.imageUrl || "https://via.placeholder.com/400x250"}
                alt={article.title}
                width={350}
                height={250}
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
        <div className="flex items-center justify-center w-full px-2 py-2 gap-2">
          <Image
            src="/assets/logoipsum2.svg"
            alt="Logoipsum"
            width={100}
            height={100}
          />
          <p className="text-sm">© 2025 Blog Genzet. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
