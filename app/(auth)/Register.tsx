"use client"

import { useState } from "react"
import { View, Text, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { useRouter } from "expo-router"
import { useDispatch, useSelector } from "react-redux"
import { registerUser } from "../../redux/slices/authSlice"
import type { AppDispatch, RootState } from "../../redux/store"
import Input from "../../components/Input"
import Button from "../../components/Button"
import LoadingSpinner from "../../components/LoadingSpinner"

export default function Register() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
  })

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    telephone: "",
  })

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
      isValid = false
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
      isValid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Phone number is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleRegister = async () => {
    if (!validate()) return

    try {
      await dispatch(registerUser(formData)).unwrap()
      router.replace("/Login")
    } catch (error) {
      // Error is handled in the auth slice
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 bg-white">
          <View className="items-center mt-6 mb-6">
            <Image source={require("../../assets/images/logo.png")} className="w-24 h-24" resizeMode="contain" />
            <Text className="text-2xl font-bold mt-2 text-green-700">Create Account</Text>
            <Text className="text-gray-600 mt-1">Register as a new employee</Text>
          </View>

          {error && (
            <View className="bg-red-100 p-3 rounded-lg mb-4">
              <Text className="text-red-700">{error}</Text>
            </View>
          )}

          <View className="space-y-3">
            <Input
              label="First Name"
              value={formData.firstName}
              onChangeText={(value) => handleChange("firstName", value)}
              placeholder="Enter your first name"
              error={errors.firstName}
            />

            <Input
              label="Last Name"
              value={formData.lastName}
              onChangeText={(value) => handleChange("lastName", value)}
              placeholder="Enter your last name"
              error={errors.lastName}
            />

            <Input
              label="Email"
              value={formData.email}
              onChangeText={(value) => handleChange("email", value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Phone Number"
              value={formData.telephone}
              onChangeText={(value) => handleChange("telephone", value)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              error={errors.telephone}
            />

            <Button title={loading ? "Registering..." : "Register"} onPress={handleRegister} disabled={loading} />

            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.replace("/Login")}>
                <Text className="text-green-700 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

          {loading && <LoadingSpinner />}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
