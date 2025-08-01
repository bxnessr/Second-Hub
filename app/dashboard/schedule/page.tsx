
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Plus, Loader2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"
import { createClient } from "@/lib/supabase"

interface Pickup {
  id: string
  pickup_date: string
  pickup_time_start: string
  pickup_time_end: string
  waste_types: string[]
  status: string
  notes?: string
  created_at: string
}

export default function SchedulePage() {
  const [upcomingSchedules, setUpcomingSchedules] = useState<Pickup[]>([])
  const [completedSchedules, setCompletedSchedules] = useState<Pickup[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch all pickups for the user
      const { data: pickups, error } = await supabase
        .from('pickups')
        .select('*')
        .eq('user_id', user.id)
        .order('pickup_date', { ascending: true })

      if (error) {
        console.error('Error fetching pickups:', error)
        return
      }

      const now = new Date()
      const today = now.toISOString().split('T')[0]

      // Separate upcoming and completed
      const upcoming = pickups?.filter(pickup => 
        pickup.pickup_date >= today && 
        !['completed', 'cancelled'].includes(pickup.status)
      ) || []

      const completed = pickups?.filter(pickup => 
        pickup.pickup_date < today || 
        ['completed', 'cancelled'].includes(pickup.status)
      ) || []

      setUpcomingSchedules(upcoming)
      setCompletedSchedules(completed)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#1A7F3D]" />
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
              Upcoming Schedules ({upcomingSchedules.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed Schedules ({completedSchedules.length})
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
                {upcomingSchedules.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 text-gray-600 font-medium">Date</th>
                          <th className="text-left py-3 text-gray-600 font-medium">Time</th>
                          <th className="text-left py-3 text-gray-600 font-medium">Waste Type</th>
                          <th className="text-left py-3 text-gray-600 font-medium">Status</th>
                          <th className="text-left py-3 text-gray-600 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingSchedules.map((schedule) => (
                          <tr key={schedule.id} className="border-b border-gray-100">
                            <td className="py-4 text-gray-900">{formatDate(schedule.pickup_date)}</td>
                            <td className="py-4 text-gray-700 flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{schedule.pickup_time_start} - {schedule.pickup_time_end}</span>
                            </td>
                            <td className="py-4 text-gray-700">{schedule.waste_types?.join(', ')}</td>
                            <td className="py-4">
                              <Badge className={getStatusColor(schedule.status)}>
                                {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-4">
                              <Button variant="outline" size="sm" className="text-[#1A7F3D] border-[#1A7F3D] bg-transparent">
                                Reschedule
                              </Button>
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
                {completedSchedules.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 text-gray-600 font-medium">Date</th>
                          <th className="text-left py-3 text-gray-600 font-medium">Time</th>
                          <th className="text-left py-3 text-gray-600 font-medium">Waste Type</th>
                          <th className="text-left py-3 text-gray-600 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedSchedules.map((schedule) => (
                          <tr key={schedule.id} className="border-b border-gray-100">
                            <td className="py-4 text-gray-900">{formatDate(schedule.pickup_date)}</td>
                            <td className="py-4 text-gray-700 flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{schedule.pickup_time_start} - {schedule.pickup_time_end}</span>
                            </td>
                            <td className="py-4 text-gray-700">{schedule.waste_types?.join(', ')}</td>
                            <td className="py-4">
                              <Badge className={getStatusColor(schedule.status)}>
                                {schedule.status.charAt(0).toUpperCase() + schedule.status.slice(1)}
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
