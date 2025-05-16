#!/bin/bash

# Exit immediately if any command fails
set -e

echo "🔨 Building production build..."
npm run build

echo "🔍 Starting local preview server (Vite Preview)..."
npm run preview &

# Save the preview server's PID to kill later
PREVIEW_PID=$!

sleep 2

echo "🌐 Opening preview in browser..."
if command -v xdg-open > /dev/null; then
  xdg-open http://localhost:4173
elif command -v open > /dev/null; then
  open http://localhost:4173
else
  echo "⚠️  Please open http://localhost:4173 manually (no xdg-open or open command found)"
fi

echo "✅ Check if everything looks good."

read -p "👉 Press Enter to DEPLOY to GitHub Pages, or CTRL+C to cancel..."

echo "📦 Deploying to GitHub Pages..."
kill $PREVIEW_PID
npm run ship

echo "✅ Deployment complete!"
