import { Stack } from "expo-router"

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="ProductDetails" />
      <Stack.Screen name="AddProduct" />
      <Stack.Screen name="Search" />
    </Stack>
  )
}
