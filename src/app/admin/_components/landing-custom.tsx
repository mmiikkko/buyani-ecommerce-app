"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LandingCustom() {
  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [preview, setPreview] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // ⬇ Upload to your storage provider here (Supabase, UploadThing, S3, Cloudinary)
    // After upload, replace preview with hosted URL:
    // setBannerUrl(uploadedImageUrl)
  };

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-semibold">Landing Page Banner</h2>
      <p className="text-sm text-gray-600">
        Upload or update the background image for your customer landing page.
      </p>

      {/* Upload Field */}
      <label className="block font-medium">Upload Banner Image</label>
      <Input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="cursor-pointer"
      />

      {/* URL Field (Optional) */}
      <label className="block font-medium mt-3">Banner URL (Optional)</label>
      <Input
        value={bannerUrl}
        onChange={(e) => setBannerUrl(e.target.value)}
        placeholder="https://example.com/banner.jpg"
      />

      {/* Preview */}
      {preview || bannerUrl ? (
        <div className="mt-5 w-full h-48 rounded-lg overflow-hidden border">
          <Image
            src={preview || bannerUrl}
            alt="Banner Preview"
            width={800}
            height={300}
            className="object-cover w-full h-full"
          />
        </div>
      ) : (
        <p className="text-gray-500 text-sm mt-2">No banner selected.</p>
      )}

      <Button className="mt-4 cursor-pointer">Save Banner</Button>
    </div>
  );
}
