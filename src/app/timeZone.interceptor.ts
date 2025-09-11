import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimezoneService } from './timeZone.service';

@Injectable()
export class TimezoneInterceptor implements HttpInterceptor {
  constructor(private timezoneService: TimezoneService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timezone = this.timezoneService.getTimeZone();

    const clonedReq = req.clone({
      setHeaders: {
        'X-Timezone': timezone
      }
    });

    return next.handle(clonedReq);
  }
}
