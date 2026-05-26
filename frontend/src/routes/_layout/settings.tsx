import {
  Box,
  Button,
  Grid,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"

export default function FinanceSettings() {
  return (
    <Box
      mt={6}
      bg="#151518"
      p={10}
      rounded="3xl"
      border="1px solid #2A2A2F"
      shadow="2xl"
    >
      <Text
        fontSize="3xl"
        fontWeight="bold"
        mb={2}
        bgGradient="linear(to-r, #8B5CF6, #C084FC)"
        bgClip="text"
      >
        Financial Settings
      </Text>

      <Text
        mb={10}
        color="gray.400"
      >
        Set your income and monthly spending budget.
      </Text>

      <Grid
        templateColumns={{
          base: "1fr",
          md: "1fr 1fr",
        }}
        gap={8}
      >
        <VStack align="stretch">
          <Text
            color="gray.300"
            fontWeight="semibold"
          >
            Monthly Income
          </Text>

          <Input
            placeholder="Enter monthly income"
            type="number"
            size="lg"
            bg="#242429"
            color="white"
            border="1px solid #3A3A40"
            rounded="2xl"
            _placeholder={{
              color: "gray.500",
            }}
            _focusVisible={{
              borderColor: "#8B5CF6",
              boxShadow: "0 0 0 1px #8B5CF6",
            }}
          />
        </VStack>

        <VStack align="stretch">
          <Text
            color="gray.300"
            fontWeight="semibold"
          >
            Monthly Budget
          </Text>

          <Input
            placeholder="Enter monthly budget"
            type="number"
            size="lg"
            bg="#242429"
            color="white"
            border="1px solid #3A3A40"
            rounded="2xl"
            _placeholder={{
              color: "gray.500",
            }}
            _focusVisible={{
              borderColor: "#8B5CF6",
              boxShadow: "0 0 0 1px #8B5CF6",
            }}
          />
        </VStack>
      </Grid>

      <Button
        mt={10}
        size="lg"
        bg="#8B5CF6"
        color="white"
        rounded="2xl"
        _hover={{
          bg: "#7C3AED",
        }}
      >
        Save Settings
      </Button>
    </Box>
  )
}