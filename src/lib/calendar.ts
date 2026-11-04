/**
 * Helper untuk membuat tautan Google Calendar dan download file .ics
 */

interface CalendarEventParams {
  title: string;
  description: string;
  location: string;
  startDate: string; // ISO format
  endDate: string; // ISO format
}

export function createGoogleCalendarUrl({
  title,
  description,
  location,
  startDate,
  endDate,
}: CalendarEventParams): string {
  // Format to UTC string YYYYMMDDTHHMMSSZ
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

export function downloadIcsFile({
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

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//skywannn wedding//Wedding Invitation//ID',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
    `LOCATION:${location}`,
    `DTSTART:${formatUtc(startDate)}`,
    `DTEND:${formatUtc(endDate)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'wedding-event.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
