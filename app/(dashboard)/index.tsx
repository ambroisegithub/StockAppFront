"use client"

import { useEffect } from "react"
import { View, Text } from "react-native"
import { useRouter } from "expo-router"

export default function DashboardIndex() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home screen
    router.replace("/(dashboard)/(home)")
  }, [])

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Redirecting...</Text>
    </View>
  )
}
