import type React from "react"
import { View, ActivityIndicator, Text } from "react-native"

interface LoadingSpinnerProps {
  size?: "small" | "large"
  color?: string
  text?: string
  fullScreen?: boolean
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "large",
  color = "#2ECC71",
  text = "Loading...",
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <View className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        <ActivityIndicator size={size} color={color} />
        {text && <Text className="mt-2 text-gray-600">{text}</Text>}
      </View>
    )
  }

  return (
    <View className="py-4 items-center justify-center">
      <ActivityIndicator size={size} color={color} />
      {text && <Text className="mt-2 text-gray-600">{text}</Text>}
    </View>
  )
}

export default LoadingSpinner
