import { createFileRoute } from "@tanstack/react-router"

import {
  Box,
  Button,
  Grid,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"

import AppLayout from "@/components/layout/AppLayout"

export const Route = createFileRoute("/add-expense")({
  component: AddExpense,
})

function AddExpense() {
  return (
    <AppLayout>
      <Box
        maxW="900px"
        mx="auto"
        bg={{
          base: "#151518",
          _light: "white",
        }}
        p={10}
        rounded="3xl"
        border="1px solid"
        borderColor={{
          base: "gray.800",
          _light: "#E9DDFC",
        }}
      >
        <Heading
          mb={8}
          color={{
            base: "white",
            _light: "#6D28D9",
          }}
        >
          Add Expense
        </Heading>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          {/* Expense Title */}
          <VStack align="stretch">
            <Text
              color={{
                base: "gray.300",
                _light: "#7C3AED",
              }}
            >
              Expense Title
            </Text>

            <Input
              placeholder="Enter expense title"
              bg={{
                base: "#242429",
                _light: "#F5F3FF",
              }}
              border="none"
              color={{
                base: "white",
                _light: "#4C1D95",
              }}
              _placeholder={{
                color: "gray.500",
              }}
              _focusVisible={{
                borderColor: "#8B5CF6",
                boxShadow: "0 0 0 1px #8B5CF6",
              }}
            />
          </VStack>

          {/* Amount */}
          <VStack align="stretch">
            <Text
              color={{
                base: "gray.300",
                _light: "#7C3AED",
              }}
            >
              Amount
            </Text>

            <Input
              placeholder="₹ Amount"
              type="number"
              bg={{
                base: "#242429",
                _light: "#F5F3FF",
              }}
              border="none"
              color={{
                base: "white",
                _light: "#4C1D95",
              }}
              _placeholder={{
                color: "gray.500",
              }}
              _focusVisible={{
                borderColor: "#8B5CF6",
                boxShadow: "0 0 0 1px #8B5CF6",
              }}
            />
          </VStack>

          {/* Category */}
          <VStack align="stretch">
            <Text
              color={{
                base: "gray.300",
                _light: "#7C3AED",
              }}
            >
              Category
            </Text>

            <Box
              as="select"
              bg={{
                base: "#242429",
                _light: "#F5F3FF",
              }}
              border="none"
              h="40px"
              px={4}
              rounded="md"
              color={{
                base: "white",
                _light: "#4C1D95",
              }}
              _focusVisible={{
                borderColor: "#8B5CF6",
                boxShadow: "0 0 0 1px #8B5CF6",
                outline: "none",
              }}
            >
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">Entertainment</option>
            </Box>
          </VStack>

          {/* Date */}
          <VStack align="stretch">
            <Text
              color={{
                base: "gray.300",
                _light: "#7C3AED",
              }}
            >
              Date
            </Text>

            <Input
              type="date"
              bg={{
                base: "#242429",
                _light: "#F5F3FF",
              }}
              border="none"
              color={{
                base: "white",
                _light: "#4C1D95",
              }}
              _focusVisible={{
                borderColor: "#8B5CF6",
                boxShadow: "0 0 0 1px #8B5CF6",
              }}
            />
          </VStack>
        </Grid>

        {/* Submit Button */}
        <Button
          mt={10}
          size="lg"
          bg="#8B5CF6"
          color="white"
          rounded="2xl"
          px={10}
          _hover={{
            bg: "#7C3AED",
            transform: "translateY(-2px)",
          }}
          transition="0.3s"
        >
          Add Expense
        </Button>
      </Box>
    </AppLayout>
  )
}

export default AddExpense