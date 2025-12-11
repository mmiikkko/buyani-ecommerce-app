"use client";

import { useState, useEffect } from "react";
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
import { ImageIcon, Upload, Link2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function LandingCustom() {
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [urlList, setUrlList] = useState<string[]>([]);
  const [singleUrl, setSingleUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Load existing images from DB
  useEffect(() => {
    async function loadImages() {
      try {
        const res = await fetch("/api/carousel");
        const data = await res.json();
        setExistingImages(data); // MUST return [{ id, imageURL, imageDescription }]
      } catch (err) {
        toast.error("Failed to load current carousel images.");
      }
    }

    loadImages();
  }, []);

  const convertToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });

  const handleMultipleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(e.target.files || []);

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB`);
        continue;
      }

      const base64 = await convertToBase64(file);
      setNewImages((prev) => [...prev, base64]);
    }
  };

  const addImageUrl = () => {
    if (!singleUrl.trim()) return;
    setUrlList((prev) => [...prev, singleUrl.trim()]);
    setSingleUrl("");
  };

  const deleteExisting = async (id: string) => {
    const ok = confirm("Delete this carousel image?");
    if (!ok) return;

    try {
      await fetch(`/api/carousel?id=${id}`, { method: "DELETE" });

      setExistingImages((prev) => prev.filter((img) => img.id !== id));
      toast.success("Image deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const deleteNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteUrl = (index: number) => {
    setUrlList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (newImages.length === 0 && urlList.length === 0) {
      toast.error("Please select images or add URLs.");
      return;
    }

    setSaving(true);

    try {
      // Save URLs
      for (const url of urlList) {
        await fetch("/api/carousel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageDescription: "Carousel Banner",
            imageURL: url,
          }),
        });
      }

      // Save new base64 images
      for (const base64 of newImages) {
        await fetch("/api/carousel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageDescription: "Uploaded Carousel Banner",
            imageURL: base64,
          }),
        });
      }

      toast.success("Images saved!");

      // Reload existing images
      const updated = await fetch("/api/carousel").then((r) => r.json());
      setExistingImages(updated);

      // Clear new uploads
      setNewImages([]);
      setUrlList([]);
    } catch {
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
          Carousel Image Manager
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* EXISTING IMAGES */}
        <div>
          <h2 className="font-semibold mb-2">Current Carousel Images</h2>

          {existingImages.length === 0 ? (
            <p className="text-gray-500 text-sm">No images found.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {existingImages.map((img) => (
                <div
                  key={img.id}
                  className="relative h-32 w-full rounded-md overflow-hidden border"
                >
                  <Image
                    src={img.imageURL}
                    fill
                    alt="Existing"
                    className="object-cover"
                  />
                  <button
                    onClick={() => deleteExisting(img.id)}
                    className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NEW UPLOADS */}
        <div className="space-y-2">
          <label className="font-semibold flex items-center gap-2">
            <Upload className="h-4 w-4" /> Upload New Images
          </label>
          <Input type="file" accept="image/*" multiple onChange={handleMultipleUpload} />
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
        </div>

        {/* NEW PREVIEWS */}
        {(newImages.length > 0 || urlList.length > 0) && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {newImages.map((src, i) => (
              <div key={i} className="relative h-32 w-full border rounded-md overflow-hidden">
                <Image src={src} alt="preview" fill className="object-cover" />
                <button
                  onClick={() => deleteNewImage(i)}
                  className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            ))}

            {urlList.map((src, i) => (
              <div key={i} className="relative h-32 w-full border rounded-md overflow-hidden">
                <Image src={src} alt="url preview" fill className="object-cover" />
                <button
                  onClick={() => deleteUrl(i)}
                  className="absolute top-1 right-1 bg-white p-1 rounded-full shadow"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSave}
          disabled={saving || (newImages.length === 0 && urlList.length === 0)}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {saving ? "Saving..." : "Save New Images"}
        </Button>
      </CardFooter>
    </Card>
  );
}
