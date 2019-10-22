#!/usr/bin/env sh
set -e

# build
cd client
npm run build

# navigate into the build output directory
cd ../