/**
 * Helper untuk membuat tautan langsung ke Google Calendar (tanpa unduhan file)
 */

interface CalendarEventParams {
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO format (e.g. 2026-12-10T08:00:00+07:00)
  endDate: string; // ISO format
}

/**
 * Buat tautan langsung ke Google Calendar
 */
export function createGoogleCalendarUrl({
  title,
  description,
  location,
  startDate,
  endDate,
}: CalendarEventParams): string {
  const formatUtc = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const startUtc = formatUtc(startDate);
  const endUtc = formatUtc(endDate);

  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', title);
  url.searchParams.set('dates', `${startUtc}/${endUtc}`);
  url.searchParams.set('details', description);
  url.searchParams.set('location', location);

  return url.toString();
}
