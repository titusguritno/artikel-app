"use client";

import { useRef } from "react";
import { LayoutGrid, Tags, LogOut, ArrowLeft, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import Logout from "@/components/modals/logout";
import { Editor } from "@tinymce/tinymce-react";
import { Card, CardContent } from "@/components/ui/card";

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

  useEffect(() => {
    setIsEditorReady(true); // Set to true once the component has mounted on the client
  }, []);

  const editorRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUsername = localStorage.getItem("username");
      setUsername(savedUsername || "Guest");
    }
    fetchCategories();
  }, []);

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
      alert("Please fill all fields before uploading.");
      return;
    }

    try {
      setIsUploading(true);

      // Step 1: Upload thumbnail
      const formData = new FormData();
      formData.append("file", thumbnailFile);

      const uploadRes = await api.post("api/upload", formData);
      const uploadedThumbnailUrl = uploadRes.data.url;

      // Step 2: Upload article
      const articleData = {
        title,
        content,
        category_id: categoryId,
        thumbnail: uploadedThumbnailUrl,
      };

      await api.post("api/articles", articleData);

      router.push("/admin/articles");
    } catch (error: any) {
      console.error(error);
      alert("Failed to upload article. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreview = () => {
    if (!title || !content) {
      alert("Please fill title and content to preview.");
      return;
    }
    const previewData = {
      title,
      content,
      thumbnail: thumbnailUrl,
    };
    sessionStorage.setItem("preview-article", JSON.stringify(previewData));
    router.push("/admin/articles/preview");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/login");
  };

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
          <div className="flex items-center gap-2">
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

        {/* Form Content */}
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-xl p-8 space-y-8 shadow">
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-gray-700"
              onClick={() => router.push("/admin/articles")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            {/* Upload Thumbnail */}
            <div>
              <h3 className="text-sm font-medium mb-2">Thumbnails</h3>
              <Card className="border border-gray-200 w-64">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                  {thumbnailUrl ? (
                    <div className="relative w-full h-32">
                      <img
                        src={thumbnailUrl}
                        alt="Thumbnail preview"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute top-0 right-0 flex flex-col m-2 space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            document
                              .getElementById("thumbnail-upload")
                              ?.click();
                          }}
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
                            if (file) {
                              handleThumbnailChange(file);
                            }
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
              <Select onValueChange={setCategoryId}>
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
              {isEditorReady ? (
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
                      "checklist",
                      "export",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "preview",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "powerpaste",
                      "fullscreen",
                      "formatpainter",
                      "insertdatetime",
                      "media",
                      "table",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | casechange blocks | bold italic backcolor | " +
                      "alignleft aligncenter alignright alignjustify | " +
                      "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
              ) : null}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/articles")}
              >
                Cancel
              </Button>
              <Button variant="outline" onClick={handlePreview}>
                Preview
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
