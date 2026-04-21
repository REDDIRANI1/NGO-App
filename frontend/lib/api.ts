const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ApiResponse<T> {
  data?: T
  error?: string
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.detail || 'An error occurred' }
    }

    return { data }
  } catch (error) {
    return { error: 'Failed to connect to server' }
  }
}

export const api = {
  post: <T,>(endpoint: string, body?: unknown) =>
    fetchApi<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

  get: <T,>(endpoint: string) => fetchApi<T>(endpoint),

  postForm: <T,>(endpoint: string, formData: FormData) =>
    fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
    }).then(async (res) => {
      const data = await res.json()
      if (!res.ok) {
        return { error: data.detail || 'An error occurred' }
      }
      return { data }
    }),
}