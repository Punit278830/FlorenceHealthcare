import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout
  private timeoutWarning: any;
  private sessionTimeout: any;
  private lastActivity: number = Date.now();

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.initializeSessionTimeout();
    this.setupActivityListeners();
  }

  private initializeSessionTimeout(): void {
    this.resetSessionTimeout();
  }

  private setupActivityListeners(): void {
    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.updateLastActivity();
      }, true);
    });
  }

  private updateLastActivity(): void {
    this.lastActivity = Date.now();
    this.resetSessionTimeout();
  }

  private resetSessionTimeout(): void {
    // Clear existing timeouts
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }
    if (this.timeoutWarning) {
      clearTimeout(this.timeoutWarning);
    }

    // Set warning timeout
    this.timeoutWarning = setTimeout(() => {
      this.showTimeoutWarning();
    }, this.SESSION_TIMEOUT - this.WARNING_TIME);

    // Set session timeout
    this.sessionTimeout = setTimeout(() => {
      this.handleSessionTimeout();
    }, this.SESSION_TIMEOUT);
  }

  private showTimeoutWarning(): void {
    this.toastr.warning(
      'Your session will expire in 5 minutes due to inactivity. Please perform any action to continue.',
      'Session Timeout Warning',
      { timeOut: 10000 }
    );
  }

  private handleSessionTimeout(): void {
    console.log('Session timed out due to inactivity');
    this.toastr.error('Session expired due to inactivity. Please login again.');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  public extendSession(): void {
    this.updateLastActivity();
  }

  public isSessionActive(): boolean {
    const timeSinceLastActivity = Date.now() - this.lastActivity;
    return timeSinceLastActivity < this.SESSION_TIMEOUT;
  }

  public getTimeUntilTimeout(): number {
    const timeSinceLastActivity = Date.now() - this.lastActivity;
    return Math.max(0, this.SESSION_TIMEOUT - timeSinceLastActivity);
  }

  public destroy(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
    }
    if (this.timeoutWarning) {
      clearTimeout(this.timeoutWarning);
    }
  }
}
