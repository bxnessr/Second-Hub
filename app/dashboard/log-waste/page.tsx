"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Recycle, Coffee, Smartphone, FileText, Cpu, Trash2, Upload } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

const wasteTypes = [
  {
    id: "plastic",
    name: "Plastic",
    description: "Bottles, containers, packaging",
    icon: Recycle,
  },
  {
    id: "organic",
    name: "Organic",
    description: "Food scraps, yard waste, compostable items",
    icon: Coffee,
  },
  {
    id: "metal",
    name: "Metal",
    description: "Cans, aluminum, steel, copper items",
    icon: Smartphone,
  },
  {
    id: "paper",
    name: "Paper",
    description: "Newspapers, cardboard, office paper",
    icon: FileText,
  },
  {
    id: "electronic",
    name: "Electronic",
    description: "Devices, batteries, cables, appliances",
    icon: Cpu,
  },
  {
    id: "general",
    name: "General",
    description: "Non-recyclable items",
    icon: Trash2,
  },
]

export default function LogWastePage() {
  const [selectedWasteType, setSelectedWasteType] = useState<string>("")
  const [amount, setAmount] = useState("")
  const [unit, setUnit] = useState("kg")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [notes, setNotes] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const wasteLogData = {
        wasteType: selectedWasteType,
        amount: parseFloat(amount),
        date: selectedDate,
        time: selectedTime,
        notes,
        userId: 'current-user-id', // Replace with actual user ID from auth
        pointsEarned: calculatePoints(selectedWasteType, parseFloat(amount))
      }

      console.log("Waste logged:", wasteLogData)

      // Here you would save to Supabase waste_logs table
      // const { data, error } = await supabase.from('waste_logs').insert([wasteLogData])

      // Redirect back to dashboard after logging
      router.push("/dashboard")
    } catch (error) {
      console.error('Error logging waste:', error)
    }
  }

  const calculatePoints = (wasteType: string, amount: number) => {
    const pointsPerKg = {
      'Plastic': 10,
      'Paper': 8,
      'Metal': 15,
      'Glass': 12,
      'Organic': 5,
      'Electronic': 20
    }
    return Math.floor(amount * (pointsPerKg[wasteType as keyof typeof pointsPerKg] || 5))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0])
    }
  }

  // Get tomorrow's date as minimum date
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center space-x-2">
            <Recycle className="h-5 w-5 text-[#1A7F3D]" />
            <span className="font-semibold text-gray-900">Log Waste</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Title Section */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Log Waste for Pickup</h1>
          <p className="text-gray-600">Select waste type, estimate quantity, upload a photo, and schedule a pickup</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Waste Type Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Waste Type</h2>
              <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-500">?</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {wasteTypes.map((type) => {
                const Icon = type.icon
                return (
                  <Card
                    key={type.id}
                    className={cn(
                      "cursor-pointer transition-all duration-200 hover:shadow-md",
                      selectedWasteType === type.id
                        ? "border-[#1A7F3D] bg-green-50"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                    onClick={() => setSelectedWasteType(type.id)}
                  >
                    <CardContent className="p-4 text-center space-y-2">
                      <Icon
                        className={cn(
                          "h-8 w-8 mx-auto",
                          selectedWasteType === type.id ? "text-[#1A7F3D]" : "text-gray-400",
                        )}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{type.name}</h3>
                        <p className="text-xs text-gray-500 leading-tight">{type.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Quantity Estimation */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Quantity Estimation</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <Input
                  type="number"
                  placeholder="Enter quantity"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.1"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                    <SelectItem value="pieces">Pieces</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Upload Photo */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Upload Photo (Optional)</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag & drop or click to upload</p>
              <p className="text-sm text-gray-500 mb-4">Upload a photo of your waste for verification</p>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload">
                <Button type="button" className="bg-[#1A7F3D] hover:bg-[#1A7F3D]/90 text-white cursor-pointer">
                  Select Image
                </Button>
              </label>
              {photo && <p className="text-sm text-green-600 mt-2">Photo selected: {photo.name}</p>}
            </div>
          </div>

          {/* Schedule Pickup */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Schedule Pickup</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={minDate}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                    <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Additional Notes (Optional)</h2>
            <Textarea
              placeholder="Any special instructions or details about your waste"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6">
            <Link href="/dashboard" className="flex-1">
              <Button type="button" variant="outline" className="w-full bg-transparent">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              className="flex-1 bg-[#1A7F3D] hover:bg-[#1A7F3D]/90 text-white"
              disabled={!selectedWasteType || !amount || !selectedDate || !selectedTime}
            >
              Schedule Pickup
            </Button>
          </div>

          {/* Additional Schedule Option */}
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-3">Want to schedule a separate pickup?</p>
            <Link href="/dashboard/schedule/new">
              <Button
                variant="outline"
                className="w-full border-[#1A7F3D] text-[#1A7F3D] hover:bg-[#1A7F3D] hover:text-white bg-transparent"
              >
                Schedule Another Pickup
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}