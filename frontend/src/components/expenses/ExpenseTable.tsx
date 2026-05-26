import { Box, HStack, Table, Text } from "@chakra-ui/react"

const expenses = [
  {
    amount: "₹450",
    category: "Food",
    date: "2026-05-26",
  },
  {
    amount: "₹1200",
    category: "Travel",
    date: "2026-05-25",
  },
  {
    amount: "₹800",
    category: "Shopping",
    date: "2026-05-24",
  },
]

export default function ExpenseTable() {
  return (
    <Box
      bg={{
        base: "#151518",
        _light: "white",
      }}
      rounded="3xl"
      overflow="hidden"
      border="1px solid"
      borderColor={{
        base: "gray.800",
        _light: "#E9DDFC",
      }}
    >
      <Table.Root size="lg">
        <Table.Header>
          <Table.Row
            bg={{
              base: "#1F1F24",
              _light: "#F3E8FF",
            }}
          >
            <Table.ColumnHeader>Amount</Table.ColumnHeader>
            <Table.ColumnHeader>Category</Table.ColumnHeader>
            <Table.ColumnHeader>Date</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {expenses.map((expense, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Text
                  color={{
                    base: "white",
                    _light: "#4C1D95",
                  }}
                >
                  {expense.amount}
                </Text>
              </Table.Cell>

              <Table.Cell>
                <HStack>
                  <Box
                    w="10px"
                    h="10px"
                    rounded="full"
                    bg="#8B5CF6"
                  />
                  <Text
                    color={{
                      base: "gray.300",
                      _light: "#6D28D9",
                    }}
                  >
                    {expense.category}
                  </Text>
                </HStack>
              </Table.Cell>

              <Table.Cell>
                <Text
                  color={{
                    base: "gray.400",
                    _light: "#7C3AED",
                  }}
                >
                  {expense.date}
                </Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  )
}