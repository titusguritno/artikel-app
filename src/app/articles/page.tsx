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
import api from "@/lib/axios"; // axios instance
import { debounce } from "lodash"; // install lodash untuk debounce

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

  useEffect(() => {
    fetchArticles();
  }, [debouncedSearch, category, page]);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearch(search);
    }, 400); // debounce 400ms

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
          limit: 9, // Batasi 9 artikel per halaman
        },
      });
      setArticles(res.data.data);
      setTotalData(res.data.total || 0); // pastikan API mengirim total
    } catch (error) {
      console.error(error);
    }
  };

  const totalPages = Math.ceil(totalData / 9);

  return (
    <div className="min-h-screen bg-white">
      {/* BANNER */}
      <div className="relative w-full bg-gradient-to-r from-blue-500 to-blue-700 py-16 flex flex-col items-center justify-center gap-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
          The Journal: Design Resources, Interviews, and Industry News
        </h1>

        <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl mt-6">
          {/* Dropdown kategori */}
          <Select
            onValueChange={(value) => {
              setCategory(value === "all" ? "" : value);
              setPage(1); // reset ke page 1 saat filter berubah
            }}
          >
            <SelectTrigger className="w-full md:w-1/2">
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="Tech">Tech</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
          </Select>

          {/* Search bar */}
          <Input
            placeholder="Cari artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2"
          />
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
