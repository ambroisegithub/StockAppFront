import type React from "react"
import { TouchableOpacity, Text, ActivityIndicator } from "react-native"

interface ButtonProps {
  title: string
  onPress: () => void
  disabled?: boolean
  variant?: "primary" | "secondary" | "outline" | "danger"
  size?: "small" | "medium" | "large"
  loading?: boolean
  fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  variant = "primary",
  size = "medium",
  loading = false,
  fullWidth = true,
}) => {
  const getButtonStyle = () => {
    let baseStyle = "rounded-lg"

    // Size
    if (size === "small") baseStyle += " py-1 px-3"
    else if (size === "medium") baseStyle += " py-3 px-4"
    else if (size === "large") baseStyle += " py-4 px-6"

    // Width
    if (fullWidth) baseStyle += " w-full"

    // Variant
    if (variant === "primary") {
      baseStyle += " bg-green-500"
      if (disabled) baseStyle += " bg-green-300"
    } else if (variant === "secondary") {
      baseStyle += " bg-blue-500"
      if (disabled) baseStyle += " bg-blue-300"
    } else if (variant === "outline") {
      baseStyle += " bg-transparent border border-green-500"
      if (disabled) baseStyle += " border-green-300"
    } else if (variant === "danger") {
      baseStyle += " bg-red-500"
      if (disabled) baseStyle += " bg-red-300"
    }

    return baseStyle
  }

  const getTextStyle = () => {
    let baseStyle = "font-medium text-center"

    // Size
    if (size === "small") baseStyle += " text-sm"
    else if (size === "medium") baseStyle += " text-base"
    else if (size === "large") baseStyle += " text-lg"

    // Variant
    if (variant === "primary" || variant === "secondary" || variant === "danger") {
      baseStyle += " text-white"
    } else if (variant === "outline") {
      baseStyle += " text-green-500"
      if (disabled) baseStyle += " text-green-300"
    }

    return baseStyle
  }

  return (
    <TouchableOpacity className={getButtonStyle()} onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#2ECC71" : "#FFFFFF"} size="small" />
      ) : (
        <Text className={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

export default Button
