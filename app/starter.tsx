"use client"

import { useEffect } from "react"
import { View, Text, Image } from "react-native"
import { useRouter } from "expo-router"
import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { ActivityIndicator } from "react-native"

export default function Starter() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // Check authentication status and redirect accordingly
    const checkAuthAndRedirect = async () => {
      if (!isLoading) {
        if (isAuthenticated) {
          router.replace("/(dashboard)")
        } else {
          router.replace("/(auth)/Login")
        }
      }
    }

    checkAuthAndRedirect()
  }, [isAuthenticated, isLoading, router])

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image source={require("../assets/images/logo.png")} className="w-40 h-40 mb-8" resizeMode="contain" />
      <Text className="text-2xl font-bold mb-4 text-green-700">StockTrack</Text>
      <Text className="text-gray-600 mb-8">Inventory Management System</Text>
      <ActivityIndicator size="large" color="#2ECC71" />
    </View>
  )
}
