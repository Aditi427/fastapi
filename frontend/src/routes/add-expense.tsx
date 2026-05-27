import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useState, useEffect } from "react"

import {
  Box,
  Button,
  Grid,
  Heading,
  Input,
  Text,
  VStack,
  Spinner,
} from "@chakra-ui/react"

import AppLayout from "@/components/layout/AppLayout"
import { expenseService, type Category } from "@/services/expenseService"

export const Route = createFileRoute("/add-expense")({
  component: AddExpense,
})

function AddExpense() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category_id: "",
    expense_date: new Date().toISOString().split('T')[0],
  })

  // Load categories on mount
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setLoadingCategories(true)
    try {
      const data = await expenseService.getCategories()
      console.log('Loaded categories:', data)
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load categories:', err)
      setCategories([])
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    // Validate category selected
    if (!formData.category_id) {
      setError("Please select a category")
      setLoading(false)
      return
    }

    try {
      await expenseService.createExpense({
        amount: parseFloat(formData.amount),
        description: formData.description,
        expense_date: new Date(formData.expense_date).toISOString(),
        category_id: formData.category_id,
      })

      setSuccess("Expense added successfully!")
      
      // Reset form
      setFormData({
        description: "",
        amount: "",
        category_id: "",
        expense_date: new Date().toISOString().split('T')[0],
      })

      // Redirect after 1.5 seconds
      setTimeout(() => {
        navigate({ to: "/dashboard" })
      }, 1500)
      
    } catch (err: any) {
      console.error('Failed to add expense:', err)
      setError(err.response?.data?.detail || "Failed to add expense. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <Box
        as="form"
        onSubmit={handleSubmit}
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

        {/* Success Message */}
        {success && (
          <Box
            mb={4}
            p={3}
            bg="green.500"
            color="white"
            rounded="md"
            textAlign="center"
          >
            {success}
          </Box>
        )}

        {/* Error Message */}
        {error && (
          <Box
            mb={4}
            p={3}
            bg="red.500"
            color="white"
            rounded="md"
            textAlign="center"
          >
            {error}
          </Box>
        )}

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          {/* Expense Description */}
          <VStack align="stretch">
            <Text
              color={{
                base: "gray.300",
                _light: "#7C3AED",
              }}
            >
              Expense Description
            </Text>

            <Input
              placeholder="Enter expense description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
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
              Amount (₹)
            </Text>

            <Input
              placeholder="₹ Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              min="0"
              step="0.01"
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

            {loadingCategories ? (
              <Box textAlign="center" py={2}>
                <Spinner size="sm" color="#8B5CF6" />
              </Box>
            ) : (
              <select
                value={formData.category_id || ""}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                required
                style={{
                  backgroundColor: "#242429",
                  border: "none",
                  height: "40px",
                  padding: "0 16px",
                  borderRadius: "6px",
                  color: "white",
                  width: "100%",
                }}
              >
                <option value="">Select category</option>
                {categories.length === 0 && (
                  <>
                    <option value="Food">Food</option>
                    <option value="Travel">Travel</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Bills">Bills</option>
                    <option value="Entertainment">Entertainment</option>
                  </>
                )}
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
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
              value={formData.expense_date}
              onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
              required
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

        <Button
          type="submit"
          mt={10}
          size="lg"
          bg="#8B5CF6"
          color="white"
          rounded="2xl"
          px={10}
          loading={loading}
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