#!/usr/bin/env bash
# CI gate: zero original-template branding may remain in user-visible code.
# Forbidden strings come from the Phase-2 branding inventory (docs/ai-process/BRAIN.md).
# NOTE: README.md and LICENSE are intentionally NOT scanned — MIT attribution to the
# original template lives there and is required. "radix-nova" (shadcn style name) and
# bare "shadcn" library references are legitimate and not matched by these patterns.
set -euo pipefail

FORBIDDEN='arhamkhnz|arham|weblabs|studio.admin|studioadmin|next-shadcn-admin-dashboard|next-colocation-template'

if grep -rniE "$FORBIDDEN" src package.json --include="*.ts" --include="*.tsx" --include="*.json" --include="*.css" --include="*.svg" --include="*.ico" --include="*.html" 2>/dev/null; then
  echo "❌ Original branding found (see hits above)"
  exit 1
fi
echo "✅ Branding clean"
