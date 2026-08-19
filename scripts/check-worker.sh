#!/usr/bin/env bash
#
# Verifies that the Workers Static Assets config in wrangler.jsonc serves the
# site the way Cloudflare Pages does, by running the real workerd runtime
# locally against dist/ and asserting on actual responses.
#
#   npm run build && npm run check:worker
#
# Checks routing, the legacy _redirects rules, _headers cache lifetimes, and
# that a missing page returns a real 404 rather than a 200 (which is what
# Workers does if `not_found_handling` is left at its default of "none", or
# worse, set to "single-page-application").
set -uo pipefail

PORT=8787
BASE="http://localhost:$PORT"
LOG=$(mktemp)
FAILURES=0

if [ ! -d dist ]; then
  echo "dist/ not found — run 'npm run build' first." >&2
  exit 1
fi

npx wrangler dev --port "$PORT" --local >"$LOG" 2>&1 &
WRANGLER_PID=$!
trap 'kill "$WRANGLER_PID" 2>/dev/null; rm -f "$LOG"' EXIT

for _ in $(seq 1 60); do
  curl -s -o /dev/null -m 2 "$BASE/" && break
  sleep 1
done

if ! curl -s -o /dev/null -m 2 "$BASE/"; then
  echo "wrangler dev did not start:" >&2
  cat "$LOG" >&2
  exit 1
fi

# expect <path> <status> [location-or-header-substring]
expect() {
  local path=$1 want_status=$2 want_extra=${3-}
  local headers status
  headers=$(curl -sI -m 10 "$BASE$path")
  status=$(printf '%s' "$headers" | head -1 | awk '{print $2}')

  if [ "$status" != "$want_status" ]; then
    echo "FAIL $path — expected $want_status, got $status"
    FAILURES=$((FAILURES + 1))
    return
  fi

  if [ -n "$want_extra" ] && ! printf '%s' "$headers" | tr -d '\r' | grep -qi -- "$want_extra"; then
    echo "FAIL $path — missing expected header: $want_extra"
    printf '%s\n' "$headers" | tr -d '\r' | sed 's/^/       /'
    FAILURES=$((FAILURES + 1))
    return
  fi

  printf 'ok   %-44s %s\n' "$path" "$want_status"
}

echo "--- trailing slash (astro trailingSlash: always) ---"
expect /about           307 "location: /about/"
expect /about/          200
expect /blog            307 "location: /blog/"
expect /blog/           200

echo "--- content routes ---"
expect /                                     200
expect /blog/lifelong-learning/              200
expect /photography/durham/                  200
expect /photography/durham/DSC_0044/         200

echo "--- legacy redirects (_redirects) ---"
expect /os/some-old-post/          301 "location: /blog/some-old-post/"
expect /os/windows/thing/          301 "location: /blog/thing/"
expect /university/notes/          301 "location: /blog/notes/"
expect /arduino/x/                 301 "location: /blog/x/"
expect /programming-languages/y/   301 "location: /blog/y/"

echo "--- cache headers (_headers) ---"
ASSET=$(find dist/_astro -name '*.webp' | head -1 | sed 's|^dist||')
expect "$ASSET"           200 "cache-control: public, max-age=31536000, immutable"
expect /logo.svg          200 "cache-control: public, max-age=86400"

echo "--- not_found_handling: must be a real 404, never a 200 ---"
expect /this-does-not-exist/  404
if ! curl -s -m 10 "$BASE/this-does-not-exist/" | grep -q "Page not found"; then
  echo "FAIL 404 body is not the custom 404 page"
  FAILURES=$((FAILURES + 1))
else
  printf 'ok   %-44s %s\n' "404 body" "custom page"
fi

echo
if [ "$FAILURES" -gt 0 ]; then
  echo "$FAILURES failure(s)."
  exit 1
fi
echo "Worker config serves the site correctly."
