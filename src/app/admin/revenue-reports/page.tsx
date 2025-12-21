"use client";

import { useState, useEffect } from "react";
import { BarChart3, Download, Printer, FileSpreadsheet, Calendar, Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { exportToExcel, exportToPDF, formatReportForPrint, type RevenueReportData } from "@/lib/export-utils";
import { formatYearMonth, getMonthName, formatDateRange } from "@/lib/date-utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type Seller = {
    id: string;
    name: string;
    shopName: string;
};

export default function RevenueReportsPage() {
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<RevenueReportData | null>(null);
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [selectedSeller, setSelectedSeller] = useState<string>("all");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    // Export Overlay State
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [exportType, setExportType] = useState<"excel" | "pdf">("excel");
    const [customFilename, setCustomFilename] = useState("");

    // Initialize with current month
    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const firstDay = `${year}-${String(month).padStart(2, '0')}-01`;
        const lastDay = new Date(year, month, 0);
        const lastDayStr = `${year}-${String(month).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;

        setStartDate(firstDay);
        setEndDate(lastDayStr);
    }, []);

    // Fetch sellers for dropdown
    useEffect(() => {
        const fetchSellers = async () => {
            try {
                const res = await fetch("/api/admin/shops");
                if (res.ok) {
                    const data = await res.json();
                    const sellerList = data.map((shop: any) => ({
                        id: shop.seller_id,
                        name: shop.seller_name || "Unknown",
                        shopName: shop.shop_name
                    }));
                    setSellers(sellerList);
                }
            } catch (error) {
                console.error("Error fetching sellers:", error);
            }
        };
        fetchSellers();
    }, []);

    // Fetch report data
    const fetchReportData = async () => {
        if (!startDate || !endDate) {
            toast.error("Please select both start and end dates");
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams({
                startDate,
                endDate,
            });

            if (selectedSeller !== "all") {
                params.append("sellerId", selectedSeller);
            }

            const res = await fetch(`/api/admin/revenue-reports?${params.toString()}`);
            if (!res.ok) {
                throw new Error("Failed to fetch report data");
            }

            const data = await res.json();
            setReportData(data);
        } catch (error) {
            console.error("Error fetching report:", error);
            toast.error("Failed to load revenue report");
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch when dates change
    useEffect(() => {
        if (startDate && endDate) {
            fetchReportData();
        }
    }, [startDate, endDate, selectedSeller]);

    const handleExportExcel = () => {
        if (!reportData) return;
        setExportType("excel");
        setCustomFilename(`revenue-report-${startDate}-to-${endDate}`);
        setIsExportDialogOpen(true);
    };

    const handleExportPDF = () => {
        if (!reportData) return;
        setExportType("pdf");
        setCustomFilename(`revenue-report-${startDate}-to-${endDate}`);
        setIsExportDialogOpen(true);
    };

    const confirmExport = () => {
        if (!reportData) return;

        const filename = customFilename.endsWith(exportType === "excel" ? ".xlsx" : ".pdf")
            ? customFilename
            : `${customFilename}${exportType === "excel" ? ".xlsx" : ".pdf"}`;

        if (exportType === "excel") {
            exportToExcel(reportData, filename);
            toast.success("Excel file downloaded");
        } else {
            exportToPDF(reportData, filename);
            toast.success("PDF file downloaded");
        }
        setIsExportDialogOpen(false);
    };

    const handlePrint = () => {
        formatReportForPrint();
    };

    return (
        <section className="min-h-screen space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-slate-50 rounded-xl p-6 border border-emerald-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-600 rounded-lg shadow-md">
                        <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">
                            Revenue Reports
                        </h1>
                        <p className="text-sm text-gray-600">
                            View and export sales reports by shop with weekly breakdowns
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Report Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Start Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Start Date
                            </label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                End Date
                            </label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>

                        {/* Seller Filter */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Store className="h-4 w-4" />
                                Filter by Shop
                            </label>
                            <Select value={selectedSeller} onValueChange={setSelectedSeller}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Shops" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Shops</SelectItem>
                                    {sellers.map((seller) => (
                                        <SelectItem key={seller.id} value={seller.id}>
                                            {seller.shopName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Export Buttons */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Export Options</label>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleExportExcel}
                                    disabled={!reportData || loading}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                >
                                    <FileSpreadsheet className="h-4 w-4 mr-1" />
                                    Excel
                                </Button>
                                <Button
                                    onClick={handleExportPDF}
                                    disabled={!reportData || loading}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                >
                                    <Download className="h-4 w-4 mr-1" />
                                    PDF
                                </Button>
                                <Button
                                    onClick={handlePrint}
                                    disabled={!reportData || loading}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                >
                                    <Printer className="h-4 w-4 mr-1" />
                                    Print
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Report Table */}
            <Card>
                <CardContent className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-gray-600">Loading report data...</div>
                        </div>
                    ) : !reportData ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-gray-600">Select a date range to view report</div>
                        </div>
                    ) : reportData.sellers.length === 0 ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-gray-600">No sales data found for the selected period</div>
                        </div>
                    ) : (
                        <div id="revenue-report-table" className="overflow-x-auto border border-gray-300">
                            <table className="w-full border-collapse bg-white text-[11px] font-sans">
                                <thead>
                                    {/* Excel Row 1 - Merged Weekly Header */}
                                    <tr>
                                        <th className="border border-gray-300 bg-white h-6" colSpan={2}></th>
                                        <th colSpan={reportData.weeks.length} className="border border-gray-300 bg-emerald-500 text-white text-center text-[10px] py-1 font-bold">
                                            No. of Week / Date Covered / No. of days operating in a week
                                        </th>
                                        <th className="border border-gray-300 bg-white h-6" colSpan={4}></th>
                                    </tr>
                                    {/* Excel Row 2 - Main Column Titles */}
                                    <tr>
                                        <th rowSpan={3} className="border border-gray-300 bg-yellow-400 text-black px-2 py-2 w-12 align-middle font-bold text-center">No.</th>
                                        <th rowSpan={3} className="border border-gray-300 bg-yellow-400 text-black px-4 py-2 min-w-[200px] align-middle font-bold text-center">Name of Shop</th>
                                        {reportData.weeks.map((week) => (
                                            <th key={week.weekNumber} className="border border-gray-300 bg-[#e6f3ff] text-[#0066cc] px-2 py-1 text-center font-bold">
                                                {week.weekNumber === 1 ? "1st Week" :
                                                    week.weekNumber === 2 ? "2nd Week" :
                                                        week.weekNumber === 3 ? "3rd Week" :
                                                            `${week.weekNumber}th Week`}
                                            </th>
                                        ))}
                                        <th rowSpan={3} className="border border-gray-300 bg-[#ccffcc] text-black px-4 py-2 w-28 align-middle font-bold text-center leading-tight">Total Sales per Shop</th>
                                        <th rowSpan={3} className="border border-gray-300 bg-[#fce4ec] text-[#d81b60] px-4 py-2 w-24 align-middle font-bold text-center leading-tight">Average Sales per Day</th>
                                        <th rowSpan={3} className="border border-gray-300 bg-[#e3f2fd] text-[#1565c0] px-4 py-2 w-24 align-middle font-bold text-center leading-tight">Average Sales in a month</th>
                                        <th rowSpan={3} className="border border-gray-300 bg-white text-gray-800 px-4 py-2 w-32 align-middle font-bold text-center leading-tight">Rank as average sales in a month</th>
                                    </tr>
                                    {/* Excel Row 3 - Date Ranges */}
                                    <tr>
                                        {reportData.weeks.map((week) => (
                                            <th key={week.weekNumber} className="border border-gray-300 bg-[#f0f7ff] text-[#003366] px-2 py-1 text-center font-bold">
                                                {week.dateRange}
                                            </th>
                                        ))}
                                    </tr>
                                    {/* Excel Row 4 - Day Counts */}
                                    <tr>
                                        {reportData.weeks.map((week) => (
                                            <th key={week.weekNumber} className="border border-gray-300 bg-[#f3e5f5] text-[#4a148c] px-2 py-1 text-center font-bold italic">
                                                {week.daysCount} days
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.sellers.map((seller, index) => {
                                        const isHighest = seller.rankLabel === "highest";
                                        const isLowest = seller.rankLabel === "lowest";

                                        return (
                                            <tr key={seller.shopId} className="h-7 hover:bg-slate-50">
                                                <td className="border border-gray-300 px-2 text-center text-gray-600">{index + 1}</td>
                                                <td className="border border-gray-300 px-4 font-medium text-gray-800 border-r-2 border-r-gray-400">{seller.shopName}</td>

                                                {/* Weekly Sales (Axis X: C-G) */}
                                                {reportData.weeks.map((week) => (
                                                    <td key={week.weekNumber} className="border border-gray-300 px-3 text-right font-bold">
                                                        {seller.weeklyBreakdown[week.weekNumber] > 0
                                                            ? seller.weeklyBreakdown[week.weekNumber].toLocaleString('en-US')
                                                            : "-"}
                                                    </td>
                                                ))}

                                                {/* Summary Columns (Axis X: H-K) */}
                                                <td className="border border-gray-300 px-4 text-right font-bold bg-[#f1fbf1] border-l-2 border-l-gray-400">
                                                    {seller.totalSales > 0 ? seller.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "-"}
                                                </td>
                                                <td className="border border-gray-300 px-4 text-right font-bold bg-[#fff0f5]">
                                                    {seller.totalSales > 0 ? Math.round(seller.averageSalesPerDay).toLocaleString('en-US') : "-"}
                                                </td>
                                                <td className="border border-gray-300 px-4 text-right font-bold bg-[#f0f7ff]">
                                                    {seller.averageSalesPerMonth > 0 ? Math.round(seller.averageSalesPerMonth).toLocaleString('en-US') : "-"}
                                                </td>

                                                <td className={`border border-gray-300 px-4 text-center font-bold ${isHighest || isLowest ? "bg-yellow-400" : ""}`}>
                                                    {seller.rankLabel}
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {/* Footer Row 25 - Grand Total Weekly (Axis Y: 25) */}
                                    <tr className="bg-white font-bold h-10">
                                        <td className="border border-gray-300 px-2 bg-white"></td>
                                        <td className="border border-gray-300 px-4 py-2 text-right text-[10px] uppercase font-black bg-white">
                                            GRAND TOTAL SALES WEEKLY
                                        </td>
                                        {reportData.weeks.map((week) => (
                                            <td key={week.weekNumber} className="border-x border-gray-300 border-t-2 border-t-black border-b-2 border-b-double border-b-black bg-white px-3 py-2 text-right">
                                                {reportData.grandTotalWeekly[week.weekNumber] > 0
                                                    ? reportData.grandTotalWeekly[week.weekNumber].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                    : "0.00"}
                                            </td>
                                        ))}
                                        <td colSpan={4} className="border border-gray-300 bg-white"></td>
                                    </tr>

                                    {/* Footer Row 26 - Grand Total Monthly (Axis Y: 26) */}
                                    <tr className="font-bold h-12 text-black text-[10px]">
                                        <td className="border border-gray-300 px-2 bg-white"></td>
                                        <td className="border border-gray-300 px-4 py-2 text-right uppercase font-black bg-white leading-tight">
                                            GRAND TOTAL SALES FOR THE 1ST MONTH OF PILOT TESTING
                                        </td>
                                        {/* Yellow background spans across week columns up to total */}
                                        <td colSpan={reportData.weeks.length - 1} className="border border-gray-300 bg-yellow-400"></td>
                                        <td className="border border-gray-400 px-4 py-2 text-right text-lg font-black bg-yellow-400">
                                            {reportData.grandTotalMonthly.toLocaleString('en-US')}
                                        </td>
                                        {/* Summary columns to the right remain white as requested */}
                                        <td colSpan={4} className="border border-gray-300 bg-white"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
            {/* Export Dialog Overlay */}
            <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            {exportType === "excel" ? <FileSpreadsheet className="h-5 w-5 text-green-600" /> : <Download className="h-5 w-5 text-red-600" />}
                            Export Revenue Report
                        </DialogTitle>
                    </DialogHeader>

                    {reportData && (
                        <div className="space-y-6 py-4">
                            {/* Preview Summary Card */}
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Preview Summary</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Report Period</p>
                                        <p className="text-sm font-medium">{startDate} to {endDate}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Total Shops</p>
                                        <p className="text-sm font-medium">{reportData.sellers.length} Shops</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Total Operating Days</p>
                                        <p className="text-sm font-medium">{reportData.reportPeriod.totalOperatingDays} Days</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Total Monthly Sales</p>
                                        <p className="text-sm font-bold text-emerald-600">PE {reportData.grandTotalMonthly.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Filename Input */}
                            <div className="space-y-2">
                                <Label htmlFor="filename" className="text-sm font-semibold">File Name</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="filename"
                                        value={customFilename}
                                        onChange={(e) => setCustomFilename(e.target.value)}
                                        placeholder="Enter filename..."
                                        className="flex-1"
                                    />
                                    <span className="text-sm font-medium text-slate-400">
                                        {exportType === "excel" ? ".xlsx" : ".pdf"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="flex gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsExportDialogOpen(false)} className="flex-1 sm:flex-none">
                            Cancel
                        </Button>
                        <Button onClick={confirmExport} className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700">
                            Confirm {exportType === "excel" ? "Excel" : "PDF"} Export
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
}
