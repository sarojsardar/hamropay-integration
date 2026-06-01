import CheckoutButton from '@/components/CheckoutButton';

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>HamroPay Test</h1>
      <p>Amount: Rs. 100</p>
      <CheckoutButton
        amountInPaisa={10000}
        remarks="Test payment"
        products={[
          {
            name: 'Test Product',
            imageUrl: 'https://via.placeholder.com/100',
            description: 'A test product',
            price: 10000,
            quantity: 1,
          },
        ]}
      />
    </main>
  );
}
