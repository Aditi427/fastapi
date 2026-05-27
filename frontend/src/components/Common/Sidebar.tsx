import { Box, Flex, Grid, Text, VStack, Spinner } from "@chakra-ui/react"
import { Link, useRouterState } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import {
  FiBarChart2,
  FiCreditCard,
  FiDollarSign,
  FiHome,
  FiSettings,
} from "react-icons/fi"

import { expenseService } from "@/services/expenseService"

const links = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: FiHome,
  },
  {
    label: "Analytics",
    to: "/analytics",
    icon: FiBarChart2,
  },
  {
    label: "Add Expense",
    to: "/add-expense",
    icon: FiDollarSign,
  },
  {
    label: "Income & Budget",
    to: "/change-income-budget",
    icon: FiSettings,
  },
]

export default function Sidebar() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    savings: 0,
    budget: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const dashboardData = await expenseService.getDashboardStats()
      const userData = await expenseService.getUserProfile()
      
      setStats({
        totalIncome: dashboardData.total_income,
        totalExpenses: dashboardData.total_expenses,
        savings: dashboardData.savings,
        budget: userData.budget || 0,
      })
    } catch (error) {
      console.error('Failed to load sidebar stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box
        w="310px"
        minH="100vh"
        px={6}
        py={8}
        bg={{
          base: "#0F0F10",
          _light: "#F8F5FF",
        }}
        borderRight="1px solid"
        borderColor={{
          base: "gray.800",
          _light: "#E9DDFC",
        }}
      >
        <Flex justify="center" align="center" h="100%">
          <Spinner color="#8B5CF6" />
        </Flex>
      </Box>
    )
  }

  return (
    <Box
      w="310px"
      minH="100vh"
      px={6}
      py={8}
      bg={{
        base: "#0F0F10",
        _light: "#F8F5FF",
      }}
      borderRight="1px solid"
      borderColor={{
        base: "gray.800",
        _light: "#E9DDFC",
      }}
    >
      <Text
        fontSize="3xl"
        fontWeight="extrabold"
        color={{
          base: "white",
          _light: "#7C3AED",
        }}
        mb={10}
      >
        ExpenseTracker
      </Text>

      <Grid templateColumns="1fr 1fr" gap={4} mb={10}>
        <StatBox 
          label="Income" 
          value={`₹${stats.totalIncome.toFixed(0)}`} 
        />
        <StatBox 
          label="Expenses" 
          value={`₹${stats.totalExpenses.toFixed(0)}`} 
        />
        <StatBox 
          label="Savings" 
          value={`₹${stats.savings.toFixed(0)}`}
          color={stats.savings >= 0 ? "green.400" : "red.400"}
        />
        <StatBox 
          label="Budget" 
          value={`₹${stats.budget.toFixed(0)}`} 
        />
      </Grid>

      <VStack align="stretch" gap={3}>
        {links.map((link) => {
          const active = pathname === link.to

          return (
            <Link key={link.to} to={link.to}>
              <Flex
                align="center"
                gap={4}
                p={4}
                rounded="2xl"
                bg={
                  active
                    ? {
                        base: "#252529",
                        _light: "#EDE9FE",
                      }
                    : "transparent"
                }
                transition="0.3s"
                _hover={{
                  transform: "translateX(5px)",
                  bg: {
                    base: "#1A1A1D",
                    _light: "#F3E8FF",
                  },
                }}
              >
                <link.icon
                  size={20}
                  color={active ? "#8B5CF6" : "#9CA3AF"}
                />

                <Text
                  fontWeight="semibold"
                  color={{
                    base: "white",
                    _light: "#4C1D95",
                  }}
                >
                  {link.label}
                </Text>
              </Flex>
            </Link>
          )
        })}
      </VStack>
    </Box>
  )
}

// Helper component for stat boxes
function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <Box
      p={4}
      rounded="2xl"
      bg={{
        base: "#1A1A1D",
        _light: "white",
      }}
      border="1px solid"
      borderColor={{
        base: "gray.700",
        _light: "#E9DDFC",
      }}
    >
      <Text
        color={{
          base: "gray.400",
          _light: "#8B5CF6",
        }}
        fontSize="sm"
      >
        {label}
      </Text>

      <Text
        mt={2}
        fontWeight="bold"
        color={color || {
          base: "white",
          _light: "#4C1D95",
        }}
      >
        {value}
      </Text>
    </Box>
  )
}