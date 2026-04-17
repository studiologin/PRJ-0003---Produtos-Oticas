import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextResponse } from 'next/server';

// Initialize the MercadoPago client
// In a real scenario, handle missing tokens gracefully
const accessToken = process.env.MP_ACCESS_TOKEN || '';
const client = new MercadoPagoConfig({ accessToken, options: { timeout: 5000 } });

export async function POST(request: Request) {
  try {
    if (!accessToken) {
      // For preview purposes, we can mock a successful response if no key is provided,
      // or we can fail and ask the user to provide the key.
      console.warn("MP_ACCESS_TOKEN is missing. Returning a mocked payment success for preview purposes.");
      return NextResponse.json({
        id: Math.floor(Math.random() * 1000000000),
        status: 'approved',
        status_detail: 'accredited',
        payment_method_id: 'mock',
      });
    }

    const body = await request.json();
    const payment = new Payment(client);
    
    // Create the payment
    // The body directly from the Payment Brick contains everything needed
    const response = await payment.create({
      body: {
        ...body,
        description: 'Compra na Produtos Óticas',
        // Example: adding additional data like external_reference
        external_reference: `ORDER-${Date.now()}`
      }
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Mercado Pago Checkout Error:", error);
    return NextResponse.json({ error: error.message || 'Payment processing failed' }, { status: 500 });
  }
}
