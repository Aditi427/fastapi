import { createFileRoute } from "@tanstack/react-router"
import { Heading, VStack } from "@chakra-ui/react"

import AppLayout from "@/components/layout/AppLayout"
import ExpenseTable from "@/components/expenses/ExpenseTable"

export const Route = createFileRoute("/expenses")({
  component: Expenses,
})

function Expenses() {
  return (
    <AppLayout>
      <VStack align="stretch" gap={6}>
        <Heading size="lg">Expenses</Heading>

        <ExpenseTable />
      </VStack>
    </AppLayout>
  )
}