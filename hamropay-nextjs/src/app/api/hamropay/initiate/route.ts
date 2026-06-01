import { createHmac } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

function sign(message: string): string {
  return Buffer.from(
    createHmac('sha512', process.env.HAMROPAY_CLIENT_SECRET!).update(message).digest()
  ).toString('base64');
}

export async function POST(req: NextRequest) {
  try {
    const { amount, remarks, products, metadata } = await req.json();

    const merchantId    = process.env.HAMROPAY_MERCHANT_ID!;
    const clientId      = process.env.HAMROPAY_CLIENT_ID!;
    const clientApiKey  = process.env.HAMROPAY_CLIENT_API_KEY!;
    const merchantTxnId = `TXN-${Date.now()}`;

    const signature = sign([merchantTxnId, amount, merchantId, clientId, clientApiKey].join(','));

    const payload = {
      merchantId,
      merchantTxnId,
      transactionAmount: amount,
      failedRedirectionUrl:  process.env.HAMROPAY_FAILURE_URL,
      successRedirectionUrl: process.env.HAMROPAY_SUCCESS_URL,
      productList: products ?? [],
      metadata:    metadata ?? {},
    };

    const res = await fetch(`${process.env.HAMROPAY_BASE_URL}/v1/checkout/sessionId`, {
      method: 'POST',
      headers: {
        'Content-Type':   'application/json',
        'Client-Id':      clientId,
        'Client-API-Key': clientApiKey,
        'Signature':      signature,
      },
      body: JSON.stringify(payload),
    });

    const raw = await res.text();
    console.log('[HamroPay] status:', res.status, 'body:', raw);

    if (!res.ok) {
      return NextResponse.json({ error: raw }, { status: res.status });
    }

    const data = JSON.parse(raw);
    const sessionId = data.sessionId ?? data.session_id;

    if (!sessionId) {
      return NextResponse.json({ error: data.message ?? 'Session creation failed' }, { status: 422 });
    }

    const token = sign([merchantId, merchantTxnId, sessionId, amount, clientId, clientApiKey].join(','));

    return NextResponse.json({
      gateway_url: `${process.env.HAMROPAY_GATEWAY_URL}/api/checkout`,
      params: {
        merchant_id:              merchantId,
        session_id:               sessionId,
        token,
        merchant_transaction_id:  merchantTxnId,
        remarks:                  remarks ?? '',
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to initiate payment';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
