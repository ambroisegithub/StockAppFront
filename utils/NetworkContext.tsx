"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext, type ReactNode } from "react"
import NetInfo from "@react-native-community/netinfo"

interface NetworkContextType {
  isConnected: boolean
}

const NetworkContext = createContext<NetworkContextType>({ isConnected: true })

export const useNetwork = () => useContext(NetworkContext)

interface NetworkProviderProps {
  children: ReactNode
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected !== null ? state.isConnected : true)
    })

    // Check initial connection state
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected !== null ? state.isConnected : true)
    })

    // Cleanup
    return () => {
      unsubscribe()
    }
  }, [])

  return <NetworkContext.Provider value={{ isConnected }}>{children}</NetworkContext.Provider>
}
