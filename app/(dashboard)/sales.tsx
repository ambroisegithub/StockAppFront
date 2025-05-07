"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts } from "../../redux/slices/productSlice"
import { recordSale } from "../../redux/slices/salesSlice"
import type { AppDispatch, RootState } from "../../redux/store"
import Header from "../../components/Header"
import LoadingSpinner from "../../components/LoadingSpinner"
import Input from "../../components/Input"
import Button from "../../components/Button"
import { Ionicons } from "@expo/vector-icons"

export default function Sales() {
  const dispatch = useDispatch<AppDispatch>()
  const { products, loading: productsLoading } = useSelector((state: RootState) => state.products)
  const { loading: salesLoading } = useSelector((state: RootState) => state.sales)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState("1")
  const [searchQuery, setSearchQuery] = useState("")
  const [quantityError, setQuantityError] = useState("")

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      await dispatch(fetchProducts({ inStock: true })).unwrap()
    } catch (error) {
      // Error is handled in the products slice
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadProducts()
    setRefreshing(false)
  }

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product)
    setQuantity("1")
    setQuantityError("")
  }

  const handleQuantityChange = (value: string) => {
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setQuantity(value)
      setQuantityError("")
    }
  }

  const validateSale = () => {
    if (!selectedProduct) {
      Alert.alert("Error", "Please select a product")
      return false
    }

    const qty = Number.parseInt(quantity)
    if (!quantity || isNaN(qty) || qty <= 0) {
      setQuantityError("Please enter a valid quantity")
      return false
    }

    if (qty > selectedProduct.qtyInStock) {
      setQuantityError(`Only ${selectedProduct.qtyInStock} items in stock`)
      return false
    }

    return true
  }

  const handleRecordSale = async () => {
    if (!validateSale()) return

    try {
      await dispatch(
        recordSale({
          productId: selectedProduct.id,
          qtySold: Number.parseInt(quantity),
        }),
      ).unwrap()

      Alert.alert("Success", "Sale recorded successfully and awaiting approval", [
        {
          text: "OK",
          onPress: () => {
            setSelectedProduct(null)
            setQuantity("1")
            loadProducts() // Refresh products to update stock
          },
        },
      ])
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to record sale")
    }
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <View className="flex-1 bg-gray-100">
      <Header title="Record Sale" showBackButton={false} />

      <ScrollView className="flex-1" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="p-4">
          <Input
            placeholder="Search products by name or SKU"
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<Ionicons name="search" size={20} color="#6B7280" />}
          />

          {selectedProduct ? (
            <View className="bg-white rounded-lg p-4 mt-4 shadow-sm">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold">{selectedProduct.name}</Text>
                <TouchableOpacity onPress={() => setSelectedProduct(null)}>
                  <Ionicons name="close-circle-outline" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Price:</Text>
                <Text className="font-medium">${selectedProduct.price.toFixed(2)}</Text>
              </View>

              <View className="flex-row justify-between mb-4">
                <Text className="text-gray-600">In Stock:</Text>
                <Text className="font-medium">{selectedProduct.qtyInStock}</Text>
              </View>

              <Input
                label="Quantity"
                value={quantity}
                onChangeText={handleQuantityChange}
                keyboardType="numeric"
                error={quantityError}
              />

              <View className="flex-row justify-between mt-2 mb-4">
                <Text className="text-gray-600">Total:</Text>
                <Text className="font-semibold text-lg">
                  ${(selectedProduct.price * (Number.parseInt(quantity) || 0)).toFixed(2)}
                </Text>
              </View>

              <Button
                title={salesLoading ? "Processing..." : "Record Sale"}
                onPress={handleRecordSale}
                disabled={salesLoading}
              />
            </View>
          ) : (
            <>
              <Text className="text-lg font-semibold mt-4 mb-2">Select a Product</Text>

              {productsLoading && !refreshing ? (
                <LoadingSpinner />
              ) : filteredProducts.length === 0 ? (
                <View className="bg-white rounded-lg p-4 items-center justify-center">
                  <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
                  <Text className="text-gray-500 mt-2">
                    {searchQuery ? "No products match your search" : "No products available"}
                  </Text>
                </View>
              ) : (
                filteredProducts.map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    className="bg-white rounded-lg p-4 mb-3 shadow-sm"
                    onPress={() => handleSelectProduct(product)}
                  >
                    <View className="flex-row justify-between">
                      <Text className="font-medium">{product.name}</Text>
                      <Text className="font-medium">${product.price.toFixed(2)}</Text>
                    </View>
                    <View className="flex-row justify-between mt-1">
                      <Text className="text-gray-600">{product.sku ? `SKU: ${product.sku}` : "No SKU"}</Text>
                      <Text className={`${product.qtyInStock < 10 ? "text-orange-600" : "text-green-600"}`}>
                        In Stock: {product.qtyInStock}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
