import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {
  getTimeZone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  }
}