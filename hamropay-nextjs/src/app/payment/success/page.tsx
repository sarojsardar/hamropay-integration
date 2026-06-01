// app/payment/success/page.tsx
import { redirect } from 'next/navigation';

async function getTransaction(merchantTxnId: string) {
  const res = await fetch(`${process.env.API_URL}/api/hamropay/transaction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ merchant_txn_id: merchantTxnId }),
    cache: 'no-store',
  });
  return res.json();
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ MerchantTxnId?: string }>;
}) {
  const { MerchantTxnId } = await searchParams;
  if (!MerchantTxnId) redirect('/');

  const txn = await getTransaction(MerchantTxnId);

  return (
    <div>
      <h1>Payment {txn.status === 'COMPLETED' ? 'Successful' : txn.status}</h1>
      <p>Transaction ID: {txn.merchantTransactionId}</p>
      <p>Amount: Rs. {txn.amount}</p>
      <p>{txn.message}</p>
    </div>
  );
}
