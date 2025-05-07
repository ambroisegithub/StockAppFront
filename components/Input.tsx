import type React from "react"
import { View, Text, TextInput, type TextInputProps } from "react-native"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  multiline,
  numberOfLines,
  ...rest
}) => {
  return (
    <View className="mb-2">
      {label && <Text className="text-gray-700 font-medium mb-1">{label}</Text>}

      <View
        className={`flex-row items-center border rounded-lg overflow-hidden ${
          error ? "border-red-500" : "border-gray-300"
        } ${multiline ? "h-24" : ""}`}
      >
        {leftIcon && <View className="pl-3">{leftIcon}</View>}

        <TextInput
          className={`flex-1 px-3 py-2 text-gray-800 ${leftIcon ? "pl-2" : ""} ${rightIcon ? "pr-2" : ""} ${
            multiline ? "h-full text-top" : ""
          }`}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          {...rest}
        />

        {rightIcon && <View className="pr-3">{rightIcon}</View>}
      </View>

      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  )
}

export default Input
