import { router } from 'expo-router';
import { User, Package, LogOut, ChevronRight } from 'lucide-react-native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

function ProfileOption({ 
  icon, 
  label, 
  value, 
  onPress 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.optionButton} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.optionLeft}>
        {icon}
        <Text style={styles.optionLabel}>{label}</Text>
      </View>
      <View style={styles.optionRight}>
        {value && <Text style={styles.optionValue}>{value}</Text>}
        <ChevronRight color="#999" size={20} />
      </View>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { orders } = useCart();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login' as any);
          },
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.notLoggedIn}>
          <User color="#ddd" size={80} />
          <Text style={styles.notLoggedInTitle}>Not logged in</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth/login' as any)}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User color="#fff" size={40} />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          {user.role === 'admin' && (
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>Administrator</Text>
            </View>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {orders.filter(o => o.status === 'pending').length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {orders.filter(o => o.status === 'delivered').length}
            </Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.optionsContainer}>
            <ProfileOption
              icon={<Package color="#000" size={24} />}
              label="My Orders"
              value={`${orders.length}`}
              onPress={() => router.push('/(tabs)/profile/orders' as any)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut color="#ff3b30" size={24} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
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
    paddingBottom: 32,
  },
  notLoggedIn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  notLoggedInTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#000',
    marginTop: 24,
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: '#000',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#000',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  roleBadge: {
    backgroundColor: '#007aff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  roleBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600' as const,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#000',
    marginBottom: 16,
  },
  optionsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    overflow: 'hidden',
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#000',
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionValue: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#ff3b30',
  },
});
