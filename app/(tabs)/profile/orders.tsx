import { Package, Clock, Truck, CheckCircle } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types/product';

function StatusBadge({ status }: { status: Order['status'] }) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return { icon: <Clock color="#ff9500" size={16} />, label: 'Pending', color: '#ff9500' };
      case 'processing':
        return { icon: <Package color="#007aff" size={16} />, label: 'Processing', color: '#007aff' };
      case 'shipped':
        return { icon: <Truck color="#5856d6" size={16} />, label: 'Shipped', color: '#5856d6' };
      case 'delivered':
        return { icon: <CheckCircle color="#34c759" size={16} />, label: 'Delivered', color: '#34c759' };
      default:
        return { icon: <Clock color="#999" size={16} />, label: 'Unknown', color: '#999' };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.statusBadge, { backgroundColor: `${config.color}15` }]}>
      {config.icon}
      <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

function OrderCard({ order, onUpdateStatus, isAdmin }: { order: Order; onUpdateStatus: (orderId: string, status: Order['status']) => void; isAdmin: boolean }) {
  const date = new Date(order.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const getNextStatus = (): Order['status'] | null => {
    switch (order.status) {
      case 'pending':
        return 'processing';
      case 'processing':
        return 'shipped';
      case 'shipped':
        return 'delivered';
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus();

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return 'Process Order';
      case 'shipped':
        return 'Ship Order';
      case 'delivered':
        return 'Mark as Delivered';
      default:
        return 'Update Status';
    }
  };

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>Order #{order.id}</Text>
          <Text style={styles.orderDate}>{formattedDate}</Text>
        </View>
        <StatusBadge status={order.status} />
      </View>

      <View style={styles.orderItems}>
        {order.items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.product.name}
            </Text>
            <Text style={styles.itemDetails}>
              {item.size} · {item.color} · Qty: {item.quantity}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.footerLeft}>
          <Text style={styles.itemCount}>{order.items.length} item(s)</Text>
          <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
        </View>
        {nextStatus && isAdmin && (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => onUpdateStatus(order.id, nextStatus)}
          >
            <Text style={styles.updateButtonText}>{getStatusLabel(nextStatus)}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function OrdersScreen() {
  const { user } = useAuth();
  const { orders, updateOrderStatus } = useCart();
  
  const isAdmin = user?.role === 'admin';
  const displayOrders = isAdmin ? orders : orders.filter(order => order.userId === user?.id);

  const handleUpdateStatus = (orderId: string, status: Order['status']) => {
    if (!isAdmin) {
      Alert.alert('Access Denied', 'Only admins can update order status.');
      return;
    }
    updateOrderStatus(orderId, status);
  };

  if (displayOrders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Package color="#ddd" size={80} />
        <Text style={styles.emptyTitle}>No orders yet</Text>
        <Text style={styles.emptySubtitle}>Start shopping to place your first order</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>{isAdmin ? 'All Orders' : 'Your Orders'}</Text>
          {isAdmin && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>Admin</Text>
            </View>
          )}
        </View>
        <View style={styles.ordersList}>
          {displayOrders.map(order => (
            <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} isAdmin={isAdmin} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#000',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center' as const,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#000',
  },
  adminBadge: {
    backgroundColor: '#007aff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  adminBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600' as const,
  },
  ordersList: {
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    gap: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#000',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  orderItems: {
    gap: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  orderItem: {
    gap: 4,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#000',
  },
  itemDetails: {
    fontSize: 13,
    color: '#666',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  footerLeft: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  itemCount: {
    fontSize: 14,
    color: '#666',
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#000',
  },
  updateButton: {
    backgroundColor: '#007aff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600' as const,
  },
});
