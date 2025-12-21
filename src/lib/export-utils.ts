import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Revenue report data structure
 */
export interface RevenueReportData {
    reportPeriod: {
        startDate: string;
        endDate: string;
        totalOperatingDays: number;
    };
    weeks: Array<{
        weekNumber: number;
        dateRange: string;
        daysCount: number;
        total: number;
    }>;
    sellers: Array<{
        sellerId: string;
        shopId: string;
        sellerName: string;
        shopName: string;
        weeklyBreakdown: Record<number, number>;
        totalSales: number;
        averageSalesPerDay: number;
        averageSalesPerMonth: number;
        rank: number;
        rankLabel: string;
    }>;
    grandTotalWeekly: Record<number, number>;
    grandTotalMonthly: number;
    totalSellers: number;
}

/**
 * Export revenue report to Excel
 */
export function exportToExcel(data: RevenueReportData, filename: string = 'revenue-report.xlsx') {
    const numWeeks = data.weeks.length;

    // Construct the 4-row header AOA
    // Row 1: Informational header
    const row1 = ['', '', 'No. of Week / Date Covered / No. of days operating in a week'];
    for (let i = 1; i < numWeeks; i++) row1.push(''); // Span spacer
    row1.push('', '', '', ''); // Summary col spacers

    // Row 2: Main titles
    const row2 = [
        'No.',
        'Name of Shop',
        ...data.weeks.map(w => {
            const n = w.weekNumber;
            const suffix = n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th';
            return `${n}${suffix} Week`;
        }),
        'Total Sales per Shop',
        'Avg Sales/Day',
        'Avg Sales/Month',
        'Rank'
    ];

    // Row 3: Date Ranges
    const row3 = ['', '', ...data.weeks.map(w => w.dateRange)];
    // Fill summary cols
    row3.push('', '', '', '');

    // Row 4: Day counts
    const row4 = ['', '', ...data.weeks.map(w => `${w.daysCount} days`)];
    // Fill summary cols
    row4.push('', '', '', '');

    // Data Rows
    const dataRows = data.sellers.map((seller, index) => {
        const weekSales = data.weeks.map(w => seller.weeklyBreakdown[w.weekNumber] || 0);
        return [
            index + 1,
            seller.shopName,
            ...weekSales,
            seller.totalSales,
            Math.round(seller.averageSalesPerDay),
            Math.round(seller.averageSalesPerMonth),
            seller.rankLabel
        ];
    });

    // Footer Row 1: Weekly Totals
    const footerRow1 = [
        '',
        'GRAND TOTAL SALES WEEKLY',
        ...data.weeks.map(w => data.grandTotalWeekly[w.weekNumber] || 0),
        '', '', '', ''
    ];

    // Footer Row 2: Monthly Total
    const footerRow2: (string | number)[] = [
        '', // Col A Empty
        'GRAND TOTAL SALES FOR THE 1ST MONTH OF PILOT TESTING', // Col B (Label)
        data.grandTotalMonthly // Col C (Start of Value)
    ];
    // Spacer for C-G merge (Weeks + Total Column)
    // Value is at Index 2. Merge covers numWeeks spacers.
    for (let i = 0; i < numWeeks; i++) footerRow2.push('');

    // Spacers for remaining summary cols: AvgDay, AvgMo, Rank (3 cols)
    footerRow2.push('', '', '');

    // Combine all
    const aoa = [row1, row2, row3, row4, ...dataRows, footerRow1, footerRow2];
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // Merges: { s: {r, c}, e: {r, c} } (0-indexed)
    const merges = [
        // Row 1: Green Header Span (C2 to end of weeks)
        { s: { r: 0, c: 2 }, e: { r: 0, c: 2 + numWeeks - 1 } },

        // Vertical Merges (Rows 2-4)
        { s: { r: 1, c: 0 }, e: { r: 3, c: 0 } }, // No.
        { s: { r: 1, c: 1 }, e: { r: 3, c: 1 } }, // Name of Shop

        // Summary Col Vertical Merges
        { s: { r: 1, c: 2 + numWeeks }, e: { r: 3, c: 2 + numWeeks } }, // Total Sales
        { s: { r: 1, c: 2 + numWeeks + 1 }, e: { r: 3, c: 2 + numWeeks + 1 } }, // Avg Day
        { s: { r: 1, c: 2 + numWeeks + 2 }, e: { r: 3, c: 2 + numWeeks + 2 } }, // Avg Month
        { s: { r: 1, c: 2 + numWeeks + 3 }, e: { r: 3, c: 2 + numWeeks + 3 } }, // Rank
    ];

    // Footer Merges (Row 2 of footer)
    const footerIndex = aoa.length - 1;
    // Value in Merge C to G (Index 2 to 2 + numWeeks)
    merges.push({ s: { r: footerIndex, c: 2 }, e: { r: footerIndex, c: 2 + numWeeks } });

    ws['!merges'] = merges;

    // Set column widths
    ws['!cols'] = [
        { wch: 5 },  // No.
        { wch: 30 }, // Shop Name
        ...data.weeks.map(() => ({ wch: 15 })), // Week columns
        { wch: 20 }, // Total Sales
        { wch: 15 }, // Avg Sales/Day
        { wch: 15 }, // Avg Sales/Month
        { wch: 10 }   // Rank
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Revenue Report');

    // Download
    XLSX.writeFile(wb, filename);
}

/**
 * Export revenue report to PDF
 */
export function exportToPDF(data: RevenueReportData, filename: string = 'revenue-report.pdf') {
    const doc = new jsPDF('landscape');

    // Add title
    doc.setFontSize(16);
    doc.text('Revenue Report', 14, 15);

    doc.setFontSize(10);
    doc.text(`Period: ${data.reportPeriod.startDate} to ${data.reportPeriod.endDate}`, 14, 22);
    doc.text(`Total Operating Days: ${data.reportPeriod.totalOperatingDays}`, 200, 22);

    // Prepare table headers (4-row structure)
    const numWeeks = data.weeks.length;
    const getSuffix = (n: number) => n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th';

    const head: any[] = [
        // Row 1: Informational header
        [
            { content: '', colSpan: 2, styles: { fillColor: [255, 255, 255] as [number, number, number] } },
            {
                content: 'No. of Week / Date Covered / No. of days operating in a week',
                colSpan: numWeeks,
                styles: { halign: 'center', fillColor: [16, 185, 129] as [number, number, number], textColor: [255, 255, 255] as [number, number, number], fontStyle: 'bold' }
            },
            { content: '', colSpan: 4, styles: { fillColor: [255, 255, 255] as [number, number, number] } }
        ],
        // Row 2: Main titles
        [
            { content: 'No.', rowSpan: 3, styles: { valign: 'middle', halign: 'center', fillColor: [253, 224, 71] as [number, number, number], textColor: [0, 0, 0] as [number, number, number], fontStyle: 'bold' } },
            { content: 'Name of Shop', rowSpan: 3, styles: { valign: 'middle', halign: 'center', fillColor: [253, 224, 71] as [number, number, number], textColor: [0, 0, 0] as [number, number, number], fontStyle: 'bold' } },
            ...data.weeks.map(w => ({
                content: `${w.weekNumber}${getSuffix(w.weekNumber)} Week`,
                styles: { halign: 'center', fillColor: [230, 243, 255] as [number, number, number], textColor: [0, 102, 204] as [number, number, number], fontStyle: 'bold' }
            })),
            { content: 'Total Sales per Shop', rowSpan: 3, styles: { valign: 'middle', halign: 'center', fillColor: [204, 255, 204] as [number, number, number], textColor: [0, 0, 0] as [number, number, number], fontStyle: 'bold' } },
            { content: 'Avg Sales per Day', rowSpan: 3, styles: { valign: 'middle', halign: 'center', fillColor: [252, 228, 236] as [number, number, number], textColor: [216, 27, 96] as [number, number, number], fontStyle: 'bold' } },
            { content: 'Avg Sales in Month', rowSpan: 3, styles: { valign: 'middle', halign: 'center', fillColor: [227, 242, 253] as [number, number, number], textColor: [21, 101, 192] as [number, number, number], fontStyle: 'bold' } },
            { content: 'Rank', rowSpan: 3, styles: { valign: 'middle', halign: 'center', fillColor: [255, 255, 255] as [number, number, number], textColor: [31, 41, 55] as [number, number, number], fontStyle: 'bold' } }
        ],
        // Row 3: Date Ranges
        [
            ...data.weeks.map(w => ({
                content: w.dateRange,
                styles: { halign: 'center', fillColor: [240, 247, 255] as [number, number, number], textColor: [0, 51, 102] as [number, number, number] }
            }))
        ],
        // Row 4: Day counts
        [
            ...data.weeks.map(w => ({
                content: `${w.daysCount} days`,
                styles: { halign: 'center', fontStyle: 'italic', fillColor: [243, 229, 245] as [number, number, number], textColor: [74, 20, 140] as [number, number, number] }
            }))
        ]
    ];

    // Prepare table body
    const body: any[][] = data.sellers.map((seller, index) => {
        const weekSales = data.weeks.map(w => seller.weeklyBreakdown[w.weekNumber] > 0
            ? seller.weeklyBreakdown[w.weekNumber].toLocaleString()
            : "-");

        return [
            index + 1,
            seller.shopName,
            ...weekSales,
            seller.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            Math.round(seller.averageSalesPerDay).toLocaleString(),
            Math.round(seller.averageSalesPerMonth).toLocaleString(),
            seller.rankLabel
        ];
    });

    // Add grand total row 1: Weekly
    const weeklyTotalRow = [
        '',
        'GRAND TOTAL SALES WEEKLY',
        ...data.weeks.map(w => (data.grandTotalWeekly[w.weekNumber] || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
        '', '', '', ''
    ];
    body.push(weeklyTotalRow);

    // Add grand total row 2: Monthly
    const monthlyTotalRow = [
        '',
        { content: 'GRAND TOTAL SALES FOR THE 1ST MONTH OF PILOT TESTING', colSpan: numWeeks },
        data.grandTotalMonthly.toLocaleString(),
        '', '', '', ''
    ];
    body.push(monthlyTotalRow);

    // Generate table
    autoTable(doc, {
        head: head,
        body: body,
        startY: 28,
        theme: 'grid',
        styles: {
            fontSize: 7,
            cellPadding: 2,
            lineColor: [200, 200, 200] as [number, number, number]
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 8 },
            1: { cellWidth: 45 },
            // Weekly columns
            ...Object.fromEntries(data.weeks.map((_, i) => [i + 2, { halign: 'right' }])),
            // Summary columns
            [numWeeks + 2]: { halign: 'right', cellWidth: 20 },
            [numWeeks + 3]: { halign: 'right', cellWidth: 15 },
            [numWeeks + 4]: { halign: 'right', cellWidth: 15 },
            [numWeeks + 5]: { halign: 'center', cellWidth: 15 }
        },
        didParseCell: function (cellData) {
            // Highlight Weekly Total Row
            if (cellData.row.index === body.length - 2) {
                cellData.cell.styles.fontStyle = 'bold';
                if (cellData.column.index >= 2 && cellData.column.index < 2 + numWeeks) {
                    cellData.cell.styles.lineWidth = { top: 1, bottom: 2, left: 0.1, right: 0.1 };
                }
            }

            // Highlight Monthly Total Row
            if (cellData.row.index === body.length - 1) {
                cellData.cell.styles.fillColor = [253, 224, 71] as [number, number, number]; // Yellow background
                cellData.cell.styles.fontStyle = 'bold';
                if (cellData.column.index === 1 + numWeeks) {
                    cellData.cell.styles.fontSize = 10;
                }
                // Clear yellow for other summary cols if they were spanned out in Excel
                if (cellData.column.index > 1 + numWeeks) {
                    cellData.cell.styles.fillColor = [255, 255, 255] as [number, number, number];
                }
            }

            // Highlight rank column for highest/lowest
            const rankColIndex = 2 + numWeeks + 3; // Correct index for Rank column
            if (cellData.column.index === rankColIndex) {
                if (cellData.cell.text[0] === 'highest' || cellData.cell.text[0] === 'lowest') {
                    cellData.cell.styles.fillColor = [253, 224, 71] as [number, number, number]; // Yellow
                    cellData.cell.styles.fontStyle = 'bold';
                }
            }
        }
    });

    // Save PDF
    doc.save(filename);
}

/**
 * Format report for printing
 */
export function formatReportForPrint() {
    // Add print-specific styles
    const style = document.createElement('style');
    style.innerHTML = `
    @media print {
      body * {
        visibility: hidden;
      }
      #revenue-report-table, #revenue-report-table * {
        visibility: visible;
      }
      #revenue-report-table {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      nav, aside, .no-print {
        display: none !important;
      }
      table {
        page-break-inside: auto;
      }
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
    }
  `;
    document.head.appendChild(style);

    // Trigger print dialog
    window.print();
}
