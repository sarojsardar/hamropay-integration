# HamroPay Integration

A complete HamroPay payment gateway integration with two implementations:

- **Next.js** (App Router) — `hamropay-nextjs/`
- **Laravel** — `hamropay-laravel/`

---

## Quick Start

### Next.js

```bash
cd hamropay-nextjs
npm install
cp .env.local.example .env.local   # fill in your credentials
npm run dev
```

Runs at `http://localhost:3000`

### Laravel

```bash
cd hamropay-laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan serve --port=8001
```

Runs at `http://localhost:8001`

---

## Environment Variables

### Next.js (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
HAMROPAY_MERCHANT_ID=
HAMROPAY_CLIENT_ID=
HAMROPAY_CLIENT_API_KEY=
HAMROPAY_CLIENT_SECRET=
HAMROPAY_BASE_URL=https://uat-payclient.hamropatro.com
HAMROPAY_GATEWAY_URL=https://uat-checkout-pay.hamropatro.com
HAMROPAY_SUCCESS_URL=http://localhost:3000/payment/success
HAMROPAY_FAILURE_URL=http://localhost:3000/payment/failed
```

### Laravel (`.env`)

```env
HAMROPAY_API_BASE_URL=https://uat-payclient.hamropatro.com
HAMROPAY_GATEWAY_URL=https://uat-checkout-pay.hamropatro.com
HAMROPAY_CLIENT_ID=
HAMROPAY_CLIENT_API_KEY=
HAMROPAY_SECRET=
HAMROPAY_MERCHANT_ID=
HAMROPAY_WEBHOOK_SECRET=
HAMROPAY_SUCCESS_URL=http://localhost:3000/payment/success
HAMROPAY_FAILURE_URL=http://localhost:3000/payment/failed
```

---

## Payment Flow

```
User clicks Pay
      │
      ▼
POST /api/hamropay/initiate
      │
      ▼
HamroPay API → create session (HMAC signed)
      │
      ▼
Browser submits form → HamroPay Gateway
      │
      ├── /payment/success?MerchantTxnId=...
      └── /payment/failed?MerchantTxnId=...
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/hamropay/initiate` | Create session, return gateway params |
| POST | `/api/hamropay/transaction` | Fetch transaction status |
| POST | `/api/hamropay/webhook` | Receive webhook (Laravel only) |

---

## Documentation

See [DOCUMENTATION.md](./DOCUMENTATION.md) for full details including signature algorithms, request/response shapes, and security notes.

---

## UAT Credentials

Get UAT credentials from the [HamroPay merchant portal](https://hamropatro.com).
