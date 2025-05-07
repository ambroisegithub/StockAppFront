"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native"
import { useRouter } from "expo-router"
import { useDispatch, useSelector } from "react-redux"
import { searchProducts } from "../../../redux/slices/productSlice"
import type { AppDispatch, RootState } from "../../../redux/store"
import Header from "../../../components/Header"
import Input from "../../../components/Input"
import ProductCard from "../../../components/ProductCard"
import LoadingSpinner from "../../../components/LoadingSpinner"
import { Ionicons } from "@expo/vector-icons"

export default function Search() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { searchResults, loading } = useSelector((state: RootState) => state.products)

  const [searchQuery, setSearchQuery] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      await dispatch(searchProducts(searchQuery)).unwrap()
      setHasSearched(true)
    } catch (error) {
      // Error is handled in the product slice
    }
  }

  const onRefresh = async () => {
    if (!searchQuery.trim()) return

    setRefreshing(true)
    await handleSearch()
    setRefreshing(false)
  }

  const handleProductPress = (productId: number) => {
    router.push({
      pathname: "/(dashboard)/(home)/ProductDetails",
      params: { id: productId },
    })
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Header title="Search Products" />

      <View className="p-4 bg-white border-b border-gray-200">
        <View className="flex-row">
          <View className="flex-1 mr-2">
            <Input
              placeholder="Search by name, SKU, or description"
              value={searchQuery}
              onChangeText={setSearchQuery}
              leftIcon={<Ionicons name="search" size={20} color="#6B7280" />}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
          </View>

          <TouchableOpacity className="bg-green-500 px-4 rounded-lg items-center justify-center" onPress={handleSearch}>
            <Text className="text-white font-medium">Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View className="p-4">
          {loading && !refreshing ? (
            <LoadingSpinner />
          ) : hasSearched ? (
            searchResults.length === 0 ? (
              <View className="items-center justify-center p-8">
                <Ionicons name="search-outline" size={64} color="#9CA3AF" />
                <Text className="text-gray-500 text-center mt-4">No products found matching "{searchQuery}"</Text>
              </View>
            ) : (
              <View>
                <Text className="text-lg font-semibold mb-2">
                  {searchResults.length} {searchResults.length === 1 ? "Result" : "Results"}
                </Text>
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} onPress={() => handleProductPress(product.id)} />
                ))}
              </View>
            )
          ) : (
            <View className="items-center justify-center p-8">
              <Ionicons name="search-outline" size={64} color="#9CA3AF" />
              <Text className="text-gray-500 text-center mt-4">Search for products by name, SKU, or description</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
