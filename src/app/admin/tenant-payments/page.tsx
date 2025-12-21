"use client";

import { useState, useEffect } from "react";
import { CalendarSync, Search, Users, CheckCircle, XCircle, Clock, Bell, Filter, ArrowUpDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Types
// Types
type TenantBilling = {
  id: string;
  tenantId: string;
  tenantName?: string;
  tenantEmail?: string;
  shopName?: string;
  billingMonth: string;
  amountDue: number;
  dueDate: string;
  status: "unpaid" | "pending_verification" | "paid" | "rejected" | "pending";
};

type BillingStats = {
  totalTenants: number;
  totalRecords: number;
  paid: number;
  unpaid: number;
  pendingVerification: number;
  rejected: number;
  totalPaid: number;
  totalUnpaid: number;
};

const fetchTenantBilling = async (): Promise<TenantBilling[]> => {
  const res = await fetch("/api/admin/tenant-billing");
  if (!res.ok) throw new Error("Failed to fetch billing");
  return res.json();
};

const fetchBillingStats = async (): Promise<BillingStats> => {
  const res = await fetch("/api/admin/tenant-billing/stats");
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
};

const generateBilling = async () => {
  try {
    await fetch("/api/admin/generate-billing", { method: "POST" });
  } catch (e) {
    console.error("Auto-generation failed", e);
  }
};

export default function TenantPaymentsPage() {
  const [billings, setBillings] = useState<TenantBilling[]>([]);
  const [stats, setStats] = useState<BillingStats | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [sortOrder, setSortOrder] = useState<string>("due_date_asc");
  const [notificationDialog, setNotificationDialog] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<TenantBilling | null>(null);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [sendingNotification, setSendingNotification] = useState(false);


  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Silent generation first to ensure up-to-date data
        await generateBilling();

        const [billingData, statsData] = await Promise.all([
          fetchTenantBilling(),
          fetchBillingStats(),
        ]);
        setBillings(billingData);
        setStats(statsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filtered billings by search term and status
  const filteredBillings = billings.filter((billing) => {
    const term = search.toLowerCase();
    const matchesSearch = (
      billing.tenantId.toLowerCase().includes(term) ||
      (billing.tenantName?.toLowerCase().includes(term) ?? false) ||
      (billing.shopName?.toLowerCase().includes(term) ?? false) ||
      billing.billingMonth.toLowerCase().includes(term) ||
      billing.status.toLowerCase().includes(term)
    );

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "paid" && (billing.status?.toLowerCase() === "paid")) ||
      (statusFilter === "pending" && (billing.status?.toLowerCase() === "unpaid" || billing.status?.toLowerCase() === "pending_verification" || billing.status?.toLowerCase() === "pending"));

    return matchesSearch && matchesStatus;
  });

  // Sorting
  const sortedBillings = [...filteredBillings].sort((a, b) => {
    switch (sortOrder) {
      case "due_date_asc":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      case "due_date_desc":
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      case "amount_desc":
        return b.amountDue - a.amountDue;
      case "amount_asc":
        return a.amountDue - b.amountDue;
      case "almost_due": {
        // Sort by due date asc, but prioritize unpaid/pending
        if (a.status === 'paid' && b.status !== 'paid') return 1;
        if (a.status !== 'paid' && b.status === 'paid') return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      default:
        return 0;
    }
  });

  // Handle notification button click
  const handleNotifyClick = (billing: TenantBilling) => {
    setSelectedBilling(billing);
    setNotificationMessage("");
    setNotificationDialog(true);
  };

  // Send notification
  const handleSendNotification = async () => {
    if (!selectedBilling || !notificationMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setSendingNotification(true);
    try {
      const response = await fetch("/api/admin/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: selectedBilling.tenantId,
          billingId: selectedBilling.id,
          message: notificationMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send notification");
      }

      toast.success("Notification sent successfully");
      setNotificationDialog(false);
      setNotificationMessage("");
    } catch (error) {
      console.error("Error sending notification:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send notification";
      toast.error(errorMessage);
    } finally {
      setSendingNotification(false);
    }
  };

  const getDueIn = (dueDate: string, status: string) => {
    if (status === "paid" || status === "paid_late") return <span className="text-emerald-600 font-medium text-xs">Cleared</span>;
    // "paid_late" isn't a standard status in my logic file but just in case

    const due = new Date(dueDate);
    const now = new Date();
    // Compare dates roughly
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="text-red-600 font-bold text-xs">
          Overdue ({Math.abs(diffDays)}d)
        </span>
      );
    }
    if (diffDays === 0) return <span className="text-amber-600 font-bold text-xs">Due Today</span>;
    if (diffDays <= 5) return <span className="text-amber-600 font-medium text-xs">{diffDays} days left</span>;

    return <span className="text-gray-500 text-xs">{diffDays} days</span>;
  };

  return (
    <section className="relative min-h-screen min-w-full overflow-hidden space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-xl p-6 border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-600 rounded-lg shadow-md">
            <CalendarSync className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Tenant Payments</h1>
            <p className="text-sm text-gray-600">Manage tenants, payment dues, and tenant details.</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      {
        stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-1 font-medium">Total Tenants</p>
                <p className="text-xl font-bold text-gray-800">{stats.totalTenants}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-1 font-medium">Paid</p>
                <p className="text-xl font-bold text-gray-800">{stats.paid}</p>
                <p className="text-xs text-gray-500 mt-1">₱{stats.totalPaid.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-red-600 rounded-lg">
                    <XCircle className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-1 font-medium">Unpaid</p>
                <p className="text-xl font-bold text-gray-800">{stats.unpaid}</p>
                <p className="text-xs text-gray-500 mt-1">₱{stats.totalUnpaid.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-yellow-600 rounded-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-1 font-medium">Pending Verification</p>
                <p className="text-xl font-bold text-gray-800">{stats.pendingVerification}</p>
              </CardContent>
            </Card>
          </div>
        )
      }

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5 text-gray-500" />
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="due_date_asc">Due Date (Oldest First)</SelectItem>
              <SelectItem value="due_date_desc">Due Date (Newest First)</SelectItem>
              <SelectItem value="almost_due">Almost Due (Priority)</SelectItem>
              <SelectItem value="amount_desc">Highest Amount</SelectItem>
              <SelectItem value="amount_asc">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-500" />
          <Input
            placeholder="Search by tenant name, shop name, month, or status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Billing Table */}
      <div className="overflow-x-auto">
        <Table className="w-full bg-white rounded-xl border border-gray-200">
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Shop</TableHead>
              <TableHead>Billing Month</TableHead>
              <TableHead>Amount Due</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Due In</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredBillings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-4">
                  No tenants found.
                </TableCell>
              </TableRow>
            ) : (
              sortedBillings.map((billing) => (
                <TableRow key={billing.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{billing.tenantName || billing.tenantId}</p>
                      {billing.tenantEmail && (
                        <p className="text-xs text-gray-500">{billing.tenantEmail}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{billing.shopName || "N/A"}</TableCell>
                  <TableCell>{billing.billingMonth}</TableCell>
                  <TableCell>₱{billing.amountDue.toLocaleString()}</TableCell>
                  <TableCell>{new Date(billing.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getDueIn(billing.dueDate, billing.status)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-lg text-sm font-medium ${billing.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : billing.status === "pending_verification"
                          ? "bg-yellow-100 text-yellow-700"
                          : billing.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                    >
                      {billing.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        {billing.status === "unpaid" && (
                          <Button size="sm" variant="outline">
                            Upload Payment
                          </Button>
                        )}
                        {billing.status === "pending_verification" && (
                          <span className="text-sm text-gray-500">Awaiting Verification</span>
                        )}
                        {billing.status === "paid" && (
                          <span className="text-sm text-green-600 font-semibold">Paid</span>
                        )}
                        {billing.status === "rejected" && (
                          <span className="text-sm text-red-600 font-semibold">Rejected</span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleNotifyClick(billing)}
                        className="h-8 w-8 p-0"
                        title="Notify Seller"
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                      {(billing.status === "unpaid" || billing.status === "pending_verification") && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700 ml-1"
                          onClick={async () => {
                            try {
                              const res = await fetch("/api/admin/tenant-billing", {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ billingId: billing.id, status: "paid" }),
                              });

                              if (res.ok) {
                                toast.success("Marked as paid");
                                // Refresh data
                                const [billingData, statsData] = await Promise.all([
                                  fetchTenantBilling(),
                                  fetchBillingStats(),
                                ]);
                                setBillings(billingData);
                                setStats(statsData);
                              } else {
                                toast.error("Failed to mark as paid");
                              }
                            } catch (err) {
                              console.error(err);
                              toast.error("Error updating status");
                            }
                          }}
                          title="Mark as Paid"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Notification Dialog */}
      <Dialog open={notificationDialog} onOpenChange={setNotificationDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Payment Reminder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tenant</label>
              <p className="text-sm text-gray-900">{selectedBilling?.tenantName || "N/A"}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Billing Month</label>
              <p className="text-sm text-gray-900">{selectedBilling?.billingMonth}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Amount Due</label>
              <p className="text-sm text-gray-900">₱{selectedBilling?.amountDue.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Message *</label>
              <Textarea
                placeholder="Enter your message to the seller..."
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNotificationDialog(false)}
              disabled={sendingNotification}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendNotification}
              disabled={sendingNotification || !notificationMessage.trim()}
            >
              {sendingNotification ? "Sending..." : "Send Notification"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section >
  );
}
