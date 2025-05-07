import type React from "react"
import { View, Text, TouchableOpacity } from "react-native"

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    qtyInStock: number
    productType: {
      name: string
    }
    sku?: string
  }
  onPress: () => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  return (
    <TouchableOpacity className="bg-white rounded-lg p-4 mb-3 shadow-sm" onPress={onPress}>
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="font-semibold text-lg">{product.name}</Text>
          <Text className="text-gray-600 text-sm mt-1">{product.productType.name}</Text>
          {product.sku && <Text className="text-gray-500 text-sm mt-1">SKU: {product.sku}</Text>}
        </View>
        <View className="items-end">
          <Text className="font-bold text-lg">${product.price.toFixed(2)}</Text>
          <Text className={`mt-1 ${product.qtyInStock < 10 ? "text-orange-600" : "text-green-600"}`}>
            {product.qtyInStock === 0 ? "Out of stock" : `${product.qtyInStock} in stock`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ProductCard
