"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ImageIcon, Upload, Save, Link2 } from "lucide-react";
import { toast } from "sonner";

export function LandingCustom() {
  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [preview, setPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // ⬇ Upload to your storage provider here (Supabase, UploadThing, S3, Cloudinary)
    // After upload, replace preview with hosted URL:
    // setBannerUrl(uploadedImageUrl)
  };

  const handleSave = async () => {
    if (!preview && !bannerUrl) {
      toast.error("Please upload an image or provide a URL");
      return;
    }

    try {
      setSaving(true);
      // TODO: Save banner URL to your backend/database
      // await fetch("/api/site-settings/banner", { method: "PUT", body: JSON.stringify({ bannerUrl: preview || bannerUrl }) });
      
      toast.success("Banner saved successfully");
    } catch (error) {
      toast.error("Failed to save banner");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="shadow-md border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-emerald-600" />
          Landing Page Banner
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Upload or update the background image for your customer landing page
        </p>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">
        {/* Upload Field */}
        <div className="space-y-2">
          <label className="block font-semibold text-gray-700 flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Banner Image
          </label>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="cursor-pointer border-gray-300"
          />
          <p className="text-xs text-gray-500">Supported formats: JPG, PNG, WebP (Max 5MB)</p>
        </div>

        {/* URL Field (Optional) */}
        <div className="space-y-2">
          <label className="block font-semibold text-gray-700 flex items-center gap-2">
            <Link2 className="h-4 w-4" />
            Banner URL (Optional)
          </label>
          <Input
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            placeholder="https://example.com/banner.jpg"
            className="border-gray-300"
          />
          <p className="text-xs text-gray-500">Or provide a direct URL to the banner image</p>
        </div>

        {/* Preview */}
        {preview || bannerUrl ? (
          <div className="mt-5 w-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
            <div className="relative w-full h-64 bg-gray-100">
              <Image
                src={preview || bannerUrl}
                alt="Banner Preview"
                fill
                className="object-cover"
                onError={() => {
                  toast.error("Failed to load image. Please check the URL or try uploading again.");
                  setPreview("");
                  setBannerUrl("");
                }}
              />
            </div>
            <div className="p-3 bg-gray-50 border-t">
              <p className="text-xs text-gray-600 text-center">Preview</p>
            </div>
          </div>
        ) : (
          <div className="mt-5 w-full h-48 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No banner selected</p>
              <p className="text-gray-400 text-xs mt-1">Upload an image or provide a URL</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-gray-50 border-t">
        <Button 
          className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white w-full"
          onClick={handleSave}
          disabled={saving || (!preview && !bannerUrl)}
        >
          {saving ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Banner
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
