/**
 * Helper untuk tautan Google Calendar dan Kalender Bawaan Ponsel (Mobile Calendar)
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

/**
 * Buka acara langsung di Kalender Bawaan HP (Apple Calendar / Android Native Calendar)
 */
export function openDeviceCalendar({
  title,
  description,
  location,
  startDate,
  endDate,
}: CalendarEventParams) {
  const formatUtc = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const startUtc = formatUtc(startDate);
  const endUtc = formatUtc(endDate);

  // Buat data kalender standar iCalendar RFC 5545
  const icsData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//skywannn wedding//Wedding Calendar//ID',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, ' ')}`,
    `LOCATION:${location}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const blobUrl = window.URL.createObjectURL(blob);
  const tempLink = document.createElement('a');
  tempLink.href = blobUrl;
  tempLink.setAttribute('download', 'wedding-reminder.ics');
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(blobUrl);
}
