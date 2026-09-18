/**
 * panndano.com — Worker entry point for the Workers-with-Assets static site.
 *
 * Sole purpose: canonicalise the hostname. `www.panndano.com` and
 * `panndano.com` are both bound as Custom Domains to this Worker and both
 * used to serve identical 200s, which is a duplicate-content problem for SEO.
 * This Worker 301s the `www` host to the apex host and otherwise gets out of
 * the way, handing every request to the static asset server untouched.
 *
 * NOTE: `assets.run_worker_first` must stay `true` in wrangler.jsonc. With the
 * default (`false`), Cloudflare serves any matching static asset *before*
 * invoking this script, so `/`, `/articles/*` etc. would never reach this code
 * and the redirect would silently do nothing for virtually all real traffic.
 *
 * NOTE: `_worker.js` must stay listed in `.assetsignore`. Unlike Pages, Workers
 * Assets does NOT treat this filename as reserved; without that entry this file
 * is published as a downloadable static asset at /_worker.js.
 */

const WWW_HOST = "www.panndano.com";
const APEX_HOST = "panndano.com";

export default {
  async fetch(request, env) {
    // Fail-open: any unexpected error in the redirect logic must never take
    // the site down, so it falls through to normal static asset serving.
    try {
      const url = new URL(request.url);

      // `URL` lowercases the host during parsing, so this comparison is
      // already case-insensitive (Host headers are case-insensitive per RFC
      // 9110, and a `WWW.Panndano.com` request must not slip through as a
      // second canonical origin).
      if (url.hostname === WWW_HOST) {
        url.protocol = "https:";
        url.port = "";
        url.hostname = APEX_HOST;
        // Path, query string and encoding are carried over verbatim by URL.
        return Response.redirect(url.toString(), 301);
      }
    } catch {
      // Ignore and serve assets as usual.
    }

    // Every other request — including the apex host — is passed through
    // completely untouched. No header, status, content-type, caching or
    // 404-handling changes: the assets binding applies the exact same
    // html_handling / not_found_handling rules as pure static serving did.
    return env.ASSETS.fetch(request);
  },
};
