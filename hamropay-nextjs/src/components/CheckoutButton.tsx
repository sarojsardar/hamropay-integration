'use client';

import { useState } from 'react';
import { initiateCheckout, submitCheckoutForm } from '@/lib/hamropay';

export default function CheckoutButton({
  amountInPaisa,
  remarks,
  products,
  metadata,
}: {
  amountInPaisa: number;
  remarks?: string;
  products?: { name: string; imageUrl: string; description: string; price: number; quantity: number }[];
  metadata?: Record<string, string>;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    setLoading(true);
    setError(null);
    try {
      const { gateway_url, params } = await initiateCheckout({
        amount: amountInPaisa,
        remarks,
        products,
        metadata,
      });
      submitCheckoutForm(gateway_url, params);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Payment initiation failed');
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={handlePay} disabled={loading}>
        {loading ? 'Redirecting...' : 'Pay with Hamro Pay'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
