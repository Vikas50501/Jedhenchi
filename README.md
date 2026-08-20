# Jedhenchi — Shopify theme

Theme: `install-me-ambaz-v4-0-0` (Ambaz v4.0.0), connected to Shopify via the
GitHub integration.

## Branches

| Branch | Shopify theme | Purpose |
|---|---|---|
| `main` | **live** theme | only tested code lands here |
| `dev` | a separate **unpublished** theme | all changes go here first |

Never push straight to `main`. Push to `dev`, verify, then merge.

## Structured data

Product and collection structured data is emitted by three snippets. There is
exactly **one** `application/ld+json` block per page, built as a single
`@graph`.

| File | Role |
|---|---|
| `snippets/seo-structured-data.liquid` | main entry point — **all config lives at the top of this file** |
| `snippets/seo-offer.liquid` | one Offer per variant: price, availability, shipping, returns |
| `snippets/seo-gtin.liquid` | validates barcodes (length + GS1 check digit) before emitting a GTIN |

Wired in from:

- `sections/main-product.liquid` — `{% render 'seo-structured-data', product: product, collection: collection %}`
- `sections/main-collection-product-grid.liquid` — `{% render 'seo-structured-data', collection: collection %}`
- `sections/header.liquid` — the site-wide `Organization` node, referenced by `@id`

### Rules — do not break these

1. **One `Product` node per page.** If a review or SEO app is installed, turn
   OFF its structured-data / rich-snippet feature. Two `Product` nodes is worse
   than none.
2. **Never invent data.** No fake ratings, no placeholder GTINs, no arbitrary
   `priceValidUntil`. Missing data is omitted on purpose — an invalid GTIN makes
   Google reject the whole product.
3. **Do not add another `ld+json` block** to any product section.
   `sections/feature-product.liquid` had one; it was removed deliberately
   because that section can appear on non-product pages.

### Config

Edit only the CONFIG block at the top of `snippets/seo-structured-data.liquid`:

- `shipping_enabled` / `returns_enabled` — currently `false`. Turn on only with
  real policy values.
- `reviews_enabled` — `true`, but no review app is installed yet, so no
  `aggregateRating` is emitted. Install one and stars appear automatically.
- `price_mode` — `'money'`. Switch to `'divide'` only if the store formats money
  with a comma decimal separator.

## Validation

A validator lives outside this repo (`seo-kit/validator`). After any push that
reaches a theme:

```bash
node validate.js --preview <theme-id>   # unpublished theme
node validate.js                        # live
```

Expected: `clean 9 | warn 0 | FAIL 0`.

## Rollback

Shopify keeps every previously published theme in the theme library.
Online Store → Themes → pick the previous theme → Actions → Publish.

Keep the pre-change theme for at least 60 days.

## Note on the theme editor

The Shopify GitHub integration is two-way. Changes made in the theme
customiser are committed back to the connected branch — mostly
`config/settings_data.json` and `templates/*.json`. Pull before you push, or
you will hit conflicts.
