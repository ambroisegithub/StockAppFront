import AsyncStorage from "@react-native-async-storage/async-storage"
import { STORAGE_KEYS } from "./constants"
import api from "./api"
import NetInfo from "@react-native-community/netinfo"

interface OfflineAction {
  type: string
  payload: any
  timestamp: string
}

// Save an action to be performed when back online
export const saveOfflineAction = async (action: OfflineAction): Promise<void> => {
  try {
    // Get existing offline actions
    const actionsJson = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_ACTIONS)
    const actions: OfflineAction[] = actionsJson ? JSON.parse(actionsJson) : []

    // Add new action
    actions.push(action)

    // Save updated actions
    await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_ACTIONS, JSON.stringify(actions))

    console.log("Offline action saved:", action)
  } catch (error) {
    console.error("Error saving offline action:", error)
  }
}

// Sync offline data when back online
export const syncOfflineData = async (): Promise<void> => {
  try {
    // Check if we're online
    const netInfo = await NetInfo.fetch()
    if (!netInfo.isConnected) {
      console.log("Cannot sync: Device is offline")
      return
    }

    // Get offline actions
    const actionsJson = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_ACTIONS)
    if (!actionsJson) {
      console.log("No offline actions to sync")
      return
    }

    const actions: OfflineAction[] = JSON.parse(actionsJson)
    console.log(`Found ${actions.length} offline actions to sync`)

    // Process each action
    const failedActions: OfflineAction[] = []

    for (const action of actions) {
      try {
        switch (action.type) {
          case "CREATE_PRODUCT":
            await api.post("/api/products", action.payload)
            break

          case "UPDATE_STOCK":
            await api.post(`/api/products/${action.payload.productId}/stock`, action.payload)
            break

          case "RECORD_SALE":
            await api.post("/api/employee/sell-product", action.payload)
            break

          default:
            console.warn("Unknown offline action type:", action.type)
            failedActions.push(action)
        }

        console.log(`Successfully synced action: ${action.type}`)
      } catch (error) {
        console.error(`Failed to sync action ${action.type}:`, error)
        failedActions.push(action)
      }
    }

    // Save any failed actions back to storage
    if (failedActions.length > 0) {
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_ACTIONS, JSON.stringify(failedActions))
      console.log(`${failedActions.length} actions failed to sync and were saved for later`)
    } else {
      // Clear offline actions if all succeeded
      await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_ACTIONS)
      console.log("All offline actions synced successfully")
    }
  } catch (error) {
    console.error("Error syncing offline data:", error)
  }
}

// Check if there are pending offline actions
export const hasPendingOfflineActions = async (): Promise<boolean> => {
  try {
    const actionsJson = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_ACTIONS)
    const actions = actionsJson ? JSON.parse(actionsJson) : []
    return actions.length > 0
  } catch (error) {
    console.error("Error checking offline actions:", error)
    return false
  }
}
