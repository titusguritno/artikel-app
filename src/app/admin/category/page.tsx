"use client";

import { LayoutGrid, Tags, LogOut } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Logout from "@/components/modals/logout";
import { debounce } from "lodash";
import AddCategoryDialog from "@/components/modals/AddCategory"; // import komponen
import { toast } from "sonner"; // untuk notifikasi
import EditategoryDialog from "@/components/modals/EditCategory";

interface Category {
  id: number;
  name: string;
  created_at: string;
}

export default function CategoryDashboard() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [username, setUsername] = useState("");
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({ id: 0, name: "" });
  const [editedCategoryName, setEditedCategoryName] = useState("");

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    setUsername(savedUsername || "Guest");
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [page, debouncedSearch]);

  const debounceSearchHandler = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
    }, 500),
    []
  );

  useEffect(() => {
    debounceSearchHandler(search);
  }, [search, debounceSearchHandler]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("api/categories", {
        params: { page, limit: 10, search: debouncedSearch },
      });

      setCategories(res.data.data);
      setTotalData(res.data.totalData);
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

  const handleAddCategory = async (name: string) => {
    try {
      await api.post("/api/categories", { name });
      toast("Category added", {
        description: `Category "${name}" has been created.`,
      });
      fetchCategories();
    } catch (error) {
      toast("Failed to add category", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const handleEditCategory = async (id: any, name: string) => {
    try {
      await api.put(`/api/categories/${id}`, { name });
      toast("Category edited", {
        description: `Category "${id}" has been edited.`,
      });
      setIsEditDialogOpen(false);
      fetchCategories();
    } catch (error) {
      toast("Failed to edit category", {
        description: "Something went wrong. Please try again.",
      });
    }
  };

  const handleEditFromModal = (value: string) => {
    setEditedCategoryName(value); // This updates the state with the value from child
  };

  return (
    <div className="flex min-h-screen">
      <EditategoryDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={() =>
          handleEditCategory(selectedCategory.id, editedCategoryName)
        }
        categoryName={selectedCategory.name}
        onSendData={handleEditFromModal}
      />
      <AddCategoryDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddCategory}
      />

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
            {" "}
            <LayoutGrid size={18} /> <span>Articles</span>{" "}
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-3 text-white hover:bg-blue-700"
            onClick={() => router.push("/admin/category")}
          >
            {" "}
            <Tags size={18} /> <span>Category</span>{" "}
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-3 text-white hover:bg-blue-700 mt-2"
            onClick={() => setIsLogoutOpen(true)}
          >
            {" "}
            <LogOut size={18} /> <span>Logout</span>{" "}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {/* Topbar */}
        <div className="flex items-center justify-between p-4 shadow-sm bg-white">
          <h1 className="text-xl font-bold text-gray-700">Category</h1>
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
          {/* Total Categories */}
          <p className="text-sm text-gray-500">Total Categories: {totalData}</p>

          {/* Search and Add Button */}
          <div className="flex justify-between items-center">
            <div className="relative w-80">
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
                placeholder="Search categories"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-white text-black rounded-lg"
              />
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg whitespace-nowrap"
              onClick={() => setIsAddDialogOpen(true)}
            >
              + Add Category
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Category</th>
                  <th className="p-4 text-left">Created At</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b">
                    <td className="p-4">{category.name}</td>
                    <td className="p-4">
                      {new Date(category.created_at).toLocaleString("id-ID")}
                    </td>
                    <td className="p-4 flex justify-center gap-4">
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => {
                          setIsEditDialogOpen(true);
                          setSelectedCategory({
                            id: category.id,
                            name: category.name,
                          });
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="link" size="sm" className="text-red-500">
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
