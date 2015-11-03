#!/bin/sh
echo "Installing/updating modules..."
npm install || exit 1
echo "Building..."
npm run build || exit 1
echo "Project is ready in dist/"
