"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ImageIcon, Upload, Link2 } from "lucide-react";
import { toast } from "sonner";

export function LandingCustom() {
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [urlList, setUrlList] = useState<string[]>([]);
  const [singleUrl, setSingleUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(null);
      reader.readAsDataURL(file); // <- BASE64
    });

  const handleMultipleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(e.target.files || []);

    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB`);
        return false;
      }
      return true;
    });

    // Convert all to Base64
    const converted = await Promise.all(validFiles.map((f) => fileToBase64(f)));

    setBase64Images((prev) => [...prev, ...converted]);
  };

  const addImageUrl = () => {
    if (!singleUrl.trim()) return;
    setUrlList((prev) => [...prev, singleUrl.trim()]);
    setSingleUrl("");
  };

  const handleSave = async () => {
    if (base64Images.length === 0 && urlList.length === 0) {
      toast.error("Please select images or add URLs.");
      return;
    }

    setSaving(true);

    try {
      // Save External URLs
      for (const url of urlList) {
        await fetch("/api/carousel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageDescription: "Carousel Banner",
            imageURL: url, // Using external URL
          }),
        });
      }

      // Save Base64 Images
      for (const base64 of base64Images) {
        await fetch("/api/carousel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageDescription: "Uploaded Carousel Banner",
            imageURL: base64, // <-- BASE64 IMAGE
          }),
        });
      }

      toast.success("All images saved successfully!");
      setBase64Images([]);
      setUrlList([]);
    } catch (err) {
      toast.error("Saving failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="shadow-md border border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-emerald-600" />
          Multiple Carousel Images
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Multiple upload */}
        <div className="space-y-2">
          <label className="font-semibold flex items-center gap-2">
            <Upload className="h-4 w-4" /> Upload Multiple Images
          </label>

          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleMultipleUpload}
            className="cursor-pointer"
          />

          <p className="text-xs text-gray-500">
            Max 5MB each, JPG/PNG/WebP (Base64 supported)
          </p>
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <label className="font-semibold flex items-center gap-2">
            <Link2 className="h-4 w-4" /> Add Image URL
          </label>

          <div className="flex gap-2">
            <Input
              value={singleUrl}
              onChange={(e) => setSingleUrl(e.target.value)}
            />
            <Button onClick={addImageUrl}>Add</Button>
          </div>

          {urlList.length > 0 && (
            <ul className="text-xs text-gray-600 list-disc ml-4">
              {urlList.map((url, i) => (
                <li key={i}>{url}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Preview Grid */}
        {base64Images.length > 0 || urlList.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {base64Images.map((src, i) => (
              <div
                key={i}
                className="relative h-32 w-full rounded-md overflow-hidden border"
              >
                <Image src={src} alt="Preview" fill className="object-cover" />
              </div>
            ))}

            {urlList.map((src, i) => (
              <div
                key={i}
                className="relative h-32 w-full rounded-md overflow-hidden border"
              >
                <Image
                  src={src}
                  alt="URL Preview"
                  fill
                  className="object-cover"
                  onError={() => toast.error(`Invalid URL: ${src}`)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-40 border-2 border-dashed rounded-md flex items-center justify-center text-gray-400">
            No images added yet
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSave}
          disabled={saving || (base64Images.length === 0 && urlList.length === 0)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {saving ? "Saving..." : "Save All Images"}
        </Button>
      </CardFooter>
    </Card>
  );
}
