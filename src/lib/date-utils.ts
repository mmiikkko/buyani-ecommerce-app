/**
 * Date utility functions for revenue reports
 */

/**
 * Get all weeks in a given month with their date ranges
 * @param year - Year (e.g., 2024)
 * @param month - Month (1-12)
 * @returns Array of week objects with start and end dates
 */
export function getWeeksInMonth(year: number, month: number): Array<{ weekNumber: number; startDate: Date; endDate: Date; daysCount: number }> {
    const weeks: Array<{ weekNumber: number; startDate: Date; endDate: Date; daysCount: number }> = [];

    // First day of the month
    const firstDay = new Date(year, month - 1, 1);
    // Last day of the month
    const lastDay = new Date(year, month, 0);

    let weekNumber = 1;
    let currentDate = new Date(firstDay);

    while (currentDate <= lastDay) {
        const weekStart = new Date(currentDate);

        // Calculate week end (6 days later or end of month, whichever comes first)
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekEnd.getDate() + 6);

        if (weekEnd > lastDay) {
            const actualEndDate = new Date(lastDay);
            const diffTime = Math.abs(actualEndDate.getTime() - weekStart.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

            weeks.push({
                weekNumber,
                startDate: weekStart,
                endDate: actualEndDate,
                daysCount: diffDays
            });
            break;
        } else {
            weeks.push({
                weekNumber,
                startDate: weekStart,
                endDate: weekEnd,
                daysCount: 7
            });
        }

        // Move to next week
        currentDate.setDate(currentDate.getDate() + 7);
        weekNumber++;
    }

    return weeks;
}

/**
 * Get week number within a month for a given date
 * @param date - Date to check
 * @returns Week number (1-5) within the month
 */
export function getWeekNumberInMonth(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dayOfMonth = date.getDate();

    const weeks = getWeeksInMonth(year, month);

    for (const week of weeks) {
        if (date >= week.startDate && date <= week.endDate) {
            return week.weekNumber;
        }
    }

    return 1; // Fallback
}

/**
 * Format date range as string
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Formatted string like "Jul 29 - Aug 4"
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const startMonth = months[startDate.getMonth()];
    const startDay = startDate.getDate();
    const endMonth = months[endDate.getMonth()];
    const endDay = endDate.getDate();

    if (startMonth === endMonth) {
        return `${startMonth} ${startDay} - ${endDay}`;
    } else {
        return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
}

/**
 * Get month name from number
 * @param month - Month number (1-12)
 * @returns Month name
 */
export function getMonthName(month: number): string {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1] || 'Unknown';
}

/**
 * Parse YYYY-MM format to year and month
 * @param dateString - Date string in YYYY-MM format
 * @returns Object with year and month
 */
export function parseYearMonth(dateString: string): { year: number; month: number } {
    const [year, month] = dateString.split('-').map(Number);
    return { year, month };
}

/**
 * Format year and month to YYYY-MM
 * @param year - Year
 * @param month - Month (1-12)
 * @returns Formatted string
 */
export function formatYearMonth(year: number, month: number): string {
    return `${year}-${String(month).padStart(2, '0')}`;
}
