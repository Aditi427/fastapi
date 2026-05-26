import { Box, Flex, Heading, Text } from "@chakra-ui/react"

import { FiTrendingUp } from "react-icons/fi"

interface Props {
  title: string
  value: string
}

export default function StatsCard({ title, value }: Props) {
  return (
    <Box
      bg={{
        base: "#151518",
        _light: "white",
      }}
      p={8}
      rounded="3xl"
      border="1px solid"
      borderColor={{
        base: "gray.800",
        _light: "#E9DDFC",
      }}
      shadow="lg"
      transition="0.3s"
      _hover={{
        transform: "translateY(-6px)",
      }}
    >
      <Flex justify="space-between" align="center">
        <Box>
          <Text
            color={{
              base: "gray.400",
              _light: "#8B5CF6",
            }}
            fontSize="sm"
          >
            {title}
          </Text>

          <Heading
            mt={3}
            size="xl"
            color={{
              base: "white",
              _light: "#4C1D95",
            }}
          >
            {value}
          </Heading>
        </Box>

        <Box
          p={4}
          rounded="2xl"
          bg={{
            base: "#242429",
            _light: "#F3E8FF",
          }}
        >
          <FiTrendingUp color="#8B5CF6" size={24} />
        </Box>
      </Flex>
    </Box>
  )
}