import apiClient from '@/client/apiClient'

export interface Expense {
  id: string
  amount: number
  description: string
  expense_date: string
  category_id: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  description?: string
  owner_id?: string
}

export interface DashboardStats {
  total_income: number
  total_expenses: number
  savings: number
  recent_expenses: Expense[]
  category_breakdown: Record<string, number>
}

export interface IncomeBudgetData {
  monthly_income: number
  budget: number
}

export const expenseService = {
  // Get dashboard statistics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/dashboard/stats')
    return response.data
  },

  // Get all expenses
  getExpenses: async (params?: {
    category_id?: string
    start_date?: string
    end_date?: string
    skip?: number
    limit?: number
  }): Promise<{ data: Expense[]; count: number }> => {
    const response = await apiClient.get('/expenses/', { params })
    return response.data
  },

  // Get single expense
  getExpense: async (id: string): Promise<Expense> => {
    const response = await apiClient.get(`/expenses/${id}`)
    return response.data
  },

  // Create expense
  createExpense: async (expense: {
    amount: number
    description: string
    expense_date: string
    category_id: string
  }): Promise<Expense> => {
    const response = await apiClient.post('/expenses/', expense)
    return response.data
  },

  // Update expense
  updateExpense: async (id: string, expense: Partial<Expense>): Promise<Expense> => {
    const response = await apiClient.put(`/expenses/${id}`, expense)
    return response.data
  },

  // Delete expense
  deleteExpense: async (id: string): Promise<void> => {
    await apiClient.delete(`/expenses/${id}`)
  },

  // Get all categories - FIXED: Handles both array and object responses
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get('/categories/')
    console.log('Categories API response:', response.data)
    
    // Check if response.data is an array
    if (Array.isArray(response.data)) {
      return response.data
    }
    
    // Check if response.data has a data property that is an array
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data
    }
    
    // If it's a single object, wrap it in an array
    if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
      // Check if it's a paginated response
      if (response.data.items && Array.isArray(response.data.items)) {
        return response.data.items
      }
      if (response.data.results && Array.isArray(response.data.results)) {
        return response.data.results
      }
      // Return empty array if we can't determine the structure
      console.warn('Unexpected categories response structure:', response.data)
      return []
    }
    
    return []
  },

  // Create category
  createCategory: async (category: { name: string; description?: string }): Promise<Category> => {
    const response = await apiClient.post('/categories/', category)
    return response.data
  },

  // Update income and budget
  updateIncomeBudget: async (data: IncomeBudgetData): Promise<any> => {
    const response = await apiClient.put('/users/me/income-budget', data)
    return response.data
  },

  // Get user profile with income/budget
  getUserProfile: async (): Promise<any> => {
    const response = await apiClient.get('/users/me/profile')
    return response.data
  },
}