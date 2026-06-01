import { NextRequest, NextResponse } from 'next/server';

async function getAccessToken(): Promise<string> {
  const res = await fetch(`${process.env.HAMROPAY_BASE_URL}/api/v1/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: process.env.HAMROPAY_CLIENT_ID,
      clientApiKey: process.env.HAMROPAY_CLIENT_API_KEY,
      clientSecret: process.env.HAMROPAY_CLIENT_SECRET,
    }),
  });

  if (!res.ok) throw new Error(`Auth failed: ${res.status}`);
  const data = await res.json();
  return data.accessToken ?? data.access_token ?? data.token;
}

export async function POST(req: NextRequest) {
  try {
    const { merchant_txn_id } = await req.json();

    const token = await getAccessToken();

    const res = await fetch(`${process.env.HAMROPAY_BASE_URL}/api/v1/payment/transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        merchantId: process.env.HAMROPAY_MERCHANT_ID,
        merchantTxnId: merchant_txn_id,
      }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to fetch transaction';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
