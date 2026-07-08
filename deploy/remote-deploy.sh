#!/usr/bin/env bash
# Robust redeploy for /opt/nova on the shared host.
#
# Pull the new image, restart, health-check with retries, and ROLL BACK to the
# previously-running image if the new one never becomes healthy — so a bad deploy
# during the unattended review window self-heals instead of leaving prod broken.
# Prunes dangling images only on success (disk hygiene on the shared host).
set -uo pipefail
cd /opt/nova

COMPOSE="docker compose -f docker-compose.prod.yml"
IMAGE="ghcr.io/xdroberto/nova-analytics:latest"

wait_healthy() {
  for _ in $(seq 1 "$1"); do
    curl -fsS http://127.0.0.1:3000/api/health >/dev/null 2>&1 && return 0
    sleep 3
  done
  return 1
}

# Image the currently-running container uses, so we can revert to it exactly.
prev_image=$($COMPOSE ps -q web 2>/dev/null | xargs -r docker inspect --format '{{.Image}}' 2>/dev/null || true)
echo "previous image: ${prev_image:-<none, first deploy>}"

$COMPOSE pull web
$COMPOSE up -d

if wait_healthy 20; then
  echo "✅ deploy healthy"
  docker image prune -f
  exit 0
fi

echo "❌ new image failed health checks"
$COMPOSE logs --tail 50 web || true
if [ -n "$prev_image" ]; then
  echo "↩ rolling back to $prev_image"
  docker tag "$prev_image" "$IMAGE"
  $COMPOSE up -d
  if wait_healthy 10; then
    echo "✅ rolled back to previous image (deploy still reported as FAILED)"
  else
    echo "⚠ rollback did not recover — manual intervention required"
  fi
else
  echo "⚠ no previous image to roll back to (first deploy)"
fi
exit 1
