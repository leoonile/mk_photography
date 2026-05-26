# MK Photography — Vercel deployment

## What changed

### 1. Performance: images on the Vercel CDN + lazy loading
- All 45 base64-embedded images were extracted to `/images/` (9 unique files after deduplication). The HTML went from **62 MB → 51 KB**.
- Every `<img>` `src` now points at Vercel's built-in image optimization endpoint:

  ```
  /_vercel/image?url=%2Fimages%2Fimg-01.jpg&w=1920&q=75
  ```

  Vercel automatically serves AVIF/WebP based on the client's `Accept` header, resizes to the requested width, and caches at the edge. Format reference: `/_vercel/image?url=<URL-encoded-source>&w=<width>&q=<1-100>`.

- Allowed widths and formats are declared in `vercel.json` under `images`. `/images/*` also gets a 1-year immutable cache header for the originals.

- Every `<img>` got `loading="lazy"` and `decoding="async"`, **except** the header logo which is `loading="eager" fetchpriority="high"` so the LCP isn't penalized.

- The JS-rendered `<img>` tags (blog cards, portfolio masonry, hero gallery) also inherit `loading="lazy" decoding="async"` from the template strings, and the data they consume already contains CDN URLs.

### 2. UI: share container removed
- Deleted `<div class="share-container">…</div>` and all related CSS rules (`.share-container`, `.share-btn`, all `.share-btn:hover` variants, and the `@media(max-width:1024px)` override).
- Deleted the `shareOn()` JS handler.
- **No layout fix was needed** because `.share-container` used `position: fixed`, so it sat outside the document flow. The right-side WhatsApp float and action buttons are unaffected.

### 3. Contact form: Vercel Serverless Function
Vercel doesn't have Netlify-style "forms" handled at the edge with a built-in dashboard. The standard Vercel pattern is a Serverless Function:

- The form now uses `action="/api/contact" method="POST"`, with `name` attributes on every input.
- `api/contact.js` receives the POST, validates, runs a honeypot check, **logs the submission as structured JSON** (visible in your Vercel project → **Logs**), and forwards it via email through [Resend](https://resend.com).
- The frontend JS submits via `fetch()` and shows success/error states without leaving the page.

## Deploy steps

```bash
npm install
vercel deploy        # or push to a git repo connected to Vercel
```

### Environment variables (Vercel → Project → Settings → Environment Variables)
| Variable | Value |
|---|---|
| `RESEND_API_KEY` | API key from https://resend.com/api-keys |
| `CONTACT_TO` | Your destination email, e.g. `you@yourdomain.com` |
| `CONTACT_FROM` | Sender address on a Resend-verified domain, e.g. `noreply@yourdomain.com` |

### Where to see submissions
- **Vercel Dashboard → your project → Logs** → filter by `/api/contact`. Each submission appears as a JSON log line beginning `[contact] new submission`.
- **Your inbox** at whatever `CONTACT_TO` is set to.

## Alternatives to Resend
If you'd rather not run any function code at all, you can keep the same form HTML but change `action` to a third-party form endpoint:

- **Formspree**: `action="https://formspree.io/f/YOUR_FORM_ID"` (free tier: 50/mo, dashboard included)
- **Web3Forms**: `action="https://api.web3forms.com/submit"` + hidden `access_key` input (free, unlimited)
- **Formspark**: similar pattern

These give you a hosted dashboard and email forwarding without writing a function. The `api/contact.js` route remains the Vercel-native option and gives you the most control.

## Important: the extracted images are still huge originals
`img-01.jpg`, `img-02.jpg`, `img-04.jpg` are 6–8 MB. Vercel's optimizer will downscale them on first request and cache the result at the edge, so client downloads will be small — but your **transformation quota** on the Vercel free plan is 1,000 source images/month. For a portfolio site that's plenty. Just don't upload 8 MB JPEGs as the source of truth long-term; re-export from your photo tool at ~2400 px wide.
