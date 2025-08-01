"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, MapPin, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"

export default function NewSchedulePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    wasteType: "",
    weight: "",
    pickupDate: "",
    pickupTime: "",
    location: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Here you would save to Supabase
      const pickupData = {
        ...formData,
        userId: 'current-user-id', // Replace with actual user ID from auth
        status: 'scheduled'
      }
      
      console.log("Schedule created:", pickupData)
      
      // Redirect to success page with details
      const params = new URLSearchParams({
        date: formData.pickupDate,
        time: formData.pickupTime,
        wasteType: formData.wasteType,
        location: formData.location
      })
      
      router.push(`/dashboard/schedule/success?${params.toString()}`)
    } catch (error) {
      console.error('Error scheduling pickup:', error)
      // Handle error (show toast, etc.)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleLocationShare = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setFormData({
            ...formData,
            location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          alert("Unable to get your location. Please enter manually.")
        },
      )
    } else {
      alert("Geolocation is not supported by this browser.")
    }
  }

  // Get tomorrow's date as minimum date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/schedule">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Schedule
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Schedule a Waste Pickup</CardTitle>
            <p className="text-gray-600">Fill in the details to schedule your waste collection</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Waste Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Waste Type <span className="text-red-500">*</span>
                </label>
                <Select onValueChange={(value) => handleSelectChange("wasteType", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plastic">Plastic</SelectItem>
                    <SelectItem value="paper">Paper</SelectItem>
                    <SelectItem value="organic">Organic</SelectItem>
                    <SelectItem value="metal">Metal</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg) <span className="text-red-500">*</span>
                </label>
                <Input
                  name="weight"
                  type="number"
                  placeholder="Enter estimated weight in kg"
                  value={formData.weight}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  required
                />
              </div>

              {/* Pickup Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      name="pickupDate"
                      type="date"
                      value={formData.pickupDate}
                      onChange={handleChange}
                      min={minDate}
                      required
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Input name="pickupTime" type="time" value={formData.pickupTime} onChange={handleChange} required />
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-2">
                  <Input
                    name="location"
                    type="text"
                    placeholder="Enter pickup address or coordinates"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLocationShare}
                    className="flex items-center space-x-2 bg-transparent"
                  >
                    <MapPin className="h-4 w-4" />
                    <span className="hidden sm:inline">Share Location</span>
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Click "Share Location" to use your current location automatically
                </p>
              </div>

              {/* Pickup Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Pickup Information</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Our team will arrive within a 2-hour window of your selected time</li>
                  <li>• You'll receive SMS and email confirmations</li>
                  <li>• Please have your waste ready at the pickup location</li>
                  <li>• You can reschedule up to 2 hours before pickup time</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <Link href="/dashboard/schedule" className="flex-1">
                  <Button type="button" variant="outline" className="w-full bg-transparent">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  className="flex-1 bg-[#1A7F3D] hover:bg-[#1A7F3D]/90 text-white"
                  disabled={
                    !formData.wasteType ||
                    !formData.weight ||
                    !formData.pickupDate ||
                    !formData.pickupTime ||
                    !formData.location
                  }
                >
                  Schedule Pickup
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
