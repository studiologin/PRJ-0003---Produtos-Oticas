import { NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/products';

const MELHOR_ENVIO_API = 'https://melhorenvio.com.br/api/v2/me/shipment/calculate';

// Default store ZIP code (from the design system/architecture if any, or a mockup one)
const FROM_CEP = '01310-930'; // Ex: AV PAULISTA, SP

export async function POST(request: Request) {
  try {
    const { to_cep, product } = await request.json();
    const MELHOR_ENVIO_TOKEN = process.env.MELHOR_ENVIO_TOKEN;

    if (!MELHOR_ENVIO_TOKEN) {
      console.warn('MELHOR_ENVIO_TOKEN no configurado en el servidor.');
      return NextResponse.json({ error: 'Serviço de frete indisponível no momento' }, { status: 500 });
    }

    if (!to_cep) {
      return NextResponse.json({ error: 'CEP de destino é obrigatório' }, { status: 400 });
    }

    // Security (OWASP A06): Buscar preço real do banco para seguro, não confiar no cliente
    let safeInsuranceValue = 0;
    if (product && product.slug) {
      const dbProduct = await getProductBySlug(product.slug);
      safeInsuranceValue = dbProduct ? dbProduct.price : 0;
    }

    const payload = {
      from: {
        postal_code: FROM_CEP.replace(/\D/g, ''),
      },
      to: {
        postal_code: to_cep.replace(/\D/g, ''),
      },
      products: [
        {
          id: product.id?.toString() || '0',
          width: 15,
          height: 10,
          length: 20,
          weight: 0.5,
          insurance_value: safeInsuranceValue > 0 ? safeInsuranceValue : (product.price || 0), // Fallback se não encontrar
          quantity: 1,
        },
      ],
    };

    const response = await fetch(MELHOR_ENVIO_API, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${MELHOR_ENVIO_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Produtos Oticas App (studiologin.br@gmail.com)',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('------- DEBUG MELHOR ENVIO -------');
      console.error('Status:', response.status);
      console.error('Error Details:', JSON.stringify(errorData, null, 2));
      console.error('----------------------------------');
      
      // Security (OWASP A09): Não vazar detalhes internos do provedor para o cliente
      return NextResponse.json({ 
        error: 'Não foi possível calcular o frete para este CEP no momento.' 
      }, { status: 400 });
    }

    const data = await response.json();
    
    // Filter out services with errors and return a clean list
    const shippingOptions = data
      .filter((service: any) => !service.error)
      .map((service: any) => ({
        id: service.id,
        name: service.name,
        price: parseFloat(service.price),
        delivery_time: service.delivery_time,
        company: service.company.name,
        company_logo: service.company.picture,
      }));

    return NextResponse.json(shippingOptions);
  } catch (error) {
    console.error('Calculate Freight Error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
