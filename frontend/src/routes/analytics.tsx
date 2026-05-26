import { createFileRoute } from "@tanstack/react-router"

import {
  Box,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react"

import AppLayout from "@/components/layout/AppLayout"

export const Route = createFileRoute("/analytics")({
  component: Analytics,
})

function Analytics() {
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

          <Text
            mt={2}
            color={{
              base: "gray.400",
              _light: "#8B5CF6",
            }}
          >
            Visualize your spending patterns.
          </Text>
        </Box>

        <Grid templateColumns="1fr 1fr" gap={6}>
          <Box
            h="350px"
            rounded="3xl"
            bg={{
              base: "#151518",
              _light: "white",
            }}
            border="1px solid"
            borderColor={{
              base: "gray.800",
              _light: "#E9DDFC",
            }}
            p={8}
          >
            <Heading
              size="md"
              color={{
                base: "white",
                _light: "#6D28D9",
              }}
            >
              Category Distribution
            </Heading>
          </Box>

          <Box
            h="350px"
            rounded="3xl"
            bg={{
              base: "#151518",
              _light: "white",
            }}
            border="1px solid"
            borderColor={{
              base: "gray.800",
              _light: "#E9DDFC",
            }}
            p={8}
          >
            <Heading
              size="md"
              color={{
                base: "white",
                _light: "#6D28D9",
              }}
            >
              Monthly Spending
            </Heading>
          </Box>
        </Grid>
      </VStack>
    </AppLayout>
  )
}