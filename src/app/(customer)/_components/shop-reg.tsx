"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Logo from "@/assets/logo/Logo.png";
import { Upload, FileText } from "lucide-react";

export function SellerRegisterForm() {
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [notarizedFile, setNotarizedFile] = useState<File | null>(null);
  const [validIdFile, setValidIdFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const notarizedInputRef = useRef<HTMLInputElement>(null);
  const validIdInputRef = useRef<HTMLInputElement>(null);

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
        // Auto refresh page to show shop application status
        setTimeout(() => {
          window.location.reload();
        }, 1500);
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
    <section className="relative min-h-screen w-full flex items-start justify-center bg-gradient-to-br from-emerald-50 to-slate-50 px-3 pt-8 pb-8">
      <div className="w-full max-w-md space-y-3">

        {/* ✅ Back to Home Button - Smaller and aesthetic */}
        <div className="flex justify-start">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              ← Back to Home
            </Button>
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg space-y-4 border border-emerald-100"
        >
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24">
              <Image
                src={Logo}
                alt="BuyAni Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          
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
              ref={notarizedInputRef}
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={(e) =>
                e.target.files && setNotarizedFile(e.target.files[0])
              }
              required
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => notarizedInputRef.current?.click()}
              className={`w-full justify-start ${
                notarizedFile ? "bg-emerald-50 border-emerald-300 text-emerald-700" : ""
              }`}
            >
              <Upload className="h-4 w-4 mr-2" />
              {notarizedFile ? notarizedFile.name : "Click to upload Notarized Agreement"}
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Valid ID
            </label>
            <input
              ref={validIdInputRef}
              type="file"
              accept=".pdf,.jpg,.png"
              onChange={(e) =>
                e.target.files && setValidIdFile(e.target.files[0])
              }
              required
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => validIdInputRef.current?.click()}
              className={`w-full justify-start ${
                validIdFile ? "bg-emerald-50 border-emerald-300 text-emerald-700" : ""
              }`}
            >
              <FileText className="h-4 w-4 mr-2" />
              {validIdFile ? validIdFile.name : "Click to upload Valid ID"}
            </Button>
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
