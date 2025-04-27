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
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { debounce } from "lodash";
import Image from "next/image";

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

  // 🔥 Tambahkan untuk ambil username dari localStorage
  const [username, setUsername] = useState<string | null>(null);

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
    <div className="min-h-screen bg-white">
      {/* BANNER */}
      <div className="relative w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white pb-20 pt-10 md:pt-16">
        {/* Top Header */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image src="/logoipsum.svg" alt="Logo" width={30} height={30} />
          </div>

          {/* Username dari localStorage */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{username || "Guest"}</span>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center justify-center text-center px-6 mt-20">
          <p className="text-sm mb-2">Blog genzet</p>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            The Journal : Design Resources,
          </h1>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Interviews, and Industry News
          </h1>
          <p className="text-lg mb-8">Your daily dose of design insights!</p>

          {/* Filter & Search */}
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl">
            <Select
              onValueChange={(value) => {
                setCategory(value === "all" ? "" : value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full md:w-1/2 bg-white text-black">
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
              className="w-full md:w-1/2 bg-white text-black"
            />
          </div>
        </div>
      </div>

      {/* List Artikel */}
      <div className="max-w-7xl mx-auto p-6">
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
          <div className="flex justify-center mt-12 gap-4">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() =>
                setPage((prev) => (prev < totalPages ? prev + 1 : prev))
              }
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
