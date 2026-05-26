import { Box, Flex, Grid, Text, VStack } from "@chakra-ui/react"
import { Link, useRouterState } from "@tanstack/react-router"

import {
  FiBarChart2,
  FiCreditCard,
  FiDollarSign,
  FiHome,
  FiSettings,
} from "react-icons/fi"

const links = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: FiHome,
  },
  {
    label: "Expenses",
    to: "/expenses",
    icon: FiCreditCard,
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
            Balance
          </Text>

          <Text
            mt={2}
            fontWeight="bold"
            color={{
              base: "white",
              _light: "#4C1D95",
            }}
          >
            ₹24K
          </Text>
        </Box>

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
            Saved
          </Text>

          <Text
            mt={2}
            fontWeight="bold"
            color={{
              base: "white",
              _light: "#4C1D95",
            }}
          >
            ₹8K
          </Text>
        </Box>

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
            Expenses
          </Text>

          <Text
            mt={2}
            fontWeight="bold"
            color={{
              base: "white",
              _light: "#4C1D95",
            }}
          >
            48
          </Text>
        </Box>

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
            Budget
          </Text>

          <Text
            mt={2}
            fontWeight="bold"
            color={{
              base: "white",
              _light: "#4C1D95",
            }}
          >
            ₹30K
          </Text>
        </Box>
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