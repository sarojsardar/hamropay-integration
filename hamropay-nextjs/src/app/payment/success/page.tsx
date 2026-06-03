import { redirect } from 'next/navigation';
import Link from 'next/link';

async function getTransaction(merchantTxnId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/hamropay/transaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ merchant_txn_id: merchantTxnId }),
    cache: 'no-store',
  });
  const data = await res.json();
  console.log('[HamroPay success page] txn:', JSON.stringify(data));
  return data;
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ MerchantTxnId?: string }>;
}) {
  const { MerchantTxnId } = await searchParams;
  if (!MerchantTxnId) redirect('/');

  const txn = await getTransaction(MerchantTxnId);
  const isCompleted = txn.status === 'COMPLETED';
  const amount = txn.transactionAmount ?? txn.amount;
  const txnId  = txn.merchantTxnId ?? txn.merchantTransactionId ?? MerchantTxnId;

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
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
          background: isCompleted ? 'linear-gradient(135deg, #22c55e, #15803d)' : 'linear-gradient(135deg, #f59e0b, #d97706)',
          marginBottom: '1.25rem',
          boxShadow: isCompleted ? '0 8px 24px rgba(34,197,94,0.3)' : '0 8px 24px rgba(245,158,11,0.3)',
        }}>
          {isCompleted ? (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          )}
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e', marginBottom: '0.4rem' }}>
          {isCompleted ? 'Payment Successful!' : `Payment ${txn.status ?? 'Processed'}`}
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '2rem' }}>
          {isCompleted ? 'Your transaction has been completed.' : txn.message ?? 'Transaction status updated.'}
        </p>

        {/* Details Card */}
        <div style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '0.875rem',
          padding: '1.25rem',
          marginBottom: '1.75rem',
          textAlign: 'left',
        }}>
          {[
            { label: 'Transaction ID', value: txnId },
            { label: 'Amount',         value: amount != null ? `Rs. ${(Number(amount) / 100).toFixed(2)}` : '—' },
            { label: 'Status',         value: txn.status ?? '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.5rem 0',
              borderBottom: '1px dashed #e5e7eb',
            }}>
              <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>{label}</span>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a2e', wordBreak: 'break-all', maxWidth: '60%', textAlign: 'right' }}>{value}</span>
            </div>
          ))}
        </div>

        <Link href="/" style={{
          display: 'block',
          width: '100%',
          padding: '0.875rem',
          background: 'linear-gradient(135deg, #22c55e, #15803d)',
          color: '#fff',
          borderRadius: '0.75rem',
          fontSize: '1rem',
          fontWeight: 600,
          textAlign: 'center',
        }}>
          Back to Home
        </Link>
      </div>
    </main>
  );
}
