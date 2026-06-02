import { createHmac } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

function sign(message: string): string {
  return Buffer.from(
    createHmac('sha512', process.env.HAMROPAY_CLIENT_SECRET!).update(message).digest()
  ).toString('base64');
}

export async function POST(req: NextRequest) {
  try {
    const { merchant_txn_id } = await req.json();

    const merchantId   = process.env.HAMROPAY_MERCHANT_ID!;
    const clientId     = process.env.HAMROPAY_CLIENT_ID!;
    const clientApiKey = process.env.HAMROPAY_CLIENT_API_KEY!;

    const signature = sign([merchant_txn_id, merchantId, clientId, clientApiKey].join(','));

    const res = await fetch(`${process.env.HAMROPAY_BASE_URL}/v1/checkout/transaction`, {
      method: 'POST',
      headers: {
        'Content-Type':   'application/json',
        'Client-Id':      clientId,
        'Client-API-Key': clientApiKey,
        'Signature':      signature,
      },
      body: JSON.stringify({ merchantId, merchantTxnId: merchant_txn_id }),
      cache: 'no-store',
    });

    const raw = await res.text();
    console.log('[HamroPay transaction] status:', res.status, 'body:', raw);

    if (!res.ok) return NextResponse.json({ error: raw }, { status: res.status });

    return NextResponse.json(JSON.parse(raw));
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to fetch transaction';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
