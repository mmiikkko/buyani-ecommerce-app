"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type Transaction = {
  id: string;
  userId: string;
  orderId: string;
  transactionType: string | null;
  remarks: string | null;
  createdAt: string;    
};

export function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setTransactions(data || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const filtered = transactions.filter(
    (t) =>
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.orderId.toLowerCase().includes(search.toLowerCase()) ||
      t.transactionType?.toLowerCase().includes(search.toLowerCase() ?? "")
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Transactions Monitoring</CardTitle>

        <Input
          placeholder="Search transaction ID, order ID, or type..."
          className="mt-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.id}</TableCell>
                <TableCell>{t.userId}</TableCell>
                <TableCell>{t.orderId}</TableCell>
                <TableCell>
                  <Badge>{t.transactionType || "N/A"}</Badge>
                </TableCell>
                <TableCell className="max-w-[250px] truncate">{t.remarks || "No remarks"}</TableCell>
                <TableCell>
                  {new Date(t.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
