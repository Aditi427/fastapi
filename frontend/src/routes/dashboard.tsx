import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  Spinner,
  Center,
} from "@chakra-ui/react"

import AppLayout from "@/components/layout/AppLayout"
import ExpenseTable from "@/components/expenses/ExpenseTable"
import StatsCard from "@/components/expenses/StatsCard"
import { expenseService, type DashboardStats } from "@/services/expenseService"

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
})

function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const data = await expenseService.getDashboardStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to load dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

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
            size="2xl"
            color={{
              base: "white",
              _light: "#6D28D9",
            }}
          >
            Financial Overview
          </Heading>

          <Text
            mt={2}
            fontSize="lg"
            color={{
              base: "gray.400",
              _light: "#8B5CF6",
            }}
          >
            Manage your money smarter and visually.
          </Text>
        </Box>

        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
          <StatsCard 
            title="Total Expenses" 
            value={`₹${stats?.total_expenses?.toFixed(2) || "0"}`} 
          />
          <StatsCard 
            title="Total Income" 
            value={`₹${stats?.total_income?.toFixed(2) || "0"}`} 
          />
          <StatsCard 
            title="Savings" 
            value={`₹${stats?.savings?.toFixed(2) || "0"}`}
          />
        </Grid>

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
          <GridItem>
            <ExpenseTable />
          </GridItem>

          <GridItem>
            <Box
              h="100%"
              rounded="3xl"
              p={8}
              bgGradient="linear(to-br, #8B5CF6, #C084FC)"
              color={{
                base: "white",
                _light: "#4C1D95",  // Dark purple for light mode
              }}
            >
              <Heading 
                size="md"
                color={{
                  base: "white",
                  _light: "#4C1D95",
                }}
              >
                Monthly Insight
              </Heading>

              <Text 
                mt={4} 
                lineHeight="tall"
                color={{
                  base: "white",
                  _light: "#4C1D95",
                }}
              >
                {stats?.total_expenses && stats?.total_income
                  ? stats.total_expenses > stats.total_income
                    ? "⚠️ Your expenses exceed your income. Consider reducing spending."
                    : "✅ Great job! You're spending within your means."
                  : "Start adding expenses to see insights."}
              </Text>
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </AppLayout>
  )
}