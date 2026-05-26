import { Button, Input, Textarea, VStack } from "@chakra-ui/react"

export default function ExpenseForm() {
  return (
    <VStack
      bg="white"
      p={6}
      rounded="xl"
      shadow="sm"
      gap={4}
      align="stretch"
    >
      <Input placeholder="Amount" type="number" />

      <Input placeholder="Category" />

      <Textarea placeholder="Description" />

      <Button bg="ui.main" color="white">
        Add Expense
      </Button>
    </VStack>
  )
}