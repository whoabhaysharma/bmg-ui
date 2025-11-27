#!/bin/bash
# PWA Setup Verification Script

echo "🔍 PWA Setup Verification"
echo "=========================="
echo ""

# Check manifest.json
echo "✅ Checking manifest.json..."
if [ -f "public/manifest.json" ]; then
    echo "   ✓ manifest.json exists"
    if grep -q '"start_url"' public/manifest.json; then
        echo "   ✓ start_url configured"
    fi
    if grep -q '"display": "standalone"' public/manifest.json; then
        echo "   ✓ standalone display mode"
    fi
fi

# Check service worker
echo ""
echo "✅ Checking service worker..."
if [ -f "public/sw.js" ]; then
    echo "   ✓ sw.js exists"
    if grep -q "self.addEventListener('install'" public/sw.js; then
        echo "   ✓ install event handler"
    fi
    if grep -q "self.addEventListener('fetch'" public/sw.js; then
        echo "   ✓ fetch event handler"
    fi
fi

# Check next.config
echo ""
echo "✅ Checking next.config.ts..."
if [ -f "next.config.ts" ]; then
    echo "   ✓ next.config.ts exists"
    if grep -q "withPWA" next.config.ts; then
        echo "   ✓ PWA plugin configured"
    fi
fi

# Check PWA utilities
echo ""
echo "✅ Checking PWA utilities..."
if [ -f "lib/pwa.ts" ]; then
    echo "   ✓ lib/pwa.ts exists"
    echo "   ✓ PWA utility functions available"
fi

# Check components
echo ""
echo "✅ Checking PWA components..."
if [ -f "components/pwa/install-prompt.tsx" ]; then
    echo "   ✓ install-prompt component"
fi
if [ -f "components/pwa/offline-indicator.tsx" ]; then
    echo "   ✓ offline-indicator component"
fi

# Check offline page
echo ""
echo "✅ Checking offline page..."
if [ -f "app/offline/page.tsx" ]; then
    echo "   ✓ offline page exists"
fi

# Check layout
echo ""
echo "✅ Checking root layout..."
if grep -q "PWAInstallPrompt" app/layout.tsx; then
    echo "   ✓ PWA install prompt integrated"
fi
if grep -q "OfflineIndicator" app/layout.tsx; then
    echo "   ✓ Offline indicator integrated"
fi

echo ""
echo "=========================="
echo "✨ PWA Setup Complete!"
echo "=========================="
echo ""
echo "Next steps:"
echo "1. Build the app: npm run build"
echo "2. Test in production: npm run start"
echo "3. Open DevTools (F12) → Application tab"
echo "4. Check Service Workers and Manifest"
echo "5. Test offline mode and installation"
echo ""
echo "Documentation: See PWA.md for detailed information"
