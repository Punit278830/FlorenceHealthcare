#!/bin/bash

# Florence Healthcare - Cache Busting Deployment Script
# This script helps ensure users get fresh files after deployment

echo "🏥 Florence Healthcare - Post-Deployment Cache Clearing"
echo "======================================================"

# Update build timestamp in environment
TIMESTAMP=$(date +%s)
echo "Build timestamp: $TIMESTAMP"

# Add cache busting to index.html
if [ -f "dist/medisyncro/index.html" ]; then
    echo "Adding cache busting to index.html..."
    sed -i "s/<html/<html data-version=\"$TIMESTAMP\"/" dist/medisyncro/index.html
    
    # Add cache control headers directive
    echo "Adding cache control directives..."
    cat >> dist/medisyncro/.htaccess << EOF

# Cache Busting Headers
<IfModule mod_headers.c>
    # Force revalidation of JavaScript and CSS files
    <FilesMatch "\.(js|css|html)$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
        Header set Pragma "no-cache"
        Header set Expires "0"
    </FilesMatch>
    
    # Set version header
    Header set X-App-Version "$TIMESTAMP"
</IfModule>

# Prevent caching of main files during updates
<FilesMatch "^(main|polyfills|runtime|vendor)\.[a-f0-9]+\.(js|css)$">
    Header set Cache-Control "no-cache, must-revalidate"
</FilesMatch>
EOF
fi

echo "✅ Cache busting configuration added!"
echo ""
echo "🔧 Manual steps for immediate fix:"
echo "1. Clear browser cache (Ctrl+Shift+Delete)"
echo "2. Hard refresh (Ctrl+F5 or Cmd+Shift+R)"
echo "3. Open DevTools > Network tab > Disable cache checkbox"
echo "4. Test in incognito/private browsing mode"
echo ""
echo "📋 For production deployment:"
echo "1. Update web.config with proper cache headers"
echo "2. Configure your web server to prevent caching of .js/.css files"
echo "3. Consider implementing proper versioning strategy"
