import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {
  private readonly IST_TIMEZONE = 'Asia/Kolkata';

  constructor() { }

  /**
   * Convert any date to IST for display purposes
   * @param date - Date to convert (can be UTC, local, or any timezone)
   * @param format - Optional format string (default: 'DD/MM/YYYY hh:mm A')
   * @returns Formatted string in IST
   */
  convertToIST(date: any, format: string = 'DD/MM/YYYY hh:mm A'): string {
    if (!date) return '';
    
    try {
      // Parse the date and convert to IST
      const istDate = dayjs(date).tz(this.IST_TIMEZONE);
      return istDate.format(format);
    } catch (error) {
      console.error('Error converting to IST:', error);
      return '';
    }
  }

  /**
   * Convert date to IST for display (date only)
   * @param date - Date to convert
   * @returns Formatted date string in IST (DD/MM/YYYY)
   */
  convertToISTDateOnly(date: any): string {
    return this.convertToIST(date, 'DD/MM/YYYY');
  }

  /**
   * Convert date to IST for display (time only)
   * @param date - Date to convert
   * @returns Formatted time string in IST (hh:mm A)
   */
  convertToISTTimeOnly(date: any): string {
    return this.convertToIST(date, 'hh:mm A');
  }

  /**
   * Get current IST time
   * @param format - Optional format string
   * @returns Current time in IST
   */
  getCurrentIST(format: string = 'DD/MM/YYYY hh:mm A'): string {
    return dayjs().tz(this.IST_TIMEZONE).format(format);
  }

  /**
   * Convert IST date/time to UTC for API calls
   * @param date - Date in IST (or assumed to be IST)
   * @returns UTC Date object
   */
  convertISTToUTC(date: any): Date {
    if (!date) return new Date();
    
    try {
      // Assume the input date is in IST and convert to UTC
      const utcDate = dayjs.tz(date, this.IST_TIMEZONE).utc().toDate();
      return utcDate;
    } catch (error) {
      console.error('Error converting IST to UTC:', error);
      return new Date();
    }
  }

  /**
   * Format payment date for display (handles multiple payment dates)
   * @param paymentDetails - Array of payment details
   * @returns Formatted payment date string
   */
  formatPaymentDate(paymentDetails: any[]): string {
    if (!paymentDetails || paymentDetails.length === 0) {
      return 'N/A';
    }

    // Find the most recent payment date
    const validDates = paymentDetails
      .map(payment => payment?.paymentDate)
      .filter(date => this.isValidDate(date))
      .map(date => new Date(date))
      .filter(date => !isNaN(date.getTime()));

    if (validDates.length === 0) {
      return 'N/A';
    }

    // Get the most recent date and convert to IST
    const latestDate = new Date(Math.max(...validDates.map(d => d.getTime())));
    return this.convertToIST(latestDate);
  }

  /**
   * Get the current timezone
   * @returns The timezone identifier (currently always IST)
   */
  getTimeZone(): string {
    return this.IST_TIMEZONE;
  }

  /**
   * Check if a date value is valid
   * @param date - Date to validate
   * @returns boolean indicating if date is valid
   */
  private isValidDate(date: any): boolean {
    if (!date || date === null || date === undefined || date === '' || 
        date === 'null' || date === 'nullZ' || date === 'undefined') {
      return false;
    }
    if (typeof date === 'string' && (date.toLowerCase().includes('null') || date.toLowerCase().includes('undefined'))) {
      return false;
    }
    return true;
  }

  /**
   * Format appointment date and time for display
   * @param date - Appointment date
   * @param time - Appointment time (string format like "09:30 AM")
   * @returns Combined formatted date and time string
   */
  formatAppointmentDateTime(date: any, time?: string): string {
    if (!date) return '';

    const dateStr = this.convertToISTDateOnly(date);
    return time ? `${dateStr} ${time}` : dateStr;
  }
}
