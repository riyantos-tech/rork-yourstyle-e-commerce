import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { ShoppingCart, Heart, ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '@/contexts/CartContext';
import { getProductById } from '@/mocks/products';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const product = getProductById(id as string);

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      Alert.alert('Select Size', 'Please select a size');
      return;
    }
    if (!selectedColor) {
      Alert.alert('Select Color', 'Please select a color');
      return;
    }

    await addToCart({
      product,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Added to Cart', `${product.name} has been added to your cart`);
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={product.image} style={styles.productImage} contentFit="cover" />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft color="#fff" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
            <Heart color={isFavorite ? '#ff3b30' : '#fff'} size={24} fill={isFavorite ? '#ff3b30' : 'transparent'} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.titleSection}>
              <Text style={styles.productName}>{product.name}</Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>${product.price}</Text>
                {hasDiscount && (
                  <>
                    <Text style={styles.originalPrice}>${product.originalPrice}</Text>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>
                        -{Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)}% OFF
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Size</Text>
            <View style={styles.optionsRow}>
              {product.sizes.map(size => (
                <TouchableOpacity
                  key={size}
                  style={[styles.optionButton, selectedSize === size && styles.optionButtonActive]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[styles.optionText, selectedSize === size && styles.optionTextActive]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Color</Text>
            <View style={styles.optionsRow}>
              {product.colors.map(color => (
                <TouchableOpacity
                  key={color}
                  style={[styles.optionButton, selectedColor === color && styles.optionButtonActive]}
                  onPress={() => setSelectedColor(color)}
                >
                  <Text style={[styles.optionText, selectedColor === color && styles.optionTextActive]}>
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalPrice}>${(product.price * quantity).toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <ShoppingCart color="#fff" size={20} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#999',
  },
  imageContainer: {
    width,
    height: width * 1.2,
    position: 'relative' as const,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute' as const,
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute' as const,
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  titleSection: {
    gap: 12,
  },
  productName: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#000',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#000',
  },
  originalPrice: {
    fontSize: 20,
    color: '#999',
    textDecorationLine: 'line-through' as const,
  },
  discountBadge: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700' as const,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#000',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  optionButtonActive: {
    borderColor: '#000',
    backgroundColor: '#000',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#666',
  },
  optionTextActive: {
    color: '#fff',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#000',
  },
  quantityText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#000',
    minWidth: 40,
    textAlign: 'center' as const,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 16,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#000',
  },
  addToCartButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
