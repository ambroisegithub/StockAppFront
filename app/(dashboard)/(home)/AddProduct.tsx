"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native"
import { useRouter } from "expo-router"
import { useDispatch, useSelector } from "react-redux"
import { fetchProductTypes, createProduct } from "../../../redux/slices/productSlice"
import type { AppDispatch, RootState } from "../../../redux/store"
import Header from "../../../components/Header"
import Input from "../../../components/Input"
import Button from "../../../components/Button"
import LoadingSpinner from "../../../components/LoadingSpinner"

export default function AddProduct() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { productTypes, loading } = useSelector((state: RootState) => state.products)

  const [formData, setFormData] = useState({
    name: "",
    productTypeId: "",
    price: "",
    costPrice: "",
    qtyInStock: "",
    description: "",
    sku: "",
    size: "",
    color: "",
  })

  const [errors, setErrors] = useState({
    name: "",
    productTypeId: "",
    price: "",
    costPrice: "",
    qtyInStock: "",
    sku: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadProductTypes()
  }, [])

  const loa = useState(false)

  useEffect(() => {
    loadProductTypes()
  }, [])

  const loadProductTypes = async () => {
    try {
      await dispatch(fetchProductTypes()).unwrap()
    } catch (error) {
      // Error is handled in the product slice
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validate = () => {
    let isValid = true
    const newErrors = { ...errors }

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
      isValid = false
    }

    if (!formData.productTypeId) {
      newErrors.productTypeId = "Product type is required"
      isValid = false
    }

    if (!formData.price || isNaN(Number.parseFloat(formData.price)) || Number.parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required"
      isValid = false
    }

    if (
      !formData.costPrice ||
      isNaN(Number.parseFloat(formData.costPrice)) ||
      Number.parseFloat(formData.costPrice) <= 0
    ) {
      newErrors.costPrice = "Valid cost price is required"
      isValid = false
    }

    if (
      !formData.qtyInStock ||
      isNaN(Number.parseInt(formData.qtyInStock)) ||
      Number.parseInt(formData.qtyInStock) < 0
    ) {
      newErrors.qtyInStock = "Valid quantity is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const productData = {
        ...formData,
        productTypeId: Number.parseInt(formData.productTypeId),
        price: Number.parseFloat(formData.price),
        costPrice: Number.parseFloat(formData.costPrice),
        qtyInStock: Number.parseInt(formData.qtyInStock),
      }

      await dispatch(createProduct(productData)).unwrap()

      Alert.alert("Success", "Product created successfully", [{ text: "OK", onPress: () => router.back() }])
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create product")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <View className="flex-1 bg-gray-100">
        <Header title="Add Product" />

        <ScrollView className="flex-1 p-4">
          <View className="space-y-4">
            <Input
              label="Product Name *"
              value={formData.name}
              onChangeText={(value) => handleChange("name", value)}
              placeholder="Enter product name"
              error={errors.name}
            />

            <View>
              <Text className="text-gray-700 font-medium mb-1">Product Type *</Text>
              {errors.productTypeId ? <Text className="text-red-500 text-sm mb-1">{errors.productTypeId}</Text> : null}

              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {productTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    className={`px-4 py-2 rounded-lg mr-2 ${
                      formData.productTypeId === type.id.toString() ? "bg-green-500" : "bg-gray-200"
                    }`}
                    onPress={() => handleChange("productTypeId", type.id.toString())}
                  >
                    <Text className={formData.productTypeId === type.id.toString() ? "text-white" : "text-gray-700"}>
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Input
                  label="Price *"
                  value={formData.price}
                  onChangeText={(value) => {
                    if (/^\d*\.?\d*$/.test(value)) {
                      handleChange("price", value)
                    }
                  }}
                  placeholder="0.00"
                  keyboardType="numeric"
                  error={errors.price}
                />
              </View>

              <View className="flex-1">
                <Input
                  label="Cost Price *"
                  value={formData.costPrice}
                  onChangeText={(value) => {
                    if (/^\d*\.?\d*$/.test(value)) {
                      handleChange("costPrice", value)
                    }
                  }}
                  placeholder="0.00"
                  keyboardType="numeric"
                  error={errors.costPrice}
                />
              </View>
            </View>

            <Input
              label="Initial Stock Quantity *"
              value={formData.qtyInStock}
              onChangeText={(value) => {
                if (/^\d*$/.test(value)) {
                  handleChange("qtyInStock", value)
                }
              }}
              placeholder="0"
              keyboardType="numeric"
              error={errors.qtyInStock}
            />

            <Input
              label="SKU"
              value={formData.sku}
              onChangeText={(value) => handleChange("sku", value)}
              placeholder="Enter product SKU (optional)"
              error={errors.sku}
            />

            <Input
              label="Description"
              value={formData.description}
              onChangeText={(value) => handleChange("description", value)}
              placeholder="Enter product description (optional)"
              multiline
              numberOfLines={3}
            />

            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Input
                  label="Size"
                  value={formData.size}
                  onChangeText={(value) => handleChange("size", value)}
                  placeholder="e.g., Small, Medium, Large"
                />
              </View>

              <View className="flex-1">
                <Input
                  label="Color"
                  value={formData.color}
                  onChangeText={(value) => handleChange("color", value)}
                  placeholder="e.g., Red, Blue, Green"
                />
              </View>
            </View>

            <Button
              title={isSubmitting ? "Creating..." : "Create Product"}
              onPress={handleSubmit}
              disabled={isSubmitting || loading}
            />
          </View>

          {(isSubmitting || loading) && <LoadingSpinner />}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}
