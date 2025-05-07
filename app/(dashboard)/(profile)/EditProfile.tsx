"use client"

import { useState } from "react"
import { View, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native"
import { useRouter } from "expo-router"
import { useDispatch, useSelector } from "react-redux"
import { updateProfile } from "../../../redux/slices/authSlice"
import type { AppDispatch, RootState } from "../../../redux/store"
import Header from "../../../components/Header"
import Input from "../../../components/Input"
import Button from "../../../components/Button"
import LoadingSpinner from "../../../components/LoadingSpinner"

export default function EditProfile() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user, loading } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    telephone: user?.telephone || "",
  })

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
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

    if (!formData.telephone.trim()) {
      newErrors.telephone = "Phone number is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async () => {
    if (!validate()) return

    try {
      await dispatch(updateProfile(formData)).unwrap()
      Alert.alert("Success", "Profile updated successfully", [{ text: "OK", onPress: () => router.back() }])
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update profile")
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <View className="flex-1 bg-gray-100">
        <Header title="Edit Profile" />

        <ScrollView className="flex-1 p-4">
          <View className="space-y-4">
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
              label="Phone Number"
              value={formData.telephone}
              onChangeText={(value) => handleChange("telephone", value)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              error={errors.telephone}
            />

            <Button title={loading ? "Updating..." : "Update Profile"} onPress={handleSubmit} disabled={loading} />
          </View>

          {loading && <LoadingSpinner />}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}
