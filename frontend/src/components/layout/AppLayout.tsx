import { Box, Flex } from "@chakra-ui/react"

import Sidebar from "@/components/Common/Sidebar"
import Navbar from "@/components/Common/Navbar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Flex
      minH="100vh"
      bg={{
        base: "#0A0A0B",
        _light: "#F6F0FF",
      }}
    >
      <Sidebar />

      <Box flex="1">
        <Navbar />

        <Box p={8}>{children}</Box>
      </Box>
    </Flex>
  )
}