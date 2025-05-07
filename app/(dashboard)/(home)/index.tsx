"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native"
import { useRouter } from "expo-router"
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts, fetchProductTypes } from "../../../redux/slices/productSlice"
import type { AppDispatch, RootState } from "../../../redux/store"
import Header from "../../../components/Header"
import ProductCard from "../../../components/ProductCard"
import LoadingSpinner from "../../../components/LoadingSpinner"
import { Ionicons } from "@expo/vector-icons"

export default function Home() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { products, productTypes, loading, error } = useSelector((state: RootState) => state.products)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedType, setSelectedType] = useState<number | null>(null)
  const [showLowStock, setShowLowStock] = useState(false)

  const isAdmin = user?.role === "admin"

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      await Promise.all([dispatch(fetchProducts({})).unwrap(), dispatch(fetchProductTypes()).unwrap()])
    } catch (error) {
      // Errors are handled in the respective slices
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const handleAddProduct = () => {
    router.push("/(dashboard)/(home)/AddProduct")
  }

  const handleSearch = () => {
    router.push("/(dashboard)/(home)/Search")
  }

  const handleProductPress = (productId: number) => {
    router.push({
      pathname: "/(dashboard)/(home)/ProductDetails",
      params: { id: productId },
    })
  }

  const filteredProducts = products.filter((product) => {
    if (selectedType !== null && product.productType.id !== selectedType) {
      return false
    }
    if (showLowStock && product.qtyInStock >= 10) {
      return false
    }
    return true
  })

  const lowStockCount = products.filter((p) => p.qtyInStock < 10).length

  return (
    <View className="flex-1 bg-gray-100">
      <Header
        title="Inventory"
        showBackButton={false}
        rightComponent={
          <View className="flex-row">
            <TouchableOpacity onPress={handleSearch} className="mr-4">
              <Ionicons name="search" size={24} color="#2ECC71" />
            </TouchableOpacity>
            {isAdmin && (
              <TouchableOpacity onPress={handleAddProduct}>
                <Ionicons name="add-circle-outline" size={24} color="#2ECC71" />
              </TouchableOpacity>
            )}
          </View>
        }
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white py-2 px-4 border-b border-gray-200"
      >
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mr-2 ${selectedType === null && !showLowStock ? "bg-green-100" : "bg-gray-100"}`}
          onPress={() => {
            setSelectedType(null)
            setShowLowStock(false)
          }}
        >
          <Text className={`${selectedType === null && !showLowStock ? "text-green-700" : "text-gray-700"}`}>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`px-4 py-2 rounded-full mr-2 ${showLowStock ? "bg-orange-100" : "bg-gray-100"}`}
          onPress={() => {
            setSelectedType(null)
            setShowLowStock(!showLowStock)
          }}
        >
          <Text className={`${showLowStock ? "text-orange-700" : "text-gray-700"}`}>Low Stock ({lowStockCount})</Text>
        </TouchableOpacity>

        {productTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            className={`px-4 py-2 rounded-full mr-2 ${selectedType === type.id ? "bg-green-100" : "bg-gray-100"}`}
            onPress={() => {
              setSelectedType(selectedType === type.id ? null : type.id)
              setShowLowStock(false)
            }}
          >
            <Text className={`${selectedType === type.id ? "text-green-700" : "text-gray-700"}`}>{type.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView className="flex-1" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="p-4">
          {loading && !refreshing ? (
            <LoadingSpinner />
          ) : error ? (
            <View className="items-center justify-center p-4">
              <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
              <Text className="text-red-500 mt-2">{error}</Text>
              <TouchableOpacity className="mt-4 bg-green-500 px-4 py-2 rounded-lg" onPress={loadData}>
                <Text className="text-white font-medium">Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : filteredProducts.length === 0 ? (
            <View className="items-center justify-center p-8">
              <Ionicons name="cube-outline" size={64} color="#9CA3AF" />
              <Text className="text-gray-500 text-center mt-4">
                No products found. {isAdmin ? "Add some products to get started!" : ""}
              </Text>
              {isAdmin && (
                <TouchableOpacity className="mt-4 bg-green-500 px-6 py-3 rounded-lg" onPress={handleAddProduct}>
                  <Text className="text-white font-medium">Add Product</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View>
              <Text className="text-lg font-semibold mb-2">
                {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"}
              </Text>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onPress={() => handleProductPress(product.id)} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
