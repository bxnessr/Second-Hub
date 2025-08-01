
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Clock, MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"

export default function ScheduleSuccessPage() {
  const searchParams = useSearchParams()
  const [pickupDetails, setPickupDetails] = useState<any>(null)

  useEffect(() => {
    // Get pickup details from URL params or localStorage
    const details = {
      id: searchParams.get('id') || 'PU-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: searchParams.get('date') || new Date().toISOString().split('T')[0],
      time: searchParams.get('time') || '09:00',
      wasteType: searchParams.get('wasteType') || 'Mixed Waste',
      location: searchParams.get('location') || 'Home Address'
    }
    setPickupDetails(details)
  }, [searchParams])

  if (!pickupDetails) {
    return <DashboardLayout><div>Loading...</div></DashboardLayout>
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-800">Pickup Scheduled Successfully!</CardTitle>
            <p className="text-green-700">Your waste collection has been scheduled</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-3">Pickup Details</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">ID</span>
                  </div>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {pickupDetails.id}
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span>{new Date(pickupDetails.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span>{pickupDetails.time} (2-hour window)</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span>{pickupDetails.location}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">What's Next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• You'll receive an SMS confirmation shortly</li>
                <li>• Our team will contact you 30 minutes before pickup</li>
                <li>• Please have your waste ready at the pickup location</li>
                <li>• You can track your pickup status in the dashboard</li>
              </ul>
            </div>

            <div className="flex space-x-4">
              <Link href="/dashboard" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/schedule" className="flex-1">
                <Button className="w-full bg-[#1A7F3D] hover:bg-[#1A7F3D]/90">
                  View All Schedules
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
