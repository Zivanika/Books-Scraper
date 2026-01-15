#!/bin/bash
set -e

echo "🔧 Setting up Playwright..."

# Check if we're in a container or have root access
if [ -f /.dockerenv ] || [ "$EUID" -eq 0 ]; then
    echo "✅ Running in container or as root - can install system dependencies"
    # Try to install browsers with deps
    npx playwright install chromium --with-deps || npx playwright install chromium
else
    echo "⚠️  Not running as root - skipping system dependencies"
    # Install browsers without system deps (they'll be installed separately)
    PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=0 npx playwright install chromium || {
        echo "⚠️  Browser installation failed, will use system Chromium if available"
        export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
    }
fi

echo "✅ Playwright setup complete"
