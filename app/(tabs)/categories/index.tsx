import { router } from 'expo-router';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { getProductsByCategory } from '@/mocks/products';
import { Product } from '@/types/product';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/(tabs)/categories/product/${product.id}` as any)}
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

function CategoryButton({ 
  category, 
  label, 
  image, 
  selected, 
  onPress 
}: { 
  category: string; 
  label: string; 
  image: string; 
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.categoryButton, selected && styles.categoryButtonActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image source={image} style={styles.categoryImage} contentFit="cover" />
      <View style={[styles.categoryOverlay, selected && styles.categoryOverlayActive]} />
      <Text style={[styles.categoryLabel, selected && styles.categoryLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function CategoriesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    {
      key: 'all',
      label: 'All Products',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
    },
    {
      key: 'men',
      label: 'Men',
      image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&q=80',
    },
    {
      key: 'women',
      label: 'Women',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    },
    {
      key: 'kids',
      label: 'Kids',
      image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e4?w=800&q=80',
    },
  ];

  const products = getProductsByCategory(selectedCategory);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.categoriesGrid}>
            {categories.map(cat => (
              <CategoryButton
                key={cat.key}
                category={cat.key}
                label={cat.label}
                image={cat.image}
                selected={selectedCategory === cat.key}
                onPress={() => setSelectedCategory(cat.key)}
              />
            ))}
          </View>
        </View>

        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Products' : `${categories.find(c => c.key === selectedCategory)?.label} Collection`}
          </Text>
          <Text style={styles.productCount}>{products.length} products</Text>
          <View style={styles.productsGrid}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </View>
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
  categoriesSection: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#000',
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    width: (width - 52) / 2,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative' as const,
  },
  categoryButtonActive: {
    borderWidth: 3,
    borderColor: '#000',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  categoryOverlayActive: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  categoryLabel: {
    position: 'absolute' as const,
    bottom: 12,
    left: 12,
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#fff',
  },
  categoryLabelActive: {
    fontSize: 20,
  },
  productsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  productCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
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
