import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react"

import { FiBell, FiMoon, FiSearch, FiSun } from "react-icons/fi"

import { useTheme } from "next-themes"

export default function Navbar() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <Flex
      px={8}
      py={6}
      justify="space-between"
      align="center"
      bg={{
        base: "#0F0F10",
        _light: "#F8F5FF",
      }}
      borderBottom="1px solid"
      borderColor={{
        base: "gray.800",
        _light: "#E9DDFC",
      }}
    >
      <Box>
        <Text
          fontSize="3xl"
          fontWeight="extrabold"
          color={{
            base: "white",
            _light: "#6D28D9",
          }}
        >
          Dashboard
        </Text>

        <Text
          mt={1}
          color={{
            base: "gray.400",
            _light: "#8B5CF6",
          }}
        >
          Track your finances beautifully
        </Text>
      </Box>

      <HStack gap={4}>
        <HStack
          px={4}
          py={2}
          rounded="full"
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
          <FiSearch color="#8B5CF6" />

          <Input
            placeholder="Search..."
            border="none"
            _focus={{ border: "none" }}
            color={{
              base: "white",
              _light: "#4C1D95",
            }}
          />
        </HStack>

        <IconButton
          aria-label="Notifications"
          rounded="full"
          bg={{
            base: "#242429",
            _light: "#EDE9FE",
          }}
          color="#8B5CF6"
          _hover={{
            bg: {
              base: "#2F2F35",
              _light: "#DDD6FE",
            },
          }}
        >
          <FiBell />
        </IconButton>

        <IconButton
          aria-label="Toggle Theme"
          rounded="full"
          bg={{
            base: "#242429",
            _light: "#EDE9FE",
          }}
          color="#8B5CF6"
          _hover={{
            bg: {
              base: "#2F2F35",
              _light: "#DDD6FE",
            },
          }}
          onClick={toggleTheme}
        >
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </IconButton>

        <Avatar.Root>
          <Avatar.Fallback name="Aditi" />
        </Avatar.Root>
      </HStack>
    </Flex>
  )
}