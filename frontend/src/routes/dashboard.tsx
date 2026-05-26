import { createFileRoute } from "@tanstack/react-router"

import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react"

import AppLayout from "@/components/layout/AppLayout"
import ExpenseTable from "@/components/expenses/ExpenseTable"
import StatsCard from "@/components/expenses/StatsCard"

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
})

function Dashboard() {
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

        <Grid templateColumns="repeat(3,1fr)" gap={6}>
          <StatsCard title="Total Spent" value="₹12,500" />
          <StatsCard title="Transactions" value="48" />
          <StatsCard title="Top Category" value="Food" />
        </Grid>

        <Grid templateColumns="2fr 1fr" gap={6}>
          <GridItem>
            <ExpenseTable />
          </GridItem>

          <GridItem>
            <Box
              h="100%"
              rounded="3xl"
              p={8}
              bgGradient="linear(to-br, #8B5CF6, #C084FC)"
              color="white"
            >
              <Heading size="md">Monthly Insight</Heading>

              <Text mt={4} lineHeight="tall">
                Your expenses have decreased by 20% this month.
                Keep maintaining your spending habits.
              </Text>
            </Box>
          </GridItem>
        </Grid>
      </VStack>
    </AppLayout>
  )
}