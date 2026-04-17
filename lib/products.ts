export interface Product {
  id: number;
  slug: string;
  name: string;
  ref: string;
  price: number;
  description: string;
  shortDescription: string;
  category: string;
  image: string;
  bestseller?: boolean;
  new?: boolean;
  colors?: {
    name: string;
    hex: string;
  }[];
  specifications: {
    label: string;
    value: string;
  }[];
}

export const products: Product[] = [
  {
    id: 1,
    slug: 'lente-acuvue-oasys-6-unidades',
    name: 'Lente Acuvue Oasys',
    ref: 'ACU-OAS-001',
    price: 149.90,
    category: 'Lentes de Contato',
    shortDescription: 'Conforto imbatível e visão nítida com a tecnologia Hydraclear Plus.',
    description: 'As lentes de contato ACUVUE OASYS® com tecnologia HYDRACLEAR® PLUS são ideais para quem passa muito tempo em frente a telas ou em ambientes com ar-condicionado. Elas oferecem conforto excepcional durante todo o dia, ajudando a manter a estabilidade da lágrima.',
    image: 'https://picsum.photos/seed/product1/800/800',
    bestseller: true,
    colors: [
      { name: 'Incolor', hex: '#E2E8F0' },
      { name: 'Azul Sutil', hex: '#BFDBFE' }
    ],
    specifications: [
      { label: 'Marca', value: 'Acuvue' },
      { label: 'Material', value: 'Senofilcon A' },
      { label: 'Hidratação', value: '38%' },
      { label: 'Curva Base', value: '8.4mm / 8.8mm' },
      { label: 'Diâmetro', value: '14.0mm' },
    ]
  },
  {
    id: 2,
    slug: 'armacao-premium-titanium-black',
    name: 'Armação Premium Titanium',
    ref: 'OPT-TIT-002',
    price: 389.00,
    category: 'Armações',
    shortDescription: 'Leveza e durabilidade extrema em titânio de alta qualidade.',
    description: 'Nossa linha Premium Titanium oferece o equilíbrio perfeito entre sofisticação e resistência. Com design minimalista e acabamento impecável, esta armação é projetada para durar uma vida inteira com o máximo conforto.',
    image: 'https://picsum.photos/seed/product2/800/800',
    new: true,
    colors: [
      { name: 'Black Matte', hex: '#111827' },
      { name: 'Navy Blue', hex: '#1A3A5C' },
      { name: 'Titanium Grey', hex: '#4B5563' }
    ],
    specifications: [
      { label: 'Material', value: 'Titânio' },
      { label: 'Peso', value: '12g' },
      { label: 'Garantia', value: '2 anos' },
      { label: 'Estilo', value: 'Retangular' },
    ]
  },
  {
    id: 3,
    slug: 'kit-limpeza-premium-antiembacante',
    name: 'Kit Limpeza Premium',
    ref: 'ACC-CLN-003',
    price: 45.00,
    category: 'Acessórios',
    shortDescription: 'Mantenha suas lentes impecáveis e livres de embaçamento.',
    description: 'Este kit completo inclui solução de limpeza de alta performance com efeito antiembaçante e flanela de microfibra de alta densidade. Essencial para prolongar a vida útil das suas lentes e garantir visão clara em qualquer condição.',
    image: 'https://picsum.photos/seed/product3/800/800',
    specifications: [
      { label: 'Conteúdo', value: '60ml' },
      { label: 'Flanela', value: 'Microfibra HD' },
      { label: 'Efeito', value: 'Antiembaçante' },
    ]
  },
  {
    id: 4,
    slug: 'estojo-rigido-couro-artesanal',
    name: 'Estojo Rígido em Couro',
    ref: 'ACC-CAS-004',
    price: 89.90,
    category: 'Acessórios',
    shortDescription: 'Proteção clássica e sofisticada para seus óculos favoritos.',
    description: 'Feito à mão com couro sintético de alta qualidade e forro aveludado, este estojo rígido oferece proteção máxima contra riscos e impactos, mantendo a elegância característica da nossa linha de acessórios.',
    image: 'https://picsum.photos/seed/product4/800/800',
    bestseller: true,
    colors: [
      { name: 'Caramel', hex: '#C8A951' },
      { name: 'Dark Brown', hex: '#451A03' },
      { name: 'Black', hex: '#000000' }
    ],
    specifications: [
      { label: 'Material Externo', value: 'Couro Sintético' },
      { label: 'Forro', value: 'Veludo Soft' },
      { label: 'Fechamento', value: 'Magnético' },
    ]
  },
  {
    id: 5,
    slug: 'lente-biofinity-mensal-6-unidades',
    name: 'Lente Biofinity Mensal',
    ref: 'COO-BIO-005',
    price: 165.00,
    category: 'Lentes de Contato',
    shortDescription: 'Lentes de hidrogel de silicone com alta transmissibilidade de oxigênio.',
    description: 'As lentes Biofinity são fabricadas com a tecnologia Aquaform, que atrai e retém água dentro da lente, mantendo-a naturalmente úmida e confortável durante todo o período de uso mensal.',
    image: 'https://picsum.photos/seed/product5/800/800',
    specifications: [
      { label: 'Marca', value: 'CooperVision' },
      { label: 'Material', value: 'Comfilcon A' },
      { label: 'Hidratação', value: '48%' },
      { label: 'Uso', value: 'Mensal' },
    ]
  },
  {
    id: 6,
    slug: 'armacao-vintage-tortoise-shell',
    name: 'Armação Vintage Tortoise',
    ref: 'OPT-VIN-006',
    price: 245.00,
    category: 'Armações',
    shortDescription: 'Estilo clássico tartaruga que nunca sai de moda.',
    description: 'Com acetato de alta densidade e dobradiças reforçadas, esta armação une o visual retrô à durabilidade moderna. O padrão tartaruga é único em cada peça, garantindo exclusividade ao usuário.',
    image: 'https://picsum.photos/seed/product6/800/800',
    new: true,
    colors: [
      { name: 'Tortoise', hex: '#78350F' },
      { name: 'Amber', hex: '#B45309' }
    ],
    specifications: [
      { label: 'Material', value: 'Acetato' },
      { label: 'Cor', value: 'Tartaruga (Tortoise)' },
      { label: 'Encaixe', value: 'Global Fit' },
    ]
  },
  {
    id: 7,
    slug: 'solucao-multiuso-opti-free-300ml',
    name: 'Solução Opti-Free PureMoist',
    ref: 'SOL-OPT-007',
    price: 68.00,
    category: 'Lentes de Contato',
    shortDescription: 'Limpeza, desinfecção e hidratação por até 16 horas.',
    description: 'A solução multiuso Opti-Free PureMoist limpa, desinfeta, enxagua e conserva suas lentes de contato de hidrogel e hidrogel de silicone, proporcionando conforto duradouro da manhã até a noite.',
    image: 'https://picsum.photos/seed/product7/800/800',
    specifications: [
      { label: 'Volume', value: '300ml' },
      { label: 'Uso', value: 'Multiuso' },
      { label: 'Marca', value: 'Alcon' },
    ]
  },
  {
    id: 8,
    slug: 'armacao-esportiva-active-grip',
    name: 'Armação Active Grip',
    ref: 'OPT-ACT-008',
    price: 299.00,
    category: 'Armações',
    shortDescription: 'Performance e estabilidade para sua rotina de treinos.',
    description: 'Desenvolvida para atletas e entusiastas de atividades físicas, a linha Active Grip possui hastes emborrachadas que garantem estabilidade total mesmo com suor, além de material ultra resistente a quedas.',
    image: 'https://picsum.photos/seed/product8/800/800',
    bestseller: true,
    specifications: [
      { label: 'Material', value: 'TR90 Flex' },
      { label: 'Hastes', value: 'Emborrachadas' },
      { label: 'Peso', value: '18g' },
    ]
  }
];
