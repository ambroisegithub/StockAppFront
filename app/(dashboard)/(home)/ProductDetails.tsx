"use client"

import { useEffect, useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useDispatch, useSelector } from "react-redux"
import { fetchProductDetails, updateStock } from "../../../redux/slices/productSlice"
import type { AppDispatch, RootState } from "../../../redux/store"
import Header from "../../../components/Header"
import Input from "../../../components/Input"
import Button from "../../../components/Button"
import LoadingSpinner from "../../../components/LoadingSpinner"
import { Ionicons } from "@expo/vector-icons"

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)
  const { productDetails, loading, error } = useSelector((state: RootState) => state.products)

  const [stockAction, setStockAction] = useState<"in" | "out" | null>(null)
  const [quantity, setQuantity] = useState("")
  const [reason, setReason] = useState("")
  const [costPrice, setCostPrice] = useState("")
  const [errors, setErrors] = useState({ quantity: "", reason: "", costPrice: "" })
  const [isUpdatingStock, setIsUpdatingStock] = useState(false)

  const isAdmin = user?.role === "admin"
  const productId = Number.parseInt(id as string)

  useEffect(() => {
    if (productId) {
      loadProductDetails()
    }
  }, [productId])

  const loadProductDetails = async () => {
    try {
      await dispatch(fetchProductDetails(productId)).unwrap()
    } catch (error) {
      // Error is handled in the product slice
    }
  }

  const handleQuantityChange = (value: string) => {
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setQuantity(value)
      if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: "" }))
    }
  }

  const handleCostPriceChange = (value: string) => {
    // Allow numbers and decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setCostPrice(value)
      if (errors.costPrice) setErrors((prev) => ({ ...prev, costPrice: "" }))
    }
  }

  const validateStockUpdate = () => {
    const newErrors = { quantity: "", reason: "", costPrice: "" }
    let isValid = true

    if (!quantity || Number.parseInt(quantity) <= 0) {
      newErrors.quantity = "Please enter a valid quantity"
      isValid = false
    }

    if (!reason.trim()) {
      newErrors.reason = "Please enter a reason"
      isValid = false
    }

    if (stockAction === "in" && (!costPrice || Number.parseFloat(costPrice) <= 0)) {
      newErrors.costPrice = "Please enter a valid cost price"
      isValid = false
    }

    if (stockAction === "out" && productDetails && Number.parseInt(quantity) > productDetails.qtyInStock) {
      newErrors.quantity = `Only ${productDetails.qtyInStock} items in stock`
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleUpdateStock = async () => {
    if (!validateStockUpdate()) return

    setIsUpdatingStock(true)
    try {
      await dispatch(
        updateStock({
          productId,
          type: stockAction as "in" | "out",
          quantity: Number.parseInt(quantity),
          reason,
          ...(stockAction === "in" ? { costPrice: Number.parseFloat(costPrice) } : {}),
        }),
      ).unwrap()

      Alert.alert("Success", `Stock ${stockAction === "in" ? "added" : "removed"} successfully`, [
        {
          text: "OK",
          onPress: () => {
            setStockAction(null)
            setQuantity("")
            setReason("")
            setCostPrice("")
            loadProductDetails() // Refresh product details
          },
        },
      ])
    } catch (error: any) {
      Alert.alert("Error", error.message || `Failed to ${stockAction === "in" ? "add" : "remove"} stock`)
    } finally {
      setIsUpdatingStock(false)
    }
  }

  if (loading && !productDetails) {
    return (
      <View className="flex-1 bg-gray-100">
        <Header title="Product Details" />
        <View className="flex-1 items-center justify-center">
          <LoadingSpinner />
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-100">
        <Header title="Product Details" />
        <View className="flex-1 items-center justify-center p-4">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className="text-red-500 text-center mt-2">{error}</Text>
          <TouchableOpacity className="mt-4 bg-green-500 px-4 py-2 rounded-lg" onPress={loadProductDetails}>
            <Text className="text-white font-medium">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (!productDetails) {
    return (
      <View className="flex-1 bg-gray-100">
        <Header title="Product Details" />
        <View className="flex-1 items-center justify-center">
          <Text>Product not found</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Header title="Product Details" />

      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-xl font-bold">{productDetails.name}</Text>
            <Text className="text-gray-600 mt-1">{productDetails.productType.name}</Text>

            {productDetails.sku && <Text className="text-gray-600 mt-1">SKU: {productDetails.sku}</Text>}

            <View className="flex-row justify-between mt-4">
              <View>
                <Text className="text-gray-600">Price</Text>
                <Text className="text-lg font-semibold">${productDetails.price.toFixed(2)}</Text>
              </View>
              <View>
                <Text className="text-gray-600">Cost Price</Text>
                <Text className="text-lg font-semibold">${productDetails.costPrice.toFixed(2)}</Text>
              </View>
              <View>
                <Text className="text-gray-600">In Stock</Text>
                <Text
                  className={`text-lg font-semibold ${productDetails.qtyInStock < 10 ? "text-orange-600" : "text-green-600"}`}
                >
                  {productDetails.qtyInStock}
                </Text>
              </View>
            </View>

            {productDetails.description && (
              <View className="mt-4">
                <Text className="text-gray-600">Description</Text>
                <Text className="mt-1">{productDetails.description}</Text>
              </View>
            )}

            {(productDetails.size || productDetails.color) && (
              <View className="mt-4 flex-row">
                {productDetails.size && (
                  <View className="mr-4">
                    <Text className="text-gray-600">Size</Text>
                    <Text>{productDetails.size}</Text>
                  </View>
                )}
                {productDetails.color && (
                  <View>
                    <Text className="text-gray-600">Color</Text>
                    <Text>{productDetails.color}</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {(isAdmin || user?.role === "employee") && (
            <View className="mt-4">
              <Text className="text-lg font-semibold mb-2">Manage Stock</Text>

              {stockAction ? (
                <View className="bg-white rounded-lg p-4 shadow-sm">
                  <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-semibold">{stockAction === "in" ? "Add Stock" : "Remove Stock"}</Text>
                    <TouchableOpacity onPress={() => setStockAction(null)}>
                      <Ionicons name="close-circle-outline" size={24} color="#6B7280" />
                    </TouchableOpacity>
                  </View>

                  <Input
                    label="Quantity"
                    value={quantity}
                    onChangeText={handleQuantityChange}
                    keyboardType="numeric"
                    error={errors.quantity}
                  />

                  <Input
                    label="Reason"
                    value={reason}
                    onChangeText={(text) => {
                      setReason(text)
                      if (errors.reason) setErrors((prev) => ({ ...prev, reason: "" }))
                    }}
                    placeholder={stockAction === "in" ? "e.g., New shipment" : "e.g., Damaged goods"}
                    error={errors.reason}
                  />

                  {stockAction === "in" && (
                    <Input
                      label="Cost Price"
                      value={costPrice}
                      onChangeText={handleCostPriceChange}
                      keyboardType="numeric"
                      placeholder={`Current: $${productDetails.costPrice.toFixed(2)}`}
                      error={errors.costPrice}
                    />
                  )}

                  <Button
                    title={isUpdatingStock ? "Processing..." : stockAction === "in" ? "Add Stock" : "Remove Stock"}
                    onPress={handleUpdateStock}
                    disabled={isUpdatingStock}
                  />
                </View>
              ) : (
                <View className="flex-row space-x-4">
                  <TouchableOpacity
                    className="flex-1 bg-green-500 p-3 rounded-lg items-center"
                    onPress={() => setStockAction("in")}
                  >
                    <Ionicons name="add-circle-outline" size={24} color="white" />
                    <Text className="text-white font-medium mt-1">Add Stock</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 bg-orange-500 p-3 rounded-lg items-center"
                    onPress={() => setStockAction("out")}
                    disabled={productDetails.qtyInStock <= 0}
                  >
                    <Ionicons name="remove-circle-outline" size={24} color="white" />
                    <Text className="text-white font-medium mt-1">Remove Stock</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {productDetails.stockMovements && productDetails.stockMovements.length > 0 && (
            <View className="mt-4">
              <Text className="text-lg font-semibold mb-2">Recent Stock Movements</Text>

              {productDetails.stockMovements.slice(0, 5).map((movement, index) => (
                <View key={index} className="bg-white rounded-lg p-4 mb-2 shadow-sm">
                  <View className="flex-row justify-between">
                    <Text className={`font-medium ${movement.type === "in" ? "text-green-600" : "text-orange-600"}`}>
                      {movement.type === "in" ? "+" : "-"}
                      {movement.quantity} units
                    </Text>
                    <Text className="text-gray-600">{new Date(movement.movementDate).toLocaleDateString()}</Text>
                  </View>
                  <Text className="text-gray-600 mt-1">{movement.reason}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
