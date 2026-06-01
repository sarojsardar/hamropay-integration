# HamroPay Integration Documentation

## Overview

This project integrates HamroPay as a payment gateway. Two implementations are provided:

| Stack | Location | Port |
|---|---|---|
| Next.js (App Router) | `hamropay-nextjs/` | 3000 |
| Laravel | `hamropay-laravel/` | 8001 |

Both implementations follow the same flow: create a session → build a signed checkout form → redirect the user to the HamroPay gateway → handle success/failure callbacks.

---

## Environments

| Environment | API Base URL | Gateway URL |
|---|---|---|
| UAT | `https://uat-payclient.hamropatro.com` | `https://uat-checkout-pay.hamropatro.com` |
| Production | `https://payclient.hamropatro.com` | `https://checkout-pay.hamropatro.com` |

---

## Payment Flow

```
User clicks Pay
      │
      ▼
POST /api/hamropay/initiate
      │  (amount, remarks, products, metadata)
      │
      ▼
POST {API_BASE_URL}/v1/checkout/sessionId   ← HamroPay API
      │  Headers: Client-Id, Client-API-Key, Signature
      │  Returns: sessionId
      │
      ▼
Build checkout token (HMAC-SHA512)
      │
      ▼
Return { gateway_url, params } to browser
      │
      ▼
Browser submits hidden HTML form → HamroPay Gateway
      │
      ├── Success → GET /payment/success?MerchantTxnId=...
      └── Failure → GET /payment/failed?MerchantTxnId=...
```

---

## HMAC Signature

All requests to HamroPay are signed using **HMAC-SHA512**, base64-encoded.

### Session Signature (initiate)

Fields joined by comma in this exact order:

```
merchantTxnId,transactionAmount,merchantId,clientId,clientApiKey
```

### Checkout Token (form submission)

Fields joined by comma in this exact order:

```
merchantId,merchantTxnId,sessionId,transactionAmount,clientId,clientApiKey
```

### Webhook Signature (verification)

Fields joined by comma in this exact order:

```
merchantTxnId,merchantId,status,amount
```

> The webhook uses a separate `HAMROPAY_WEBHOOK_SECRET`, not the client secret.

---

## Next.js Integration

### Environment Variables

File: `hamropay-nextjs/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000

HAMROPAY_MERCHANT_ID=<your_merchant_id>
HAMROPAY_CLIENT_ID=<your_client_id>
HAMROPAY_CLIENT_API_KEY=<your_client_api_key>
HAMROPAY_CLIENT_SECRET=<your_client_secret>
HAMROPAY_BASE_URL=https://uat-payclient.hamropatro.com
HAMROPAY_GATEWAY_URL=https://uat-checkout-pay.hamropatro.com
HAMROPAY_SUCCESS_URL=http://localhost:3000/payment/success
HAMROPAY_FAILURE_URL=http://localhost:3000/payment/failed
```

> Only `NEXT_PUBLIC_*` variables are exposed to the browser. All credentials stay server-side.

### File Structure

```
src/
├── app/
│   ├── api/
│   │   └── hamropay/
│   │       ├── initiate/route.ts       ← creates session, returns gateway params
│   │       └── transaction/route.ts    ← fetches transaction status
│   ├── payment/
│   │   ├── success/page.tsx            ← success callback page
│   │   └── failed/page.tsx             ← failure callback page
│   └── page.tsx                        ← example usage
├── components/
│   └── CheckoutButton.tsx              ← reusable pay button
└── lib/
    └── hamropay.ts                     ← client-side helpers
```

### API Routes

#### `POST /api/hamropay/initiate`

Initiates a payment session with HamroPay and returns the gateway URL and signed form params.

**Request body:**

```json
{
  "amount": 10000,
  "remarks": "Order #123",
  "products": [
    {
      "name": "Product Name",
      "imageUrl": "https://example.com/image.jpg",
      "description": "Product description",
      "price": 10000,
      "quantity": 1
    }
  ],
  "metadata": {
    "orderId": "123"
  }
}
```

> `amount` is in **paisa** (Rs. 100 = 10000 paisa). Min: 1000, Max: 5000000.

**Response:**

```json
{
  "gateway_url": "https://uat-checkout-pay.hamropatro.com/api/checkout",
  "params": {
    "merchant_id": "...",
    "session_id": "...",
    "token": "...",
    "merchant_transaction_id": "TXN-1234567890",
    "remarks": "Order #123"
  }
}
```

#### `POST /api/hamropay/transaction`

Fetches the status of a transaction by merchant transaction ID.

**Request body:**

```json
{
  "merchant_txn_id": "TXN-1234567890"
}
```

**Response:** Raw transaction object from HamroPay including `status`, `amount`, `merchantTransactionId`, `message`.

### Client Helpers (`src/lib/hamropay.ts`)

```ts
// Calls /api/hamropay/initiate
initiateCheckout({ amount, remarks?, products?, metadata? })

// Builds and submits a hidden POST form to the gateway
submitCheckoutForm(gatewayUrl, params)
```

