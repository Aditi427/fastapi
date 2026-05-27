import { 
  Box, 
  HStack, 
  Table, 
  Text, 
  Spinner, 
  Center, 
  IconButton,
  Input,
  VStack,
  Dialog,
  Button
} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { expenseService, type Expense } from "@/services/expenseService"
import { FiEdit2, FiTrash2 } from "react-icons/fi"

export default function ExpenseTable() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    loadExpenses()
    loadCategories()
  }, [])

  // Auto-hide message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const loadExpenses = async () => {
    try {
      const response = await expenseService.getExpenses()
      const expensesData = response.data || response
      setExpenses(Array.isArray(expensesData) ? expensesData : [])
    } catch (err) {
      console.error('Failed to load expenses:', err)
      setMessage({ text: "Failed to load expenses", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await expenseService.getCategories()
      setCategories(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load categories:', err)
    }
  }

  const handleDelete = async () => {
    if (!deletingId) return
    
    try {
      await expenseService.deleteExpense(deletingId)
      setMessage({ text: "Expense deleted successfully", type: "success" })
      setIsDeleteOpen(false)
      setDeletingId(null)
      loadExpenses()
    } catch (err) {
      setMessage({ text: "Failed to delete expense", type: "error" })
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingExpense) return
    
    try {
      await expenseService.updateExpense(editingExpense.id, {
        amount: editingExpense.amount,
        description: editingExpense.description,
        expense_date: editingExpense.expense_date,
        category_id: editingExpense.category_id,
      })
      setMessage({ text: "Expense updated successfully", type: "success" })
      setIsEditOpen(false)
      setEditingExpense(null)
      loadExpenses()
    } catch (err) {
      setMessage({ text: "Failed to update expense", type: "error" })
    }
  }

  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="#8B5CF6" />
      </Center>
    )
  }

  if (expenses.length === 0) {
    return (
      <Box
        p={8}
        textAlign="center"
        bg={{
          base: "#151518",
          _light: "white",
        }}
        rounded="3xl"
        border="1px solid"
        borderColor={{
          base: "gray.800",
          _light: "#E9DDFC",
        }}
      >
        <Text
          color={{
            base: "gray.400",
            _light: "#8B5CF6",
          }}
        >
          No expenses yet. Click "Add Expense" to get started!
        </Text>
      </Box>
    )
  }

  return (
    <>
      {/* Message Banner */}
      {message && (
        <Box
          mb={4}
          p={3}
          rounded="lg"
          bg={message.type === "success" ? "green.500" : "red.500"}
          color="white"
          textAlign="center"
        >
          {message.text}
        </Box>
      )}

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
              <Table.ColumnHeader textAlign="center">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {expenses.map((expense) => (
              <Table.Row key={expense.id}>
                <Table.Cell>
                  <Text
                    fontWeight="bold"
                    color={{
                      base: "#F59E0B",
                      _light: "#D97706",
                    }}
                  >
                    ₹{expense.amount.toFixed(2)}
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
                      {expense.category?.name || "Uncategorized"}
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
                    {new Date(expense.expense_date).toLocaleDateString()}
                  </Text>
                </Table.Cell>

                <Table.Cell>
                  <HStack gap={2} justify="center">
                    <IconButton
                      aria-label="Edit expense"
                      size="sm"
                      variant="ghost"
                      color="#8B5CF6"
                      onClick={() => {
                        setEditingExpense(expense)
                        setIsEditOpen(true)
                      }}
                    >
                      <FiEdit2 />
                    </IconButton>
                    <IconButton
                      aria-label="Delete expense"
                      size="sm"
                      variant="ghost"
                      color="red.400"
                      onClick={() => {
                        setDeletingId(expense.id)
                        setIsDeleteOpen(true)
                      }}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* Edit Modal */}
      <Dialog.Root open={isEditOpen} onOpenChange={(e) => setIsEditOpen(e.open)}>
        <Dialog.Content
          bg={{
            base: "#151518",
            _light: "white",
          }}
          rounded="2xl"
        >
          <Dialog.Header>
            <Dialog.Title
              color={{
                base: "white",
                _light: "#6D28D9",
              }}
            >
              Edit Expense
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <VStack gap={4}>
              <Box w="100%">
                <Text mb={2} color="gray.400">Amount</Text>
                <Input
                  type="number"
                  value={editingExpense?.amount || ""}
                  onChange={(e) => setEditingExpense(prev => 
                    prev ? { ...prev, amount: parseFloat(e.target.value) } : null
                  )}
                  bg={{ base: "#242429", _light: "#F5F3FF" }}
                  border="none"
                  color={{ base: "white", _light: "#4C1D95" }}
                  required
                />
              </Box>

              <Box w="100%">
                <Text mb={2} color="gray.400">Description</Text>
                <Input
                  value={editingExpense?.description || ""}
                  onChange={(e) => setEditingExpense(prev => 
                    prev ? { ...prev, description: e.target.value } : null
                  )}
                  bg={{ base: "#242429", _light: "#F5F3FF" }}
                  border="none"
                  color={{ base: "white", _light: "#4C1D95" }}
                  required
                />
              </Box>

              <Box w="100%">
                <Text mb={2} color="gray.400">Category</Text>
                <select
                  value={editingExpense?.category_id || ""}
                  onChange={(e) => setEditingExpense(prev => 
                    prev ? { ...prev, category_id: e.target.value } : null
                  )}
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
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </Box>

              <Box w="100%">
                <Text mb={2} color="gray.400">Date</Text>
                <Input
                  type="date"
                  value={editingExpense?.expense_date?.split("T")[0] || ""}
                  onChange={(e) => setEditingExpense(prev => 
                    prev ? { ...prev, expense_date: e.target.value } : null
                  )}
                  bg={{ base: "#242429", _light: "#F5F3FF" }}
                  border="none"
                  color={{ base: "white", _light: "#4C1D95" }}
                  required
                />
              </Box>
            </VStack>
          </Dialog.Body>

          <Dialog.Footer>
            <Button
              variant="ghost"
              onClick={() => setIsEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              bg="#8B5CF6"
              color="white"
              _hover={{ bg: "#7C3AED" }}
              onClick={handleUpdate}
            >
              Save Changes
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>

      {/* Delete Confirmation Modal */}
      <Dialog.Root open={isDeleteOpen} onOpenChange={(e) => setIsDeleteOpen(e.open)}>
        <Dialog.Content
          bg={{
            base: "#151518",
            _light: "white",
          }}
          rounded="2xl"
        >
          <Dialog.Header>
            <Dialog.Title
              color={{
                base: "white",
                _light: "#6D28D9",
              }}
            >
              Delete Expense
            </Dialog.Title>
          </Dialog.Header>

          <Dialog.Body>
            <Text color={{ base: "gray.300", _light: "#4C1D95" }}>
              Are you sure you want to delete this expense? This action cannot be undone.
            </Text>
          </Dialog.Body>

          <Dialog.Footer>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              bg="red.500"
              color="white"
              _hover={{ bg: "red.600" }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}