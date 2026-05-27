import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import {
  Box,
  Grid,
  Heading,
  Text,
  VStack,
  Spinner,
  Center,
} from "@chakra-ui/react"

import AppLayout from "@/components/layout/AppLayout"
import { expenseService, type Expense } from "@/services/expenseService"

export const Route = createFileRoute("/analytics")({
  component: Analytics,
})

function Analytics() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState<string>("")

  useEffect(() => {
    loadExpenses()
  }, [])

  const loadExpenses = async () => {
    try {
      const response = await expenseService.getExpenses()
      const expensesData = response.data || response
      setExpenses(Array.isArray(expensesData) ? expensesData : [])
      
      if (expensesData.length > 0 && !selectedMonth) {
        const latestMonth = expensesData[0].expense_date.slice(0, 7)
        setSelectedMonth(latestMonth)
      }
    } catch (err) {
      console.error('Failed to load expenses:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredExpenses = expenses.filter((expense) => {
    const expenseMonth = expense.expense_date.slice(0, 7)
    return expenseMonth === selectedMonth
  })

  // Group expenses by category for summary
  const categoryTotals = new Map<string, number>()
  filteredExpenses.forEach((expense) => {
    const categoryName = expense.category?.name || "Uncategorized"
    categoryTotals.set(categoryName, (categoryTotals.get(categoryName) || 0) + expense.amount)
  })

  const months = [...new Set(expenses.map(e => e.expense_date.slice(0, 7)))]

  if (loading) {
    return (
      <AppLayout>
        <Center h="50vh">
          <Spinner size="xl" color="#8B5CF6" />
        </Center>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <VStack align="stretch" gap={8}>
        <Box>
          <Heading
            color={{
              base: "white",
              _light: "#6D28D9",
            }}
          >
            Expense Analytics
          </Heading>
          <Text mt={2} color={{ base: "gray.400", _light: "#8B5CF6" }}>
            Visualize your spending patterns.
          </Text>
        </Box>

        {/* Month Selector - using native select */}
        {months.length > 0 && (
          <Box>
            <Text mb={2} color="gray.400">Select Month</Text>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              style={{
                backgroundColor: "#242429",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                width: "250px",
                cursor: "pointer",
              }}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {new Date(month + "-01").toLocaleDateString("default", { 
                    year: "numeric", 
                    month: "long" 
                  })}
                </option>
              ))}
            </select>
          </Box>
        )}

        <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
          {/* Category Breakdown */}
          <Box
            p={6}
            rounded="3xl"
            bg={{ base: "#151518", _light: "white" }}
            border="1px solid"
            borderColor={{ base: "gray.800", _light: "#E9DDFC" }}
          >
            <Heading size="md" mb={4} color={{ base: "white", _light: "#6D28D9" }}>
              Category Breakdown
            </Heading>
            {categoryTotals.size > 0 ? (
              <VStack align="stretch" gap={3}>
                {Array.from(categoryTotals.entries()).map(([category, total]) => {
                  const totalAmount = filteredExpenses.reduce((s, e) => s + e.amount, 0)
                  const percentage = totalAmount > 0 ? (total / totalAmount) * 100 : 0
                  return (
                    <Box key={category}>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Text color="gray.300">{category}</Text>
                        <Text fontWeight="bold" color="#F59E0B">₹{total.toFixed(2)}</Text>
                      </Box>
                      <Box
                        h="8px"
                        bg="#2A2A2F"
                        rounded="full"
                        overflow="hidden"
                      >
                        <Box
                          h="100%"
                          w={`${percentage}%`}
                          bg="#8B5CF6"
                          rounded="full"
                        />
                      </Box>
                    </Box>
                  )
                })}
              </VStack>
            ) : (
              <Text color="gray.400">No data for selected month</Text>
            )}
          </Box>

          {/* Summary Stats */}
          <Box
            p={6}
            rounded="3xl"
            bg={{ base: "#151518", _light: "white" }}
            border="1px solid"
            borderColor={{ base: "gray.800", _light: "#E9DDFC" }}
          >
            <Heading size="md" mb={4} color={{ base: "white", _light: "#6D28D9" }}>
              Monthly Summary
            </Heading>
            <Grid templateColumns="1fr 1fr" gap={4}>
              <Box textAlign="center">
                <Text color="gray.400" fontSize="sm">Total Expenses</Text>
                <Text fontSize="2xl" fontWeight="bold" color="#F59E0B">
                  ₹{filteredExpenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                </Text>
              </Box>
              <Box textAlign="center">
                <Text color="gray.400" fontSize="sm">Transactions</Text>
                <Text fontSize="2xl" fontWeight="bold" color="#8B5CF6">
                  {filteredExpenses.length}
                </Text>
              </Box>
              <Box textAlign="center">
                <Text color="gray.400" fontSize="sm">Average Expense</Text>
                <Text fontSize="2xl" fontWeight="bold" color="#C084FC">
                  ₹{filteredExpenses.length > 0 
                    ? (filteredExpenses.reduce((sum, e) => sum + e.amount, 0) / filteredExpenses.length).toFixed(2)
                    : "0.00"}
                </Text>
              </Box>
              <Box textAlign="center">
                <Text color="gray.400" fontSize="sm">Categories Used</Text>
                <Text fontSize="2xl" fontWeight="bold" color="#A855F7">
                  {categoryTotals.size}
                </Text>
              </Box>
            </Grid>
          </Box>
        </Grid>
      </VStack>
    </AppLayout>
  )
}