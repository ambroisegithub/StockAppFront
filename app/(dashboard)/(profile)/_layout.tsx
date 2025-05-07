import { Stack } from "expo-router"

export default function ProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="EditProfile" />
      <Stack.Screen name="ChangePassword" />
    </Stack>
  )
}
