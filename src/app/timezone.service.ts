import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TimezoneService {
  private timeZone: string;

  constructor() {
    // Get user's system time zone (IANA format)
    this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  }

  getUserTimeZone(): string {
    return this.timeZone;
  }
}
