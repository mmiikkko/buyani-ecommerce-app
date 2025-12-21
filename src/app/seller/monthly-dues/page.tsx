"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CalendarSync,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

type BillingRecord = {
  id: string;
  billingMonth: string;
  amountDue: number;
  dueDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  payments: Array<{
    id: string;
    receiptNumber: string;
    amountPaid: number;
    receiptUrl: string;
    paymentDate: string;
    paymentMethod?: string;
    verificationStatus: string;
    createdAt: string;
  }>;
};

export default function MonthlyDuesPage() {
  const [billings, setBillings] = useState<BillingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<BillingRecord | null>(null);
  const [uploading, setUploading] = useState(false);

  // Upload form state
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchBillings();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchBillings();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchBillings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/seller/monthly-dues");

      if (res.status === 401) {
        toast.error("Please log in to view monthly dues");
        return;
      }

      if (res.status === 403) {
        toast.error("Access denied. Seller account required.");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch monthly dues");
      }

      const data = await res.json();
      setBillings(data.billings || []);
    } catch (error) {
      console.error("Error fetching billings:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load monthly dues");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast.error("Please upload an image or PDF file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setReceiptFile(file);

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setReceiptPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedBilling || !receiptFile || !receiptNumber || !amountPaid) {
      toast.error("Please fill all fields");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("billingId", selectedBilling.id);
      formData.append("receipt", receiptFile);
      formData.append("receiptNumber", receiptNumber);
      formData.append("amountPaid", amountPaid);
      formData.append("paymentMethod", paymentMethod);

      const res = await fetch("/api/seller/monthly-dues/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to upload receipt");
      }

      toast.success("Payment receipt uploaded successfully. Awaiting verification.");
      setUploadDialogOpen(false);
      resetUploadForm();
      fetchBillings();
    } catch (error) {
      console.error("Error uploading receipt:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload receipt");
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setReceiptFile(null);
    setReceiptNumber("");
    setAmountPaid("");
    setPaymentMethod("Cash");
    setReceiptPreview(null);
    setSelectedBilling(null);
  };

  const openUploadDialog = (billing: BillingRecord) => {
    setSelectedBilling(billing);
    setAmountPaid(billing.amountDue.toString());
    setUploadDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { icon: CheckCircle, className: "bg-green-100 text-green-700", label: "Paid" },
      unpaid: { icon: XCircle, className: "bg-red-100 text-red-700", label: "Unpaid" },
      pending_verification: {
        icon: Clock,
        className: "bg-yellow-100 text-yellow-700",
        label: "Pending Verification",
      },
      rejected: { icon: XCircle, className: "bg-red-100 text-red-700", label: "Rejected" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      icon: Clock,
      className: "bg-gray-100 text-gray-700",
      label: status,
    };

    const Icon = config.icon;

    return (
      <span className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2 ${config.className}`}>
        <Icon className="h-4 w-4" />
        {config.label}
      </span>
    );
  };

  const handleViewReceipt = (receiptUrl: string) => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Payment Receipt</title>
            <style>
              body { margin: 0; padding: 20px; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f5f5f5; }
              img { max-width: 100%; max-height: 90vh; object-fit: contain; }
            </style>
          </head>
          <body>
            <img src="${receiptUrl}" alt="Payment Receipt" />
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="relative min-h-screen min-w-full overflow-hidden space-y-6 px-6">
      {/* Header */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-[#2E7D32]/10">
            <CalendarSync className="h-6 w-6 text-[#2E7D32]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#2E7D32]">Monthly Rent</h1>
            <p className="text-muted-foreground mt-1">
              Manage your monthly payments and billing records
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500">Loading billing records...</p>
        </div>
      ) : billings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarSync className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No billing records found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {billings.map((billing) => (
            <Card key={billing.id} className="shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">{billing.billingMonth}</CardTitle>
                    <CardDescription>
                      Due Date: {new Date(billing.dueDate).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {getStatusBadge(billing.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Amount Due</p>
                    <p className="text-2xl font-bold text-[#2E7D32]">
                      ₱{billing.amountDue.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Payment History */}
                {billing.payments && billing.payments.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Payment History</h3>
                    <div className="space-y-3">
                      {billing.payments.map((payment) => (
                        <div
                          key={payment.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">Receipt #{payment.receiptNumber}</p>
                              <span
                                className={`px-2 py-1 rounded text-xs ${payment.verificationStatus === "verified"
                                  ? "bg-green-100 text-green-700"
                                  : payment.verificationStatus === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                                  }`}
                              >
                                {payment.verificationStatus}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Amount: ₱{payment.amountPaid.toLocaleString()}
                            </p>
                            {payment.paymentMethod && (
                              <p className="text-xs text-gray-500">
                                Method: {payment.paymentMethod}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              Paid: {new Date(payment.paymentDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewReceipt(payment.receiptUrl)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = payment.receiptUrl;
                                link.download = `receipt_${payment.receiptNumber}.${payment.receiptUrl.includes("pdf") ? "pdf" : "jpg"}`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

