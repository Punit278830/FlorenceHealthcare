import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TimezoneService {
  getIanaTimeZone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  }

  // Optional: offset in minutes (e.g., -240 for EDT)
  getOffsetMinutes(): number {
    return new Date().getTimezoneOffset() * -1; // sign-flipped for intuition
  }
}