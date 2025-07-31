"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import DashboardLayout from "@/components/dashboard-layout"

export default function SchedulePickupPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Pickup scheduled:", { date: selectedDate, time: selectedTime })
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Schedule Pickup</h1>
          <p className="text-gray-600 mt-2">Choose a convenient time for waste collection.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pickup Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Selected Date</label>
                  <Input type="text" value={selectedDate?.toDateString() || ""} readOnly className="bg-gray-50" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                  <Input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} required />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Pickup Information</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Pickup window: 2 hours around selected time</li>
                    <li>• You'll receive SMS confirmation</li>
                    <li>• Please have waste ready at pickup location</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#1A7F3D] hover:bg-[#1A7F3D]/90 text-white"
                  disabled={!selectedDate || !selectedTime}
                >
                  Request Pickup
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
