import { supabase } from './supabase';

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
  stock_quantity?: number;
  images?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

// Fallback Mock Data
export const mockProducts: Product[] = [
  {
    id: 1,
    slug: 'lente-acuvue-oasys-6-unidades',
    name: 'Lente Acuvue Oasys',
    ref: 'ACU-OAS-001',
    price: 149.90,
    category: 'Lentes de Contato',
    shortDescription: 'Conforto imbatível e visão nítida com a tecnologia Hydraclear Plus.',
    description: 'As lentes de contato ACUVUE OASYS® com tecnologia HYDRACLEAR® PLUS são ideais para quem passa muito tempo em frente a telas ou em ambientes com ar-condicionado.',
    image: 'https://picsum.photos/seed/product1/800/800',
    bestseller: true,
    colors: [
      { name: 'Incolor', hex: '#E2E8F0' },
      { name: 'Azul Sutil', hex: '#BFDBFE' }
    ],
    specifications: [
      { label: 'Marca', value: 'Acuvue' },
      { label: 'Material', value: 'Senofilcon A' }
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
    description: 'Nossa linha Premium Titanium oferece o equilíbrio perfeito entre sofisticação e resistência.',
    image: 'https://picsum.photos/seed/product2/800/800',
    new: true,
    colors: [
      { name: 'Black Matte', hex: '#111827' },
      { name: 'Navy Blue', hex: '#1A3A5C' }
    ],
    specifications: [
      { label: 'Material', value: 'Titânio' },
      { label: 'Peso', value: '12g' }
    ]
  }
];

// Helper to map DB product to Product interface
const mapProduct = (p: any): Product => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  ref: p.ref,
  price: Number(p.price),
  category: p.categories?.name || 'Geral',
  description: p.description,
  shortDescription: p.short_description,
  image: p.image,
  bestseller: p.bestseller,
  new: p.new,
  colors: p.colors,
  specifications: p.specifications,
  stock_quantity: p.stock_quantity,
  images: p.product_images 
    ? p.product_images.sort((a: any, b: any) => (b.is_cover ? 1 : 0) - (a.is_cover ? 1 : 0)).map((img: any) => img.url)
    : (p.image ? [p.image] : [])
});

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return mockProducts;

    return data.map(mapProduct);
  } catch (err) {
    console.error('Error fetching products:', err);
    return mockProducts;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name), product_images(url, is_cover)')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return mapProduct(data);
  } catch (err) {
    console.error('Error fetching product by slug:', err);
    return mockProducts.find(p => p.slug === slug) || null;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(name)')
      .eq('bestseller', true)
      .limit(8);

    if (error) throw error;
    if (!data) return [];

    return data.map(mapProduct);
  } catch (err) {
    console.error('Error fetching featured products:', err);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching categories:', err);
    return [];
  }
}

export async function getRelatedProducts(productId: number, categoryName: string): Promise<Product[]> {
  try {
    // 1. Tentar buscar relacionados manuais
    const { data: manualData, error: manualError } = await supabase
      .from('product_related')
      .select(`
        related:products!product_related_related_id_fkey(
          *,
          categories(name)
        )
      `)
      .eq('product_id', productId)
      .order('position', { ascending: true })
      .limit(4);

    let relateds: Product[] = [];
    if (manualData && !manualError) {
      relateds = manualData.map((item: any) => mapProduct(item.related));
    }

    // 2. Se tiver menos de 4, complementar com produtos da mesma categoria
    if (relateds.length < 4) {
      const remainingCount = 4 - relateds.length;
      const excludeIds = [productId, ...relateds.map(p => p.id)];
      
      const { data: categoryData, error: categoryError } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('is_active', true)
        .eq('categories.name', categoryName)
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .limit(remainingCount);

      if (categoryData && !categoryError) {
        const categoryRelateds = categoryData.map(mapProduct);
        relateds = [...relateds, ...categoryRelateds];
      }
    }

    return relateds;
  } catch (err) {
    console.error('Error fetching related products:', err);
    return [];
  }
}

// Global products fallback (for backward compatibility if needed, but async is better)
export const products = mockProducts;

