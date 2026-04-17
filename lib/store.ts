import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Product } from './products';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  setDrawerOpen: (isOpen: boolean) => void;
  getTotalPrice: () => number;
  getDiscount: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.product.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            isDrawerOpen: true, // Auto open drawer
          });
        } else {
          set({ 
            items: [...currentItems, { product, quantity }],
            isDrawerOpen: true, // Auto open drawer
          });
        }
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      setDrawerOpen: (isOpen) => set({ isDrawerOpen: isOpen }),
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
      getDiscount: () => {
        const totalItems = get().getTotalItems();
        const subtotal = get().getTotalPrice();
        
        // B2B Bulk Discounts
        if (totalItems >= 50) return subtotal * 0.15; // 15% discount for 50+ items
        if (totalItems >= 20) return subtotal * 0.10; // 10% discount for 20+ items
        if (totalItems >= 10) return subtotal * 0.05; // 5% discount for 10+ items
        
        return 0;
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'carrinho-storage',
    }
  )
);

export interface CheckoutData {
  // Dados
  email: string;
  cpfCnpj: string;
  fullName: string;
  phone: string;
  
  // Entrega
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  shippingMethod: string;
  shippingCost: number;
}

export interface OrderConfirmationData {
  orderId: string;
  paymentMethod: string;
  total: number;
  status: string;
  pixQrCode?: string | null;
  pixCopyPaste?: string | null;
  ticketUrl?: string | null;
}

interface CheckoutStore {
  data: CheckoutData;
  orderConfirmation: OrderConfirmationData | null;
  updateData: (data: Partial<CheckoutData>) => void;
  clearCheckout: () => void;
  setOrderConfirmation: (data: OrderConfirmationData | null) => void;
}

const defaultCheckoutData: CheckoutData = {
  email: '',
  cpfCnpj: '',
  fullName: '',
  phone: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  shippingMethod: 'pac',
  shippingCost: 0,
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      data: defaultCheckoutData,
      orderConfirmation: null,
      updateData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
      clearCheckout: () => set({ data: defaultCheckoutData }),
      setOrderConfirmation: (data) => set({ orderConfirmation: data }),
    }),
    {
      name: 'checkout-storage',
    }
  )
);

interface FavoritesStore {
  items: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleFavorite: (product) => {
        const current = get().items;
        const exists = current.find(p => p.id === product.id);
        if (exists) {
          set({ items: current.filter(p => p.id !== product.id) });
        } else {
          set({ items: [...current, product] });
        }
      },
      isFavorite: (productId) => {
        return get().items.some(p => p.id === productId);
      }
    }),
    {
      name: 'favorites-storage'
    }
  )
);
