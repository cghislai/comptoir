#!/bin/sh
echo "Cleaning..."
npm run prune
echo "Installing modules..."
npm install || exit 1
echo "Building..."
npm run build || exit 1
echo "Project is ready in dist/"
