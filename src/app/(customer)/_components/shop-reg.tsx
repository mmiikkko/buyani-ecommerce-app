"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function SellerRegisterForm() {
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [notarizedFile, setNotarizedFile] = useState<File | null>(null);
  const [validIdFile, setValidIdFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shopName || !shopDescription || !notarizedFile || !validIdFile) {
      toast.error("Please fill all fields and upload required documents.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("shopName", shopName);
      formData.append("shopDescription", shopDescription);
      formData.append("notarizedAgreement", notarizedFile);
      formData.append("validId", validIdFile);

      const res = await fetch("/api/sellers/apply", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Application submitted successfully! Awaiting approval.");
        setShopName("");
        setShopDescription("");
        setNotarizedFile(null);
        setValidIdFile(null);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to submit application.");
      }
    } catch {
      toast.error("Error submitting application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-50 px-3">
      <div className="w-full max-w-md space-y-3">

        <div>
        {/* ✅ Back to Home Button */}
        <Link href="/">
          <Button
            variant="outline"
            className="w-full border-emerald-600 text-emerald-700 cursor-pointer"
          >
            ← Back to Home
          </Button>
        </Link>
        </div>


        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg space-y-4 border border-emerald-100"
        >
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            Register Your Shop
          </h2>

          <Input
            placeholder="Shop Name"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
          />

          <Input
            placeholder="Shop Description"
            value={shopDescription}
            onChange={(e) => setShopDescription(e.target.value)}
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Notarized Agreement
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={(e) =>
                e.target.files && setNotarizedFile(e.target.files[0])
              }
              required
              className="w-full text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Valid ID
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={(e) =>
                e.target.files && setValidIdFile(e.target.files[0])
              }
              required
              className="w-full text-sm"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </div>
    </section>
  );
}
