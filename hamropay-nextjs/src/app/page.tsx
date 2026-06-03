import CheckoutButton from '@/components/CheckoutButton';

const product = {
  name: 'Premium Plan',
  description: 'Access all features for 1 month',
  imageUrl: 'https://via.placeholder.com/100',
  price: 10000,
  quantity: 1,
};

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #f5f6fa 0%, #e8eaf6 100%)',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '1.25rem',
        boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
      }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e53935, #b71c1c)',
            marginBottom: '1rem',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a2e' }}>HamroPay Checkout</h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>Secure payment powered by HamroPay</p>
        </div>

        {/* Product Card */}
        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: '0.875rem',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          background: '#fafafa',
        }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '0.625rem',
            background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 600, fontSize: '0.95rem', color: '#1a1a2e' }}>{product.name}</p>
            <p style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: '0.15rem' }}>{product.description}</p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontWeight: 700, fontSize: '1rem', color: '#e53935' }}>
              Rs. {(product.price / 100).toFixed(2)}
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>qty: {product.quantity}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{
          borderTop: '1px dashed #e5e7eb',
          borderBottom: '1px dashed #e5e7eb',
          padding: '1rem 0',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Subtotal</span>
            <span style={{ fontSize: '0.875rem' }}>Rs. {(product.price / 100).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Tax</span>
            <span style={{ fontSize: '0.875rem' }}>Rs. 0.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total</span>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#e53935' }}>
              Rs. {(product.price / 100).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Pay Button */}
        <CheckoutButton
          amountInPaisa={product.price}
          remarks="Premium Plan - 1 month"
          products={[product]}
        />

        {/* Trust Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          marginTop: '1.25rem',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>256-bit SSL encrypted · Secured by HamroPay</span>
        </div>
      </div>
    </main>
  );
}
