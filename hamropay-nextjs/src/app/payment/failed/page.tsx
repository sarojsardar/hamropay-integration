import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function FailedPage({
  searchParams,
}: {
  searchParams: Promise<{ MerchantTxnId?: string }>;
}) {
  const { MerchantTxnId } = await searchParams;
  if (!MerchantTxnId) redirect('/');

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '1.25rem',
        boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center',
      }}>
        {/* Icon */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e53935, #b71c1c)',
          marginBottom: '1.25rem',
          boxShadow: '0 8px 24px rgba(229,57,53,0.3)',
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.4rem' }}>
          Payment Failed
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Your payment could not be processed. Please try again.
        </p>

        {/* Details Card */}
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.875rem',
          padding: '1.25rem',
          marginBottom: '1.75rem',
          textAlign: 'left',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Transaction ID</span>
            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a1a2e', wordBreak: 'break-all', maxWidth: '65%', textAlign: 'right' }}>
              {MerchantTxnId}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link href="/" style={{
            display: 'block',
            padding: '0.875rem',
            background: 'linear-gradient(135deg, #e53935, #b71c1c)',
            color: '#fff',
            borderRadius: '0.75rem',
            fontSize: '1rem',
            fontWeight: 600,
            textAlign: 'center',
          }}>
            Try Again
          </Link>
          <Link href="/" style={{
            display: 'block',
            padding: '0.875rem',
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            color: '#6b7280',
            borderRadius: '0.75rem',
            fontSize: '0.95rem',
            fontWeight: 500,
            textAlign: 'center',
          }}>
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
