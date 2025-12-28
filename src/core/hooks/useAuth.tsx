import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import apiClient, { setAuthToken } from "@/core/lib/apiClient"
import type { User } from "@/core/types"
import { useNavigate } from "react-router-dom"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (data: any) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
  updateProfile: (data: { name: string; password?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  const refreshProfile = async () => {
    try {
      const response = await apiClient.get<User>("/user/me/")
      setUser(response as any)
    } catch (error) {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      refreshProfile()
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (data: any) => {
    const response = await apiClient.post("/user/token/", data)
    setAuthToken(response.data.token)
    await refreshProfile()
    navigate("/recipes")
  }

  const register = async (data: any) => {
    await apiClient.post("/user/create/", data)
    await login({ email: data.email, password: data.password })
  }

  const logout = () => {
    setAuthToken(undefined)
    setUser(null)
    navigate("/login")
  }

  const updateProfile = async (data: { name: string; password?: string }) => {
    const response = await apiClient.patch<User>("/user/me/", data)
    setUser(response as any)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
