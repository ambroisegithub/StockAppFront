"use client"
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native"
import { useRouter } from "expo-router"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../../redux/slices/authSlice"
import type { AppDispatch, RootState } from "../../../redux/store"
import Header from "../../../components/Header"
import { Ionicons } from "@expo/vector-icons"

export default function Profile() {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          dispatch(logout())
          router.replace("/(auth)/Login")
        },
      },
    ])
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Header title="Profile" showBackButton={false} />

      <ScrollView className="flex-1">
        <View className="p-4">
          <View className="bg-white rounded-lg p-6 shadow-sm items-center">
            <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-4">
              <Text className="text-2xl font-bold text-green-700">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </Text>
            </View>

            <Text className="text-xl font-bold">
              {user?.firstName} {user?.lastName}
            </Text>
            <Text className="text-gray-600 mt-1">{user?.role}</Text>
            <Text className="text-gray-600 mt-1">{user?.email}</Text>
          </View>

          <View className="mt-6 bg-white rounded-lg shadow-sm">
            <TouchableOpacity
              className="flex-row items-center justify-between p-4 border-b border-gray-100"
              onPress={() => router.push("/(dashboard)/(profile)/EditProfile")}
            >
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={24} color="#2ECC71" />
                <Text className="ml-3 text-gray-800 font-medium">Edit Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-between p-4 border-b border-gray-100"
              onPress={() => router.push("/(dashboard)/(profile)/ChangePassword")}
            >
              <View className="flex-row items-center">
                <Ionicons name="lock-closed-outline" size={24} color="#2ECC71" />
                <Text className="ml-3 text-gray-800 font-medium">Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between p-4" onPress={handleLogout}>
              <View className="flex-row items-center">
                <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                <Text className="ml-3 text-red-500 font-medium">Logout</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View className="mt-6 items-center">
            <Text className="text-gray-500 text-sm">StockTrack v1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
