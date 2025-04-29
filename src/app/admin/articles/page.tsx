"use client";

import { LayoutGrid, Tags, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { debounce } from "lodash";
import Logout from "@/components/modals/logout";
import DeleteModal from "@/components/modals/delete";
import { toast } from "sonner";
// import { error } from "console";

interface Article {
  id: number;
  title: string;
  image: string;
  created_at: string;
  category: { name: string };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [username, setUsername] = useState("");
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<
    number | string | null
  >(null);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    setUsername(savedUsername || "Guest");
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [debouncedSearch, category, page]);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearch(search);
    }, 500);
    handler();
    return () => {
      handler.cancel();
    };
  }, [search]);

  const fetchArticles = async () => {
    try {
      const res = await api.get("api/articles", {
        params: { search: debouncedSearch, category, page, limit: 10 },
      });
      setArticles(res.data.data);
      setTotalData(res.data.total);
    } catch (error) {
      console.error(error);
    }
  };

  const totalPages = Math.ceil(totalData / 10);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/login");
  };

  const handleDelete = async (id: string | number | null) => {
    // if (selectedArticleId) return;
    console.log(id);
    // return;
    try {
      await api.delete(`/api/articles/${id}`);
      toast("Article deleted", {
        description: "The article has been successfully removed.",
      });
      fetchArticles();
    } catch (err) {
      console.error("Delete faild", err);
      toast("Failed delete", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsDeleteOpen(false);
      setSelectedArticleId(null);
    }
  };

  return (
    <div className="flex min-h-screen">
      <DeleteModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => handleDelete(selectedArticleId)}
      />
      {/* Logout Modal */}
      <Logout
        open={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
      />

      {/* Sidebar */}
      <div className="w-60 bg-blue-600 text-white flex flex-col py-6">
        <div className="px-6 mb-10">
          <img src="/assets/logoipsum2.svg" alt="Logo" className="h-10" />
        </div>

        <div className="flex flex-col gap-2 px-4">
          <Button
            variant="ghost"
            className="justify-start gap-3 text-white hover:bg-blue-700"
            onClick={() => router.push("/admin")}
          >
            <LayoutGrid size={18} />
            <span>Articles</span>
          </Button>

          <Button
            variant="ghost"
            className="justify-start gap-3 text-white hover:bg-blue-700"
            onClick={() => router.push("/admin/category")}
          >
            <Tags size={18} />
            <span>Category</span>
          </Button>

          <Button
            variant="ghost"
            className="justify-start gap-3 text-white hover:bg-blue-700 mt-2"
            onClick={() => setIsLogoutOpen(true)}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {/* Topbar */}
        <div className="flex items-center justify-between p-4 shadow-sm bg-white">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-700">Articles</h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar>
                  <AvatarFallback>
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-gray-700">{username}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                My Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Page Content */}
        <div className="p-6 space-y-6">
          {/* Total Articles */}
          <div className="text-sm text-gray-500">
            Total Articles: {totalData}
          </div>

          {/* Filters */}
          <div className="flex gap-4 items-center">
            <Select
              onValueChange={(val) => setCategory(val === "all" ? "" : val)}
            >
              <SelectTrigger className="w-48 text-black">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Tech">Technology</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="Health">Health</SelectItem>
                <SelectItem value="Politic">Politic</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Sport">Sport</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center">
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
                className="w-100 pl-10 bg-white text-black rounded-lg"
              />
            </div>
            {/* Add Articles */}
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
              onClick={() => router.push("/admin/articles/add")}
            >
              + Add Articles
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Thumbnail</th>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Created At</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b">
                    <td className="p-4">
                      <img
                        src={article.image || "https://via.placeholder.com/60"}
                        alt="Thumb"
                        className="w-14 h-14 object-cover rounded"
                      />
                    </td>
                    <td className="p-4">{article.title}</td>
                    <td className="p-4">{article.category.name}</td>
                    <td className="p-4">
                      {new Date(article.created_at).toLocaleString("id-ID")}
                    </td>
                    <td className="p-4 space-x-2">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => router.push(`/articles/${article.id}`)}
                      >
                        Preview
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/articles/edit/${article.id}`)
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-red-500"
                        onClick={() => {
                          setSelectedArticleId(article.id);
                          setIsDeleteOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={page === i + 1 ? "default" : "outline"}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
