// src/app/interceptors/timezone.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimezoneService } from 'src/app/timeZone.service';

@Injectable()
export class TimezoneInterceptor implements HttpInterceptor {
  constructor(private timezoneService: TimezoneService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const timeZone = this.timezoneService.getIanaTimeZone(); // e.g., "Asia/Kolkata"

    const cloned = req.clone({
      setHeaders: {
        'X-TimeZone': timeZone
      }
    });

    return next.handle(cloned);
  }
}
