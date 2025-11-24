"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { getProfile } from "@/lib/auth"
import { signOut } from "@/lib/auth"
import LoginPage from "@/components/login-page"
import Dashboard from "@/components/dashboard"

export default function Home() {
  const { user, isLoading } = useAuth()
  const [userName, setUserName] = useState("")
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)

  useEffect(() => {
    if (user) {
      loadProfile()
    } else {
      setIsLoadingProfile(false)
    }
  }, [user])

  async function loadProfile() {
    try {
      if (!user) return
      const { profile } = await getProfile(user.id)
      if (profile) {
        setUserName(profile.full_name || profile.email.split("@")[0])
      }
    } catch (error) {
      console.error("Error loading profile:", error)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handleLogin = (name: string) => {
    setUserName(name)
  }

  const handleLogout = async () => {
    await signOut()
    setUserName("")
  }

  if (isLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-yellow-400 border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  return user ? (
    <Dashboard userName={userName} onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={handleLogin} />
  )
}
