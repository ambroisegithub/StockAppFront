"use client"

import { useState } from "react"
import { View, Text, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import { useRouter } from "expo-router"
import { useDispatch, useSelector } from "react-redux"
import { loginUser } from "../../redux/slices/authSlice"
import type { AppDispatch, RootState } from "../../redux/store"
import Input from "../../components/Input"
import Button from "../../components/Button"
import LoadingSpinner from "../../components/LoadingSpinner"

export default function Login() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.auth)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({ username: "", password: "" })

  const validate = () => {
    let isValid = true
    const newErrors = { username: "", password: "" }

    if (!username.trim()) {
      newErrors.username = "Username is required"
      isValid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleLogin = async () => {
    if (!validate()) return

    try {
      await dispatch(loginUser({ username, password })).unwrap()
      // Navigation is handled in the auth slice after successful login
    } catch (error) {
      // Error is already handled in the auth slice
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 p-6 bg-white">
          <View className="items-center mt-10 mb-8">
            <Image source={require("../../assets/images/logo.png")} className="w-32 h-32" resizeMode="contain" />
            <Text className="text-2xl font-bold mt-4 text-green-700">StockTrack</Text>
            <Text className="text-gray-600 mt-2">Sign in to your account</Text>
          </View>

          {error && (
            <View className="bg-red-100 p-3 rounded-lg mb-4">
              <Text className="text-red-700">{error}</Text>
            </View>
          )}

          <View className="space-y-4">
            <Input
              label="Username"
              value={username}
              onChangeText={setUsername}
              placeholder="Enter your username"
              error={errors.username}
              autoCapitalize="none"
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              error={errors.password}
            />

            <TouchableOpacity onPress={() => router.push("/ForgotPassword")} className="self-end">
              <Text className="text-green-700">Forgot Password?</Text>
            </TouchableOpacity>

            <Button title={loading ? "Signing in..." : "Sign In"} onPress={handleLogin} disabled={loading} />
          </View>

          {loading && <LoadingSpinner />}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
