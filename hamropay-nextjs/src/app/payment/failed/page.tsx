// app/payment/failed/page.tsx
import { redirect } from 'next/navigation';

export default async function FailedPage({
  searchParams,
}: {
  searchParams: Promise<{ MerchantTxnId?: string }>;
}) {
  const { MerchantTxnId } = await searchParams;
  if (!MerchantTxnId) redirect('/');

  return (
    <div>
      <h1>Payment Failed</h1>
      <p>Transaction ID: {MerchantTxnId}</p>
      <p>Your payment could not be processed. Please try again.</p>
    </div>
  );
}
