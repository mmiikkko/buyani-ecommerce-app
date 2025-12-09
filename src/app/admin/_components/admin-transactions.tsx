"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Receipt, User, ShoppingCart, Tag, MessageSquare, Calendar } from "lucide-react";
import { SearchInput } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

type Transaction = {
  id: string;
  userId: string;
  orderId: string;
  transactionType: string | null;
  remarks: string | null;
  createdAt: string;
  userName: string | null;
  userEmail: string | null;
  orderTotal: string | null;
};

export function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setTransactions(data || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filtered = transactions.filter(
    (t) =>
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.orderId.toLowerCase().includes(search.toLowerCase()) ||
      t.transactionType?.toLowerCase().includes(search.toLowerCase() ?? "") ||
      t.userName?.toLowerCase().includes(search.toLowerCase() ?? "") ||
      t.userEmail?.toLowerCase().includes(search.toLowerCase() ?? "")
  );

  const getTransactionTypeColor = (type: string | null) => {
    if (!type) return "bg-gray-500";
    const t = type.toLowerCase();
    if (t === "instore" || t.includes("instore")) return "bg-emerald-600";
    if (t === "online" || t.includes("online")) return "bg-blue-600";
    if (t.includes("payment") || t.includes("purchase")) return "bg-emerald-600";
    if (t.includes("refund")) return "bg-amber-600";
    if (t.includes("cancel")) return "bg-red-600";
    return "bg-gray-600";
  };

  return (
    <Card className="w-full shadow-md border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-emerald-600" />
            Transactions Monitoring
          </CardTitle>
          <div className="text-sm text-gray-600">
            {filtered.length} {filtered.length === 1 ? "transaction" : "transactions"}
          </div>
        </div>

        <div className="mt-4">
          <SearchInput
            placeholder="Search transaction ID, order ID, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-gray-50">
            <Receipt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-semibold text-gray-600 mb-2">No transactions found</p>
            <p className="text-sm text-gray-500">
              {search ? "Try adjusting your search criteria" : "No transactions available"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4" />
                      Transaction ID
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      User
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      Order
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Type
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Remarks
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filtered.map((t, index) => (
                  <TableRow 
                    key={t.id} 
                    className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                  >
                    <TableCell className="font-medium text-gray-800 font-mono text-xs break-all max-w-[200px]">
                      {t.id.slice(0, 8)}...
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {t.userName || "Unknown User"}
                        </span>
                        {t.userEmail && (
                          <span className="text-xs text-gray-500">{t.userEmail}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 text-sm">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          Order #{t.orderId.slice(0, 8)}...
                        </span>
                        {t.orderTotal && (
                          <span className="text-xs text-emerald-600 font-semibold">
                            ₱{Number(t.orderTotal).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getTransactionTypeColor(t.transactionType)} text-white border-0`}>
                        {t.transactionType || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate text-gray-600 text-sm">
                      {t.remarks || (
                        <span className="text-gray-400 italic">No remarks</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {new Date(t.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