### CheckoutButton Component

```tsx
import CheckoutButton from '@/components/CheckoutButton';

<CheckoutButton
  amountInPaisa={10000}
  remarks="Order #123"
  products={[
    {
      name: 'Product Name',
      imageUrl: 'https://example.com/image.jpg',
      description: 'A product',
      price: 10000,
      quantity: 1,
    },
  ]}
  metadata={{ orderId: '123' }}
/>
```

Props:

| Prop | Type | Required | Description |
|---|---|---|---|
| `amountInPaisa` | `number` | Yes | Amount in paisa |
| `remarks` | `string` | No | Payment note |
| `products` | `array` | No | Product list |
| `metadata` | `object` | No | Custom key-value pairs |

### Success & Failure Pages

HamroPay redirects back with `?MerchantTxnId=` in the query string.

- `GET /payment/success?MerchantTxnId=TXN-...` — fetches transaction status and displays result
- `GET /payment/failed?MerchantTxnId=TXN-...` — displays failure message

---

## Laravel Integration

### Environment Variables

File: `hamropay-laravel/.env`

```env
HAMROPAY_API_BASE_URL=https://uat-payclient.hamropatro.com
HAMROPAY_GATEWAY_URL=https://uat-checkout-pay.hamropatro.com
HAMROPAY_CLIENT_ID=<your_client_id>
HAMROPAY_CLIENT_API_KEY=<your_client_api_key>
HAMROPAY_SECRET=<your_client_secret>
HAMROPAY_MERCHANT_ID=<your_merchant_id>
HAMROPAY_WEBHOOK_SECRET=<your_webhook_secret>
HAMROPAY_SUCCESS_URL=http://localhost:3000/payment/success
HAMROPAY_FAILURE_URL=http://localhost:3000/payment/failed
```

### File Structure

```
app/
├── Http/Controllers/
│   └── HamroPayController.php   ← initiate, transaction, webhook
├── Services/
│   └── HamroPayService.php      ← API calls, signing, token building
config/
└── hamropay.php                 ← config values from .env
routes/
└── api.php                      ← route definitions
```

### API Routes

All routes are prefixed with `/api/hamropay`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/hamropay/initiate` | Create session and return checkout params |
| POST | `/api/hamropay/transaction` | Fetch transaction status |
| POST | `/api/hamropay/webhook` | Receive and verify HamroPay webhook |

#### `POST /api/hamropay/initiate`

**Request:**

```json
{
  "amount": 10000,
  "remarks": "Order #123",
  "products": [...],
  "metadata": {}
}
```

**Validation rules:**

| Field | Rule |
|---|---|
| `amount` | required, integer, min:1000, max:5000000 |
| `remarks` | nullable, string, max:250 |
| `products` | nullable, array |
| `metadata` | nullable, array |

**Response:**

```json
{
  "gateway_url": "https://uat-checkout-pay.hamropatro.com/api/checkout",
  "params": {
    "merchant_id": "...",
    "session_id": "...",
    "token": "...",
    "merchant_transaction_id": "...",
    "remarks": "..."
  }
}
```

#### `POST /api/hamropay/transaction`

**Request:**

```json
{
  "merchant_txn_id": "abc123"
}
```

#### `POST /api/hamropay/webhook`

HamroPay sends a POST with a `Signature` header. The controller verifies the signature before processing.

**Expected body:**

```json
{
  "merchantTxnId": "...",
  "status": "COMPLETED",
  "amount": 10000
}
```

Signature is verified as:

```
HMAC-SHA512(merchantTxnId,merchantId,status,amount, webhookSecret)
```

Returns `401` if signature is invalid.

### HamroPayService Methods

| Method | Description |
|---|---|
| `sign(string $message)` | Returns base64 HMAC-SHA512 signature |
| `createSession(array $data)` | Calls `/v1/checkout/sessionId`, returns session data |
| `buildCheckoutParams(...)` | Builds signed params array for the checkout form |
| `getTransaction(string $merchantTxnId)` | Calls `/v1/checkout/transaction` |
| `verifyWebhookSignature(...)` | Validates incoming webhook signature |
| `getGatewayUrl()` | Returns configured gateway base URL |

---

## Running Locally

### Next.js

```bash
cd hamropay-nextjs
npm install
npm run dev        # http://localhost:3000
```

### Laravel

```bash
cd hamropay-laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan serve --port=8001   # http://localhost:8001
```

---

## Error Reference

| HTTP Status | Meaning |
|---|---|
| 422 | Session creation failed — check credentials or amount range |
| 401 | Webhook signature mismatch |
| 501 | Wrong endpoint or missing/incorrect Signature header |
| 500 | Unexpected server error — check logs |

---

## Security Notes

- Never expose `HAMROPAY_CLIENT_SECRET` / `HAMROPAY_SECRET` to the browser. All signing happens server-side.
- Always verify the `Signature` header on incoming webhooks before updating order status.
- Use HTTPS in production for all redirect URLs.
- Rotate `HAMROPAY_WEBHOOK_SECRET` independently from the client secret.
