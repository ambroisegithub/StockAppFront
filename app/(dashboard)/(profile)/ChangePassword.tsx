"use client"

import { useState } from "react"
import { View, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native"
import { useRouter } from "expo-router"
import { useDispatch, useSelector } from "react-redux"
import { changePassword } from "../../../redux/slices/authSlice"
import type { AppDispatch, RootState } from "../../../redux/store"
import Header from "../../../components/Header"
import Input from "../../../components/Input"
import Button from "../../../components/Button"
import LoadingSpinner from "../../../components/LoadingSpinner"

export default function ChangePassword() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { loading } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
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

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
      isValid = false
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required"
      isValid = false
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
      isValid = false
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      isValid = false
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async () => {
    if (!validate()) return

    try {
      await dispatch(
        changePassword({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      ).unwrap()

      Alert.alert("Success", "Password changed successfully", [{ text: "OK", onPress: () => router.back() }])
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to change password")
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <View className="flex-1 bg-gray-100">
        <Header title="Change Password" />

        <ScrollView className="flex-1 p-4">
          <View className="space-y-4">
            <Input
              label="Current Password"
              value={formData.currentPassword}
              onChangeText={(value) => handleChange("currentPassword", value)}
              placeholder="Enter your current password"
              secureTextEntry
              error={errors.currentPassword}
            />

            <Input
              label="New Password"
              value={formData.newPassword}
              onChangeText={(value) => handleChange("newPassword", value)}
              placeholder="Enter your new password"
              secureTextEntry
              error={errors.newPassword}
            />

            <Input
              label="Confirm New Password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleChange("confirmPassword", value)}
              placeholder="Confirm your new password"
              secureTextEntry
              error={errors.confirmPassword}
            />

            <Button title={loading ? "Changing..." : "Change Password"} onPress={handleSubmit} disabled={loading} />
          </View>

          {loading && <LoadingSpinner />}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  )
}
