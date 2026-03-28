import { router } from 'expo-router';
import { Image } from 'expo-image';
import { Search, TrendingUp, Sparkles } from 'lucide-react-native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated as RNAnimated,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { getFeaturedProducts, PRODUCTS } from '@/mocks/products';
import { Product } from '@/types/product';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/(tabs)/(home)/product/${product.id}` as any)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image source={product.image} style={styles.productImage} contentFit="cover" />
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}%
            </Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.price}</Text>
          {hasDiscount && (
            <Text style={styles.originalPrice}>${product.originalPrice}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

function CategoryChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.categoryChip, active && styles.categoryChipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [fadeAnim] = useState(() => new RNAnimated.Value(0));
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading) {
      if (!user) {
        router.replace('/auth/login' as any);
      } else {
        RNAnimated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [user, isLoading, isMounted, fadeAnim]);

  if (isLoading || !user) {
    return null;
  }

  const featuredProducts = getFeaturedProducts();
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { key: 'all', label: 'All' },
    { key: 'men', label: 'Men' },
    { key: 'women', label: 'Women' },
    { key: 'kids', label: 'Kids' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <RNAnimated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user.name}! 👋</Text>
            <Text style={styles.subtitle}>Discover your style</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search color="#999" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(cat => (
            <CategoryChip
              key={cat.key}
              label={cat.label}
              active={selectedCategory === cat.key}
              onPress={() => setSelectedCategory(cat.key)}
            />
          ))}
        </ScrollView>

        {selectedCategory === 'all' && searchQuery === '' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Sparkles color="#000" size={20} />
              <Text style={styles.sectionTitle}>Featured Collection</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredScroll}
            >
              {featuredProducts.map(product => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.featuredCard}
                  onPress={() => router.push(`/(tabs)/(home)/product/${product.id}` as any)}
                  activeOpacity={0.9}
                >
                  <Image source={product.image} style={styles.featuredImage} contentFit="cover" />
                  <View style={styles.featuredOverlay} />
                  <View style={styles.featuredContent}>
                    <Text style={styles.featuredName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <Text style={styles.featuredPrice}>${product.price}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp color="#000" size={20} />
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'all' ? 'All Products' : `${categories.find(c => c.key === selectedCategory)?.label} Collection`}
            </Text>
          </View>
          <View style={styles.productsGrid}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
        </View>
      </RNAnimated.View>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#000',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  categoryChipActive: {
    backgroundColor: '#000',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#666',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#000',
  },
  featuredScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  featuredCard: {
    width: width * 0.7,
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  featuredContent: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  featuredName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#fff',
    marginBottom: 8,
  },
  featuredPrice: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#fff',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 16,
  },
  productCard: {
    width: ITEM_WIDTH,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative' as const,
  },
  productImage: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.2,
    backgroundColor: '#f5f5f5',
  },
  discountBadge: {
    position: 'absolute' as const,
    top: 12,
    right: 12,
    backgroundColor: '#ff3b30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#000',
    marginBottom: 6,
    height: 36,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#000',
  },
  originalPrice: {
    fontSize: 14,
    color: '#999',
    textDecorationLine: 'line-through' as const,
  },
});
