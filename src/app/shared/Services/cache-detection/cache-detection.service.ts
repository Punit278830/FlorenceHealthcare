import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheDetectionService {
  private readonly APP_VERSION_KEY = 'app_version';
  private readonly CURRENT_VERSION = Date.now().toString(); // Build timestamp
  
  private cacheIssueDetected$ = new BehaviorSubject<boolean>(false);
  
  constructor() {
    this.checkForCacheIssues();
  }

  checkForCacheIssues(): void {
    const storedVersion = localStorage.getItem(this.APP_VERSION_KEY);
    
    if (storedVersion && storedVersion !== this.CURRENT_VERSION) {
      console.warn('🔄 Cache issue detected - version mismatch');
      console.log('Stored version:', storedVersion);
      console.log('Current version:', this.CURRENT_VERSION);
      
      this.cacheIssueDetected$.next(true);
      this.clearApplicationCache();
    } else {
      localStorage.setItem(this.APP_VERSION_KEY, this.CURRENT_VERSION);
    }
  }

  private clearApplicationCache(): void {
    try {
      // Clear localStorage (except essential auth data)
      const essentialKeys = ['data', 'currentStaffId', 'currentHospitalId', 'userRole'];
      const allKeys = Object.keys(localStorage);
      
      allKeys.forEach(key => {
        if (!essentialKeys.includes(key)) {
          localStorage.removeItem(key);
        }
      });

      // Clear sessionStorage
      sessionStorage.clear();

      // Clear component state cache if any
      this.clearComponentStateCache();

      // Update version
      localStorage.setItem(this.APP_VERSION_KEY, this.CURRENT_VERSION);
      
      console.log('✅ Application cache cleared successfully');
      
      // Show user notification
      this.showCacheRefreshNotification();
      
    } catch (error) {
      console.error('Error clearing application cache:', error);
    }
  }

  private clearComponentStateCache(): void {
    // Clear any component-specific cached data
    const cacheKeys = [
      'hospital_list_cache',
      'staff_list_cache',
      'department_list_cache',
      'role_list_cache'
    ];
    
    cacheKeys.forEach(key => {
      localStorage.removeItem(key);
    });
  }

  private showCacheRefreshNotification(): void {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #007bff;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-family: Arial, sans-serif;
        max-width: 300px;
      ">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>🔄</span>
          <div>
            <strong>App Updated!</strong><br>
            <small>Cache cleared for latest features</small>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  }

  getCacheIssueStatus() {
    return this.cacheIssueDetected$.asObservable();
  }

  forceRefresh(): void {
    console.log('🔄 Forcing application refresh...');
    localStorage.setItem(this.APP_VERSION_KEY, this.CURRENT_VERSION);
    window.location.reload();
  }

  getVersionInfo() {
    return {
      current: this.CURRENT_VERSION,
      stored: localStorage.getItem(this.APP_VERSION_KEY),
      buildTime: new Date(parseInt(this.CURRENT_VERSION)).toLocaleString()
    };
  }
}
