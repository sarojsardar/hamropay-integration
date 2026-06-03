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
      const { gateway_url, params } = await initiateCheckout({ amount: amountInPaisa, remarks, products, metadata });
      submitCheckoutForm(gateway_url, params);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Payment initiation failed');
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handlePay}
        disabled={loading}
        style={{
          width: '100%',
          padding: '0.875rem',
          background: loading ? '#f87171' : 'linear-gradient(135deg, #e53935, #b71c1c)',
          color: '#fff',
          border: 'none',
          borderRadius: '0.75rem',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'opacity 0.2s',
          opacity: loading ? 0.8 : 1,
        }}
      >
        {loading ? (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Redirecting to HamroPay...
          </>
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            Pay Rs. {(amountInPaisa / 100).toFixed(2)}
          </>
        )}
      </button>

      {error && (
        <div style={{
          marginTop: '0.875rem',
          padding: '0.75rem 1rem',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.625rem',
          color: '#dc2626',
          fontSize: '0.85rem',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'flex-start',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" style={{ marginTop: 1, flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
