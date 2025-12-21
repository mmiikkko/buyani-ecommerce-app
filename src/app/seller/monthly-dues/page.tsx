"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  FileText,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
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

  const getDueIn = (dueDate: string, status: string) => {
    if (status === "paid") return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Cleared</Badge>;

    const due = new Date(dueDate);
    const now = new Date();
    // Reset hours to compare dates only roughly or keep precise
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="flex items-center gap-1 text-red-600 font-bold">
          <AlertCircle className="w-4 h-4" />
          Overdue by {Math.abs(diffDays)} days
        </span>
      );
    }
    if (diffDays === 0) return <span className="text-amber-600 font-bold">Due Today</span>;
    if (diffDays <= 5) return <span className="text-amber-600 font-medium">{diffDays} days left</span>;

    return <span className="text-muted-foreground">{diffDays} days</span>;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80 border-emdrald-200",
      unpaid: "bg-red-100 text-red-700 hover:bg-red-100/80 border-red-200",
      pending_verification: "bg-amber-100 text-amber-700 hover:bg-amber-100/80 border-amber-200",
      rejected: "bg-red-100 text-red-700 hover:bg-red-100/80 border-red-200",
    };

    // Normalize status
    const normalized = status.toLowerCase() as keyof typeof styles;
    const style = styles[normalized] || "bg-gray-100 text-gray-700";

    const label = status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return (
      <Badge className={cn("border shadow-none", style)}>
        {label}
      </Badge>
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
        <div className="rounded-xl border border-dashed p-8 text-center animate-pulse">
          <div className="h-8 w-48 bg-gray-100 rounded mx-auto mb-4" />
          <div className="h-64 w-full bg-gray-50 rounded" />
        </div>
      ) : billings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-xl bg-gray-50/50">
          <CalendarSync className="h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No billing records found</p>
        </div>
      ) : (
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-[150px]">Billing Month</TableHead>
                <TableHead>Amount Due</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Due In</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billings.map((billing) => {
                const latestPayment = billing.payments?.[0]; // Assuming sorted by date desc from API or just taking first
                return (
                  <TableRow key={billing.id} className="group hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-semibold text-gray-900">
                      {billing.billingMonth}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-[#2E7D32]">
                        ₱{billing.amountDue.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(billing.dueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getDueIn(billing.dueDate, billing.status)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(billing.status)}
                    </TableCell>
                    <TableCell>
                      {latestPayment ? (
                        <div className="flex flex-col text-sm">
                          <span className="font-medium">₱{latestPayment.amountPaid.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">{new Date(latestPayment.paymentDate).toLocaleDateString()}</span>
                          {latestPayment.verificationStatus !== 'verified' && (
                            <span className="text-[10px] text-amber-600 italic">Verifying...</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {billing.status === 'unpaid' || billing.status === 'rejected' ? (
                          <Button
                            size="sm"
                            className="h-8 bg-[#2E7D32] hover:bg-[#1b5e20]"
                            onClick={() => openUploadDialog(billing)}
                          >
                            <Upload className="w-3.5 h-3.5 mr-1.5" />
                            Pay
                          </Button>
                        ) : null}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {latestPayment && (
                              <>
                                <DropdownMenuItem onClick={() => handleViewReceipt(latestPayment.receiptUrl)}>
                                  <Eye className="w-4 h-4 mr-2" /> View Receipt
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  const link = document.createElement("a");
                                  link.href = latestPayment.receiptUrl;
                                  link.download = `receipt_${latestPayment.receiptNumber}.${latestPayment.receiptUrl.includes("pdf") ? "pdf" : "jpg"}`;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                }}>
                                  <Download className="w-4 h-4 mr-2" /> Download Receipt
                                </DropdownMenuItem>
                              </>
                            )}
                            {billing.status === 'unpaid' && (
                              <DropdownMenuItem onClick={() => openUploadDialog(billing)}>
                                <Upload className="w-4 h-4 mr-2" /> Upload Payment
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

