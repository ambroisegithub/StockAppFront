"use client"

import { useEffect } from "react"
import { Stack } from "expo-router"
import { useSelector, useDispatch } from "react-redux"
import { restoreAuth } from "../redux/slices/authSlice"
import type { RootState, AppDispatch } from "../redux/store"
import { useFonts } from "expo-font"
import { SplashScreen } from "expo-router"
import { StatusBar } from "expo-status-bar"

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth)

  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
  })

  useEffect(() => {
    // Restore authentication state from AsyncStorage
    dispatch(restoreAuth())
  }, [dispatch])

  useEffect(() => {
    // Hide the splash screen when fonts are loaded and auth state is determined
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, isLoading])

  if (!fontsLoaded || isLoading) {
    return null
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="starter" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
      </Stack>
    </>
  )
}
