"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock, ShoppingCart, Loader2 } from "lucide-react"
import { signUp, signIn } from "@/lib/auth"

interface LoginPageProps {
  onLogin: (name: string) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (isSignUp) {
        if (!name || !email || !password) {
          setError("Por favor preencha todos os campos")
          setIsLoading(false)
          return
        }

        const { user, error: signUpError } = await signUp(email, password, name)
        
        if (signUpError) {
          setError(signUpError.message || "Erro ao criar conta")
          setIsLoading(false)
          return
        }

        if (user) {
          onLogin(name)
        }
      } else {
        if (!email || !password) {
          setError("Por favor preencha email e senha")
          setIsLoading(false)
          return
        }

        const { user, error: signInError } = await signIn(email, password)
        
        if (signInError) {
          setError(signInError.message || "Erro ao entrar")
          setIsLoading(false)
          return
        }

        if (user) {
          onLogin(email.split("@")[0])
        }
      }
    } catch (err) {
      setError("Ocorreu um erro inesperado")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShoppingCart className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-yellow-500">ShopList</h1>
          </div>
          <p className="text-gray-700">Organize suas compras com facilidade</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{isSignUp ? "Criar Conta" : "Entrar"}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:bg-gray-100 placeholder-gray-600"
                  placeholder="Seu nome"
                  disabled={isLoading}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:bg-gray-100 placeholder-gray-600"
                  placeholder="seu@email.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:bg-gray-100 placeholder-gray-600"
                  placeholder="Sua senha"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-yellow-400 text-white font-semibold py-2 rounded-lg hover:bg-yellow-500 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSignUp ? "Criar Conta" : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              {isSignUp ? "Já tem conta?" : "Não tem conta?"}{" "}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setName("")
                  setEmail("")
                  setPassword("")
                  setError("")
                }}
                disabled={isLoading}
                className="text-yellow-500 font-semibold hover:underline disabled:text-gray-400"
              >
                {isSignUp ? "Entrar" : "Cadastrar"}
              </button>
            </p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-gray-700 font-medium">
            <strong>Autenticação:</strong> Use um email e senha para criar uma conta ou fazer login. Os dados são salvos no Supabase.
          </p>
        </div>
      </div>
    </div>
  )
}
