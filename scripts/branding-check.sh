#!/usr/bin/env bash
# CI gate: zero original-template branding may remain in user-visible code.
# Forbidden strings come from the Phase-2 branding inventory (docs/ai-process/BRAIN.md)
# plus the dashboard-data cleanup (aiy/aiycap, acme inc/corp/industries, storeframe,
# the nova.robertobh.dev personal-domain leak, sandbox, and the "shadcn ui kit" /
# "shadcn/ui" template copy).
# NOTE: README.md and LICENSE are intentionally NOT scanned — MIT attribution to the
# original template lives there and is required. "radix-nova" (shadcn style name) and
# bare "shadcn" library references (the `shadcn` npm dep, `shadcn/tailwind.css` import,
# `@shadcn/react` import) are legitimate and are NOT matched: the patterns below only
# catch the more specific "shadcn/ui" and "shadcn ui kit" literals, which were leftover
# template demo copy (now removed). "\bsandbox\b" is word-bounded so it won't fire on
# substrings like "sandboxed"; verified no legitimate standalone "sandbox" exists in src.
#
# Fails CLOSED: a grep execution error (missing path, bad pattern) fails the build —
# it is never reported as "clean". No extension allowlist: every text file under the
# scanned paths is checked (-I skips binaries).
set -uo pipefail

FORBIDDEN='arhamkhnz|arham|weblabs|studio.admin|studioadmin|next-shadcn-admin-dashboard|next-colocation-template|aiy cap|aiycap|aiy-cap|hello, aiy|acme\.inc|acme inc|acme corp|acme industries|storeframe|robertobh|\bsandbox\b|shadcn ui kit|shadcn/ui'

for path in src package.json; do
  if [ ! -e "$path" ]; then
    echo "❌ branding-check: expected path '$path' not found (wrong working directory?)"
    exit 2
  fi
done

grep -rniIE "$FORBIDDEN" src package.json
status=$?
if [ "$status" -eq 0 ]; then
  echo "❌ Original branding found (see hits above)"
  exit 1
elif [ "$status" -ge 2 ]; then
  echo "❌ branding-check: grep failed with exit code $status — treating as failure"
  exit 2
fi
echo "✅ Branding clean"
