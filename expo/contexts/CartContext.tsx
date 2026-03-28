import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { CartItem, Order } from '@/types/product';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  orders: Order[];
  isLoading: boolean;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productId: string, size: string, color: string) => Promise<void>;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const [CartProvider, useCart] = createContextHook((): CartContextType => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadCart = async () => {
    try {
      const cartData = await AsyncStorage.getItem('cart');
      if (cartData) {
        setItems(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const ordersData = await AsyncStorage.getItem('orders');
      if (ordersData) {
        setOrders(JSON.parse(ordersData));
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const saveCart = async (newItems: CartItem[]) => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.error('Failed to save cart:', error);
    }
  };

  const addToCart = async (item: CartItem) => {
    const existingIndex = items.findIndex(
      i => i.product.id === item.product.id && i.size === item.size && i.color === item.color
    );

    if (existingIndex !== -1) {
      const newItems = [...items];
      newItems[existingIndex].quantity += item.quantity;
      await saveCart(newItems);
    } else {
      await saveCart([...items, item]);
    }
  };

  const removeFromCart = async (productId: string, size: string, color: string) => {
    const newItems = items.filter(
      item => !(item.product.id === productId && item.size === size && item.color === color)
    );
    await saveCart(newItems);
  };

  const updateQuantity = async (productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId, size, color);
      return;
    }

    const newItems = items.map(item =>
      item.product.id === productId && item.size === size && item.color === color
        ? { ...item, quantity }
        : item
    );
    await saveCart(newItems);
  };

  const clearCart = async () => {
    await saveCart([]);
  };

  const checkout = async () => {
    if (items.length === 0 || !user) return;

    const newOrder: Order = {
      id: Date.now().toString(),
      userId: user.id,
      items: [...items],
      total: getCartTotal(),
      date: new Date().toISOString(),
      status: 'pending',
    };

    const newOrders = [newOrder, ...orders];
    setOrders(newOrders);
    await AsyncStorage.setItem('orders', JSON.stringify(newOrders));
    await clearCart();
  };

  const getCartTotal = (): number => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const getCartCount = (): number => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!user || user.role !== 'admin') {
      console.error('Only admins can update order status');
      return;
    }

    try {
      const ordersData = await AsyncStorage.getItem('orders');
      const allOrders: Order[] = ordersData ? JSON.parse(ordersData) : [];
      
      const newOrders = allOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      );
      
      setOrders(newOrders);
      await AsyncStorage.setItem('orders', JSON.stringify(newOrders));
      console.log('Order status updated:', orderId, status);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return {
    items,
    orders,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    checkout,
    updateOrderStatus,
    getCartTotal,
    getCartCount,
  };
});
