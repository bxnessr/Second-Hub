
"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Plus } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface Pickup {
  id: string
  pickup_date: string
  pickup_time: string
  waste_type: string
  weight: number
  status: string
  location: string
  created_at: string
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "scheduled":
      return "bg-blue-100 text-blue-800"
    case "confirmed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "completed":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatTime = (timeString: string) => {
  if (!timeString) return 'Not specified'
  
  // Handle different time formats
  if (timeString.includes(':')) {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }
  
  // Handle time slots like "morning", "afternoon", "evening"
  switch (timeString.toLowerCase()) {
    case "morning":
      return "8:00 AM - 12:00 PM"
    case "afternoon":
      return "12:00 PM - 5:00 PM"
    case "evening":
      return "5:00 PM - 8:00 PM"
    default:
      return timeString
  }
}

export default function SchedulePage() {
  const [user, setUser] = useState<User | null>(null)
  const [upcomingPickups, setUpcomingPickups] = useState<Pickup[]>([])
  const [completedPickups, setCompletedPickups] = useState<Pickup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPickups()
  }, [])

  const fetchPickups = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      setUser(user)

      // Fetch all pickups for the user
      const { data: pickups, error } = await supabase
        .from('pickups')
        .select('*')
        .eq('user_id', user.id)
        .order('pickup_date', { ascending: true })

      if (error) {
        console.error('Error fetching pickups:', error)
        setLoading(false)
        return
      }

      const now = new Date()
      const today = now.toISOString().split('T')[0]

      // Separate upcoming and completed pickups
      const upcoming = pickups?.filter(pickup => {
        const pickupDate = new Date(pickup.pickup_date)
        const isUpcoming = pickup.status.toLowerCase() !== 'completed' && 
                          pickup.pickup_date >= today
        return isUpcoming
      }) || []

      const completed = pickups?.filter(pickup => {
        const isCompleted = pickup.status.toLowerCase() === 'completed' || 
                           pickup.pickup_date < today
        return isCompleted
      }) || []

      setUpcomingPickups(upcoming)
      setCompletedPickups(completed)
      setLoading(false)
    } catch (error) {
      console.error('Error:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A7F3D] mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading schedules...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule Pickup</h1>
            <p className="text-gray-600 mt-2">Manage your waste pickup schedules</p>
          </div>
          <Link href="/dashboard/schedule/new">
            <Button className="bg-[#1A7F3D] hover:bg-[#1A7F3D]/90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Schedule
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">
              Upcoming Schedules ({upcomingPickups.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed Schedules ({completedPickups.length})
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Schedules Tab */}
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-[#1A7F3D]" />
                  <span>Upcoming Schedules</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingPickups.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 text-gray-600 font-medium">Date</th>
                          <th className="text-left py-3 text-gray-600 font-medium">Time</th>
                          <th className="text-left py-3 text-gray-600 font-medium">Waste Type</th>
                          <th className="text-left py-3 text-gray-600 font-medium">Weight (kg)</th>
                          <th className="text-left py-3 text-gray-600 font-medium">Location</th>
                          <th className="text-left py-3 text-gray-600 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingPickups.map((pickup) => (
                          <tr key={pickup.id} className="border-b border-gray-100">
                            <td className="py-4 text-gray-900">{formatDate(pickup.pickup_date)}</td>
                            <td className="py-4 text-gray-700 flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{formatTime(pickup.pickup_time)}</span>
                            </td>
                            <td className="py-4 text-gray-700 capitalize">{pickup.waste_type}</td>
                            <td className="py-4 text-gray-700">{pickup.weight}</td>
                            <td className="py-4 text-gray-700">{pickup.location}</td>
                            <td className="py-4">
                              <Badge className={getStatusColor(pickup.status)}>
                                {pickup.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">No upcoming schedules</p>
                    <p>Schedule your first pickup to get started!</p>
                    <Link href="/dashboard/schedule/new">
                      <Button className="mt-4 bg-[#1A7F3D] hover:bg-[#1A7F3D]/90">
                        Schedule Pickup
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Completed Schedules Tab */}
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-[#1A7F3D]" />
                  <span>Completed Schedules</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {completedPickups.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 text-gray-600 font-medium">Date</th>
                          <th className="text-left py-3 text-gray-600 font-medium">Time</th>
                          <th className="text-left py-3 text-gray-600 font-medium">Waste Type</th>
                          <th className="text-left py-3 text-gray-600 font-medium">Weight (kg)</th>
                          <th className="text-left py-3 text-gray-600 font-medium">Location</th>
                          <th className="text-left py-3 text-gray-600 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedPickups.map((pickup) => (
                          <tr key={pickup.id} className="border-b border-gray-100">
                            <td className="py-4 text-gray-900">{formatDate(pickup.pickup_date)}</td>
                            <td className="py-4 text-gray-700 flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{formatTime(pickup.pickup_time)}</span>
                            </td>
                            <td className="py-4 text-gray-700 capitalize">{pickup.waste_type}</td>
                            <td className="py-4 text-gray-700">{pickup.weight}</td>
                            <td className="py-4 text-gray-700">{pickup.location}</td>
                            <td className="py-4">
                              <Badge className={getStatusColor(pickup.status)}>
                                {pickup.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">No completed schedules</p>
                    <p>Your completed pickups will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
