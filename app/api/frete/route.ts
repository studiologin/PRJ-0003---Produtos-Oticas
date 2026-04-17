import { NextResponse } from 'next/server';

const MELHOR_ENVIO_API = 'https://melhorenvio.com.br/api/v2/me/shipment/calculate';

// Default store ZIP code (from the design system/architecture if any, or a mockup one)
const FROM_CEP = '01310-930'; // Ex: AV PAULISTA, SP

export async function POST(request: Request) {
  try {
    const { to_cep, product } = await request.json();
    const MELHOR_ENVIO_TOKEN = process.env.MELHOR_ENVIO_TOKEN;

    if (!MELHOR_ENVIO_TOKEN) {
      console.warn('MELHOR_ENVIO_TOKEN no configurado en el servidor.');
      return NextResponse.json({ error: 'Token do Melhor Envio não configurado' }, { status: 500 });
    }

    if (!to_cep) {
      return NextResponse.json({ error: 'CEP de destino é obrigatório' }, { status: 400 });
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
          id: product.id.toString(),
          width: 15,
          height: 10,
          length: 20,
          weight: 0.5,
          insurance_value: product.price,
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
      console.error('Melhor Envio Error:', errorData);
      return NextResponse.json({ error: 'Erro ao calcular frete' }, { status: response.status });
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
