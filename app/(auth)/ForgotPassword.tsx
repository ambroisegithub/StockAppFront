"use client"

import { useState } from "react"
import { View, Text, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native"
import { useRouter } from "expo-router"
import { useDispatch, useSelector } from "react-redux"
import { requestPasswordReset } from "../../redux/slices/authSlice"
import type { AppDispatch, RootState } from "../../redux/store"
import Input from "../../components/Input"
import Button from "../../components/Button"
import LoadingSpinner from "../../components/LoadingSpinner"

export default function ForgotPassword() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.auth)

  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")

  const validate = () => {
    if (!email.trim()) {
      setEmailError("Email is required")
      return false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid")
      return false
    }
    setEmailError("")
    return true
  }

  const handleResetPassword = async () => {
    if (!validate()) return

    try {
      await dispatch(requestPasswordReset(email)).unwrap()
      Alert.alert(
        "Password Reset",
        "If an account exists with this email, you will receive password reset instructions.",
        [{ text: "OK", onPress: () => router.replace("/Login") }],
      )
    } catch (error) {
      // Error is handled in the auth slice
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 bg-white">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-green-700">← Back to Login</Text>
          </TouchableOpacity>

          <View className="items-center mt-6 mb-8">
            <Image source={require("../../assets/images/logo.png")} className="w-24 h-24" resizeMode="contain" />
            <Text className="text-2xl font-bold mt-4 text-green-700">Forgot Password</Text>
            <Text className="text-gray-600 mt-2 text-center">
              Enter your email address and we'll send you instructions to reset your password
            </Text>
          </View>

          {error && (
            <View className="bg-red-100 p-3 rounded-lg mb-4">
              <Text className="text-red-700">{error}</Text>
            </View>
          )}

          <View className="space-y-4">
            <Input
              label="Email"
              value={email}
              onChangeText={(text) => {
                setEmail(text)
                if (emailError) setEmailError("")
              }}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
            />

            <Button
              title={loading ? "Sending..." : "Reset Password"}
              onPress={handleResetPassword}
              disabled={loading}
            />
          </View>

          {loading && <LoadingSpinner />}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
