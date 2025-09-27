import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// Add global error handling for localStorage issues
window.addEventListener('error', (event) => {
  if (event.error && event.error.message && event.error.message.includes('JSON')) {
    console.warn('JSON error detected, clearing localStorage');
    localStorage.clear();
    window.location.reload();
  }
});

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => {
    console.error('Bootstrap error:', err);
    // Check if it's a localStorage related error
    if (err.message && (err.message.includes('JSON') || err.message.includes('localStorage'))) {
      console.warn('Clearing localStorage due to bootstrap error');
      localStorage.clear();
      window.location.reload();
    }
  });

