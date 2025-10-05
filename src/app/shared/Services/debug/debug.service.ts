import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api_Url } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DebugService {
  constructor(private http: HttpClient) {}

  logEnvironmentInfo(): void {
    console.group('🔍 Environment Debug Info');
    console.log('Current URL:', window.location.href);
    console.log('Hostname:', window.location.hostname);
    console.log('Protocol:', window.location.protocol);
    console.log('Port:', window.location.port);
    console.log('API URL:', api_Url);
    
    // Check localStorage contents
    console.log('LocalStorage keys:', Object.keys(localStorage));
    console.log('User data exists:', !!localStorage.getItem('data'));
    console.log('Staff ID exists:', !!localStorage.getItem('currentStaffId'));
    console.log('Hospital ID exists:', !!localStorage.getItem('currentHospitalId'));
    
    // Test CORS preflight
    this.testCorsSettings();
    console.groupEnd();
  }

  private testCorsSettings(): void {
    console.log('Testing CORS settings...');
    
    // Test with a simple GET request
    fetch(api_Url + 'Hospitals', {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      }
    })
    .then(response => {
      console.log('CORS preflight response:', response.status);
      console.log('CORS headers:', response.headers);
    })
    .catch(error => {
      console.error('CORS preflight failed:', error);
    });
  }

  async testApiEndpoints(): Promise<void> {
    console.group('🚀 API Endpoints Test');
    
    const endpoints = [
      'Hospitals',
      'StaffInfoes',
      'RoleMaster'
    ];

    for (const endpoint of endpoints) {
      try {
        const testUrl = api_Url + endpoint;
        console.log(`Testing: ${testUrl}`);
        
        const response = await fetch(testUrl, { method: 'HEAD' });
        console.log(`✅ ${endpoint}: ${response.status}`);
      } catch (error) {
        console.error(`❌ ${endpoint}: ${error}`);
      }
    }
    
    console.groupEnd();
  }

  logSessionData(): void {
    console.group('🔐 Session Data');
    
    try {
      const userData = localStorage.getItem('data');
      if (userData) {
        const parsed = JSON.parse(userData);
        console.log('User role:', parsed.userRole);
        console.log('Login status:', parsed.loginStatus);
        console.log('User ID:', parsed.loginId);
      } else {
        console.log('No user data found');
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    
    console.groupEnd();
  }

  checkForCommonIssues(): string[] {
    const issues: string[] = [];
    
    // Check API URL format
    if (!api_Url.startsWith('http')) {
      issues.push('API URL does not start with http/https');
    }
    
    if (!api_Url.endsWith('/')) {
      issues.push('API URL does not end with forward slash');
    }
    
    // Check localStorage quota
    try {
      const testKey = 'test_storage_' + Date.now();
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
    } catch (error) {
      issues.push('LocalStorage quota exceeded or not available');
    }
    
    // Check if running in iframe (can cause issues)
    if (window !== window.top) {
      issues.push('Application is running inside an iframe');
    }
    
    // Check for mixed content issues
    if (window.location.protocol === 'https:' && api_Url.startsWith('http:')) {
      issues.push('Mixed content warning: HTTPS page trying to access HTTP API');
    }
    
    return issues;
  }

  runFullDiagnostic(): void {
    console.clear();
    console.log('🏥 Florence Healthcare - Deployment Diagnostic');
    console.log('='.repeat(50));
    
    this.logEnvironmentInfo();
    this.logSessionData();
    
    const issues = this.checkForCommonIssues();
    if (issues.length > 0) {
      console.group('⚠️  Potential Issues Found');
      issues.forEach(issue => console.warn(issue));
      console.groupEnd();
    } else {
      console.log('✅ No obvious issues detected');
    }
    
    this.testApiEndpoints();
  }
}
