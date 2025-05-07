"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { fetchReports } from "../../redux/slices/reportSlice"
import type { AppDispatch, RootState } from "../../redux/store"
import Header from "../../components/Header"
import LoadingSpinner from "../../components/LoadingSpinner"
import { Ionicons } from "@expo/vector-icons"

export default function Reports() {
  const dispatch = useDispatch<AppDispatch>()
  const { reports, loading, error } = useSelector((state: RootState) => state.reports)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("sales") // 'sales', 'inventory', 'profit'

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      await dispatch(fetchReports()).unwrap()
    } catch (error) {
      // Error is handled in the reports slice
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadReports()
    setRefreshing(false)
  }

  const renderSalesReport = () => {
    if (!reports?.salesReport) return <Text className="text-gray-500">No sales data available</Text>

    return (
      <View className="space-y-4">
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="text-lg font-semibold mb-2">Sales Summary</Text>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Total Sales:</Text>
            <Text className="font-medium">${reports.salesReport.totalSales.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Items Sold:</Text>
            <Text className="font-medium">{reports.salesReport.totalItemsSold}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Profit:</Text>
            <Text className="font-medium text-green-600">${reports.salesReport.totalProfit.toFixed(2)}</Text>
          </View>
        </View>

        <Text className="text-lg font-semibold mt-2">Recent Sales</Text>
        {reports.salesReport.recentSales?.map((sale, index) => (
          <View key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <View className="flex-row justify-between mb-1">
              <Text className="font-medium">{sale.product.name}</Text>
              <Text className="font-medium text-green-600">${sale.totalPrice.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Quantity: {sale.qtySold}</Text>
              <Text className="text-gray-600">{new Date(sale.salesDate).toLocaleDateString()}</Text>
            </View>
          </View>
        ))}
      </View>
    )
  }

  const renderInventoryReport = () => {
    if (!reports?.inventoryReport) return <Text className="text-gray-500">No inventory data available</Text>

    return (
      <View className="space-y-4">
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="text-lg font-semibold mb-2">Inventory Summary</Text>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Total Value:</Text>
            <Text className="font-medium">${reports.inventoryReport.totalInventoryValue.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Potential Profit:</Text>
            <Text className="font-medium text-green-600">
              ${reports.inventoryReport.totalPotentialProfit.toFixed(2)}
            </Text>
          </View>
        </View>

        <Text className="text-lg font-semibold mt-2">Inventory by Category</Text>
        {reports.inventoryReport.inventoryByType?.map((category, index) => (
          <View key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="font-medium mb-1">{category.productTypeName}</Text>
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">Items:</Text>
              <Text className="font-medium">{category.totalItems}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Value:</Text>
              <Text className="font-medium">${category.inventoryValue.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>
    )
  }

  const renderProfitReport = () => {
    if (!reports?.profitReport) return <Text className="text-gray-500">No profit data available</Text>

    return (
      <View className="space-y-4">
        <View className="bg-white rounded-lg p-4 shadow-sm">
          <Text className="text-lg font-semibold mb-2">Profit Summary</Text>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Total Sales:</Text>
            <Text className="font-medium">${reports.profitReport.totalSales.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-600">Total Profit:</Text>
            <Text className="font-medium text-green-600">${reports.profitReport.totalProfit.toFixed(2)}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Profit Margin:</Text>
            <Text className="font-medium">{reports.profitReport.profitMargin.toFixed(2)}%</Text>
          </View>
        </View>

        <Text className="text-lg font-semibold mt-2">Top Products by Profit</Text>
        {reports.profitReport.topProducts?.map((product, index) => (
          <View key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="font-medium mb-1">{product.name}</Text>
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">Sales:</Text>
              <Text className="font-medium">${product.totalSales.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Profit:</Text>
              <Text className="font-medium text-green-600">${product.totalProfit.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>
    )
  }

  return (
    <View className="flex-1 bg-gray-100">
      <Header title="Reports" showBackButton={false} />

      <View className="flex-row bg-white px-4 py-2 border-b border-gray-200">
        <TouchableOpacity
          className={`flex-1 items-center py-2 ${activeTab === "sales" ? "border-b-2 border-green-500" : ""}`}
          onPress={() => setActiveTab("sales")}
        >
          <Text className={activeTab === "sales" ? "text-green-600 font-medium" : "text-gray-600"}>Sales</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 items-center py-2 ${activeTab === "inventory" ? "border-b-2 border-green-500" : ""}`}
          onPress={() => setActiveTab("inventory")}
        >
          <Text className={activeTab === "inventory" ? "text-green-600 font-medium" : "text-gray-600"}>Inventory</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 items-center py-2 ${activeTab === "profit" ? "border-b-2 border-green-500" : ""}`}
          onPress={() => setActiveTab("profit")}
        >
          <Text className={activeTab === "profit" ? "text-green-600 font-medium" : "text-gray-600"}>Profit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 p-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {loading && !refreshing ? (
          <LoadingSpinner />
        ) : error ? (
          <View className="items-center justify-center p-4">
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text className="text-red-500 mt-2">{error}</Text>
            <TouchableOpacity className="mt-4 bg-green-500 px-4 py-2 rounded-lg" onPress={loadReports}>
              <Text className="text-white font-medium">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {activeTab === "sales" && renderSalesReport()}
            {activeTab === "inventory" && renderInventoryReport()}
            {activeTab === "profit" && renderProfitReport()}
          </>
        )}
      </ScrollView>
    </View>
  )
}
