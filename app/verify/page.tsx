"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [resendLoading, setResendLoading] = useState(false)

  useEffect(() => {
    // Get email from URL parameters
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam))
    }
  }, [searchParams])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    if (!email || !code) {
      setError("Please enter both email and verification code")
      setLoading(false)
      return
    }

    if (code.length !== 6) {
      setError("Verification code must be 6 digits")
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "signup",
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess("Verification successful! Redirecting to dashboard...")
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Verification error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setResendLoading(true)
    setError("")
    setSuccess("")

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess("Verification code resent! Please check your email.")
      }
    } catch (error) {
      setError("Failed to resend verification code")
      console.error("Resend error:", error)
    } finally {
      setResendLoading(false)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6) // Only allow digits, max 6
    setCode(value)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-8 w-8 text-[#1A7F3D]" />
            <span className="text-2xl font-bold text-[#1A7F3D]">Bioloop Hub</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Verify Your Email</CardTitle>
          <p className="text-gray-600">Enter the 6-digit code sent to your email</p>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 text-blue-800">
              <Mail className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Check your email</p>
                <p className="text-xs">We sent a verification code to {email || "your email address"}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                {success}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={handleCodeChange}
                required
                disabled={loading}
                className="text-center text-2xl font-mono tracking-widest"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">Enter the 6-digit code from your email</p>
            </div>

            <Button type="submit" className="w-full bg-[#1A7F3D] hover:bg-[#1A7F3D]/90 text-white" disabled={loading}>
              {loading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
              <Button
                variant="outline"
                onClick={handleResendCode}
                disabled={resendLoading || !email}
                className="bg-transparent"
              >
                {resendLoading ? "Resending..." : "Resend Code"}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <Link href="/signin" className="flex items-center justify-center text-[#1A7F3D] hover:underline text-sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
