// Set default timezone to IST globally for all date/time operations
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Kolkata');

// Utility function to always format date/time in IST
export function toIST(date: string | Date): string {
  return dayjs(date).tz('Asia/Kolkata').format('YYYY-MM-DDTHH:mm:ss');
}