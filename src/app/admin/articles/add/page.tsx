"use client";

import { useRef, useEffect, useState } from "react";
import { LayoutGrid, Tags, LogOut, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

import Logout from "@/components/modals/logout";
import api from "@/lib/axios";
import Image from "next/image";

export default function AddArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const editorRef = useRef(null);

  useEffect(() => {
    setIsEditorReady(true);
    if (typeof window !== "undefined") {
      const savedUsername = localStorage.getItem("username");
      setUsername(savedUsername || "Guest");
      const savedDraft = localStorage.getItem("draftArticle");
      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft);
        setTitle(parsedDraft.title || "");
        setContent(parsedDraft.content || "");
        setCategoryId(parsedDraft.categoryId || "");
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const draftData = { title, content, categoryId };
    localStorage.setItem("draftArticle", JSON.stringify(draftData));
  }, [title, content, categoryId]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("api/categories");
      setCategories(res.data.data);
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

  const handleUpload = async () => {
    if (!title || !categoryId || !content || !thumbnailFile) {
      toast.error("Please fill all fields before uploading.");
      return;
    }
    try {
      setIsUploading(true);
      await api.post("api/upload", thumbnailFile.name);

      const articleData = {
        title: title.trim(),
        content: content.trim(),
        categoryId: String(categoryId),
      };
      await api.post("api/articles", articleData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Article published successfully!");
      localStorage.removeItem("draftArticle");
      router.push("/admin/articles");
    } catch (error: any) {
      console.error("Upload error:", error.response?.data || error.message);
      alert(
        error.response?.data?.message ||
          "Failed to upload article. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreview = () => {
    if (!title || !content) {
      alert("Please fill title and content first.");
      return;
    }
    const previewData = {
      title,
      image: thumbnailUrl || "https://via.placeholder.com/800x400",
      created_at: new Date().toISOString(),
      content,
    };
    localStorage.setItem("previewArticle", JSON.stringify(previewData));
    router.push("/admin/articles/preview");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/login");
  };

  return (
    <div className="flex flex-col md:flex-row relative">
      <Logout
        open={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
      />

      {/* Sidebar */}
      <div
        className={`sticky top-0 h-screen bg-white md:bg-blue-600 w-64 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col items-start py-6 px-6 text-gray-800 md:text-white">
          <div className="mb-6 w-full flex justify-between items-center md:justify-start">
            <Image
              src="/assets/logoipsum2.svg"
              alt="Logo"
              width={150}
              height={150}
            />

            <button
              className="md:hidden block"
              onClick={() => setIsSidebarOpen(false)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <Button
              variant="ghost"
              className="justify-start gap-3 text-inherit hover:bg-blue-700 w-full"
              onClick={() => router.push("/admin/articles")}
            >
              <LayoutGrid size={18} /> Articles
            </Button>
            <Button
              variant="ghost"
              className="justify-start gap-3 text-inherit hover:bg-blue-700 w-full"
              onClick={() => router.push("/admin/category")}
            >
              <Tags size={18} /> Category
            </Button>
            <Button
              variant="ghost"
              className="justify-start gap-3 text-inherit hover:bg-blue-700 w-full mt-2"
              onClick={() => setIsLogoutOpen(true)}
            >
              <LogOut size={18} /> Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        {/* Topbar */}
        <div className="flex items-center justify-between p-4 shadow-sm bg-white">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden block text-gray-700"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-700">Create Articles</h1>
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

        {/* Form */}
        <div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto w-full">
          <div className="bg-white rounded-xl p-6 md:p-8 space-y-8 shadow">
            {/* Upload Thumbnail */}
            <div>
              <h3 className="text-sm font-medium mb-2">Thumbnail</h3>
              <Card className="border border-gray-200 w-full max-w-xs">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  {thumbnailUrl ? (
                    <div className="relative w-full h-32">
                      <Image
                        src={thumbnailUrl}
                        alt="Thumbnail preview"
                        width={200}
                        height={200}
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
                    <>
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
                            if (file) handleThumbnailChange(file);
                          }}
                        />
                      </label>
                    </>
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
              <Select onValueChange={setCategoryId} value={categoryId}>
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
              <p className="text-xs text-gray-400 mt-1">
                The existing category list can be seen in the category menu.
              </p>
            </div>

            {/* Content */}
            <div>
              {isEditorReady && (
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
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row justify-end items-stretch md:items-center mt-8 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/articles")}
                disabled={isUploading}
                className="w-full md:w-32"
              >
                Cancel
              </Button>

              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreview}
                  disabled={isUploading}
                  className="w-full md:w-auto"
                >
                  Preview
                </Button>

                <Button
                  type="button"
                  variant="default"
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isUploading ? "Uploading..." : "Publish"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
