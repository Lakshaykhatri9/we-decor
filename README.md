# WE DECOR 4U

Next.js App Router storefront and service enquiry site for interior design, event decor and e-commerce.

## Run locally

Requirements: Node.js 20.9 or newer and a MongoDB deployment. Copy `.env.example` to `.env.local`, configure the values below, then run:

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`. Production commands are `npm run build` and `npm start`.

## Configuration needed before checkout or launch

- `MONGODB_URI` — product, booking, lead and order storage. Payment fulfilment uses MongoDB transactions, so use a replica set deployment such as MongoDB Atlas.
- `SITE_URL` — canonical public site URL, sitemap and product feed links.
- `TAX_RATES_JSON` — approved tax percentages by ISO country code. This app does not decide tax rates.
- `SHIPPING_RATES_JSON` — business-approved base and per-kilogram prices in minor currency units. Include a method for each checkout country. Optional `volumetricDivisor` enables dimensional-weight pricing.
- `FX_RATES_JSON` — manually maintained conversion rates from INR to each country’s configured currency. No live FX source is assumed.
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` — enable Razorpay checkout, backend signature and payment verification. Configure the Razorpay account to capture payments and point its `payment.captured` webhook at `/api/payments/webhook`.
- `BUSINESS_PHONE`, `BUSINESS_EMAIL`, `BUSINESS_ADDRESS`, `SUPPORT_HOURS` — contact details displayed on the contact page.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, `META_CAPI_API_VERSION` — optional tracking. Analytics is gated behind optional-cookie consent; Purchase is emitted only after backend verification. Keep the CAPI token server-side.
- `GOOGLE_SITE_VERIFICATION`, `META_SITE_VERIFICATION`, `PINTEREST_SITE_VERIFICATION` — optional domain verification values.
- Social URLs — `INSTAGRAM_URL`, `PINTEREST_URL`, `FACEBOOK_URL`.

JSON configuration examples in `.env.example` show the expected shape with zero values; replace them with verified business rates before enabling checkout. Do not use those example zero rates as production pricing.

## Products

There is no product data or admin interface in the supplied workspace. The shop reads only active MongoDB `Product` records and shows an empty catalog until real products are published. The schema supports base INR price in paise, stock, category, SKU, brand, tags, weight, dimensions, variants, a main image, gallery images and lifestyle images. Never add demo inventory or client-controlled prices.

## Implemented routes and services

- Pages: home, interior design, event decor, shop, product details, cart, checkout, thank-you, site survey, contact, B2B, and separate shipping, returns, terms, privacy, interior, event, B2B and warranty pages.
- APIs: product catalog/detail/search, bookings, contact and B2B leads, server-side checkout quote, Razorpay order creation/verification/webhook, confirmation-token-protected order receipt, country currency configuration, and dynamic product XML feed.
- Search waits 300 ms after typing and returns at most eight matching products.
- Prices and stock are re-read from MongoDB for every quote and payment order. Captured payment confirmation decrements stock transactionally; inventory conflicts are kept for manual fulfilment review.
- Product JSON-LD, metadata, sitemap and XML feed are generated from published products and `SITE_URL`.

## Testing and checks

```powershell
npm run lint
npm run type-check
npm test
npm run build
```

The repository starts without secrets so the public pages can be reviewed. Forms return a clear configuration/service error until MongoDB is connected. Checkout stays unavailable until a live product catalog, approved tax/shipping/FX rates and Razorpay credentials are configured.
