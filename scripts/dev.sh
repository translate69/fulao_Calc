#!/bin/bash
set -Eeuo pipefail

PORT=5000
COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"
DEPLOY_RUN_PORT="${DEPLOY_RUN_PORT:-${PORT}}"

cd "${COZE_WORKSPACE_PATH}"

echo "Building Next.js app for dev preview (prebuilt to avoid cold-compile race)..."
pnpm next build

echo "Starting Next.js server (dev preview) on port ${DEPLOY_RUN_PORT}..."
exec pnpm next start -p "${DEPLOY_RUN_PORT}" -H 0.0.0.0
