"use client"

import type React from "react"
import { View, Text, TouchableOpacity, StatusBar } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface HeaderProps {
  title: string
  showBackButton?: boolean
  rightComponent?: React.ReactNode
  onBackPress?: () => void
}

const Header: React.FC<HeaderProps> = ({ title, showBackButton = true, rightComponent, onBackPress }) => {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress()
    } else {
      router.back()
    }
  }

  return (
    <View className="bg-white border-b border-gray-200" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View className="flex-row items-center justify-between px-4 h-14">
        <View className="flex-row items-center">
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBackPress}
              className="mr-3"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#2ECC71" />
            </TouchableOpacity>
          )}
          <Text className="text-lg font-bold">{title}</Text>
        </View>

        {rightComponent && <View>{rightComponent}</View>}
      </View>
    </View>
  )
}

export default Header
