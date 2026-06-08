// lib/hamropay.ts

export async function initiateCheckout(payload: {
  amount: number;       // in paisa
  remarks?: string;
  products?: { name: string; imageUrl: string; description: string; price: number; quantity: number }[];
  metadata?: Record<string, string>;
}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/hamropay/initiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('Failed to initiate payment');
  return res.json() as Promise<{ gateway_url: string; params: Record<string, string> }>;
}

export function submitCheckoutForm(gatewayUrl: string, params: Record<string, string>) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = gatewayUrl;
  form.enctype = 'application/x-www-form-urlencoded';

  Object.entries(params).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}
