"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Editor } from "@tinymce/tinymce-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { LayoutGrid, Tags, LogOut, ImageIcon } from "lucide-react";
import api from "@/lib/axios";
import Logout from "@/components/modals/logout";
// import { cookies } from "next/headers";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // pastikan id berupa string

  const editorRef = useRef<any>(null);

  const [username, setUsername] = useState("Guest");
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // tambahan loading state

  useEffect(() => {
    // const cookieStore = cookies();
    // const allCookies = document.cookie;
    // console.log(allCookies);

    if (!id) return;

    const savedUsername = localStorage.getItem("username");
    if (savedUsername) setUsername(savedUsername);
    // console.log(savedUsername);
    // console.log("DEBUG id:", id); // ➔ tambahkan ini

    fetchArticle();
    fetchCategories();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const res = await api.get(`/api/articles/${id}`);
      // console.log(res.data);
      const data = res.data;
      // console.log("DEBUG Artikel data:", data); // Debugging penting

      if (!data) {
        toast.error("Article not found.");
        router.push("/admin/articles");
        return;
      }

      setTitle(data.title || "");
      setContent(data.content || "");
      setCategoryId(String(data.categoryId) || "");

      if (data.image) {
        setThumbnailUrl(data.image);
      } else {
        setThumbnailUrl(null); // Atau kasih default thumbnail
      }
      setIsLoading(false);
    } catch (error: any) {
      console.error(
        "Error Fetching Article:",
        error.response?.data || error.message
      );
      toast.error("Failed to fetch article.");
      router.push("/admin/articles");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      setCategories(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleThumbnailChange = (file: File) => {
    if (file) {
      setThumbnailFile(file);
      const previewUrl = URL.createObjectURL(file);
      setThumbnailUrl(previewUrl);
    }
  };

  const handleSave = async () => {
    if (!title || !categoryId || !content) {
      toast.error("Please fill all fields before saving.");
      return;
    }

    try {
      setIsUploading(true);

      let uploadedThumbnailUrl = thumbnailUrl;

      if (thumbnailFile) {
        const uploadRes = await api.post("/api/upload", thumbnailFile.name);
        uploadedThumbnailUrl = uploadRes.data.imageUrl;
      }

      const updatedArticle = {
        title: title.trim(),
        content: content.trim(),
        categoryId: String(categoryId),
        imageUrl: uploadedThumbnailUrl, // pastikan gambar juga diupdate
      };

      await api.put(`/api/articles/${id}`, updatedArticle, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Article updated successfully!");
      router.push("/admin/articles");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update article.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-gray-500">Loading article...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
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
            onClick={() => router.push("/admin/articles")}
          >
            <LayoutGrid size={18} /> Articles
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-3 text-white hover:bg-blue-700"
            onClick={() => router.push("/admin/category")}
          >
            <Tags size={18} /> Category
          </Button>
          <Button
            variant="ghost"
            className="justify-start gap-3 text-white hover:bg-blue-700 mt-2"
            onClick={() => setIsLogoutOpen(true)}
          >
            <LogOut size={18} /> Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {/* Topbar */}
        <div className="flex items-center justify-between p-4 shadow-sm bg-white">
          <h1 className="text-xl font-bold text-gray-700">Edit Article</h1>
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

        {/* Form */}
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl p-8 space-y-8 shadow">
            {/* Thumbnail */}
            <div>
              <h3 className="text-sm font-medium mb-2">Thumbnail</h3>
              <Card className="border border-gray-200 w-64">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  {thumbnailUrl ? (
                    <div className="relative w-full h-32">
                      <img
                        src={thumbnailUrl || "/default-thumbnail.jpg"} // fallback
                        alt="Thumbnail preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-0 right-0 flex flex-col m-2 space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document.getElementById("thumbnail-upload")?.click()
                          }
                        >
                          Change
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setThumbnailFile(null);
                            setThumbnailUrl(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="thumbnail-upload"
                      className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                    >
                      <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">
                        Click to select files
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        Support File Type: jpg or png
                      </span>
                      <input
                        id="thumbnail-upload"
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleThumbnailChange(file);
                          }
                        }}
                      />
                    </label>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <Input
                placeholder="Input title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Content */}
            <div>
              <Editor
                onInit={(evt, editor) => (editorRef.current = editor)}
                value={content}
                apiKey="fzw0cxa9o4nzawwnfgfccbllcj1e82porc0357wce5svlr8x"
                onEditorChange={(newContent) => setContent(newContent)}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "a11ychecker",
                    "advlist",
                    "advcode",
                    "advtable",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "fullscreen",
                    "formatpainter",
                    "insertdatetime",
                    "media",
                    "table",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | formatpainter | bold italic backcolor | alignleft aligncenter alignright | bullist numlist | removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end items-center mt-8 gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/articles")}
                disabled={isUploading}
                className="w-32"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
                disabled={isUploading}
                className="bg-blue-600 hover:bg-blue-700 text-white w-32"
              >
                {isUploading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
