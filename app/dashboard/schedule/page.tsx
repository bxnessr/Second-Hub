"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Plus } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"

const upcomingSchedules = [
  {
    id: 1,
    date: "May 15, 2025",
    time: "9:00 AM",
    wasteType: "Plastic",
    weight: "3.5",
    status: "Scheduled",
  },
  {
    id: 2,
    date: "May 18, 2025",
    time: "2:00 PM",
    wasteType: "Paper",
    weight: "2.1",
    status: "Confirmed",
  },
  {
    id: 3,
    date: "May 22, 2025",
    time: "10:30 AM",
    wasteType: "Organic",
    weight: "4.2",
    status: "Pending",
  },
]

const completedSchedules = [
  {
    id: 1,
    date: "May 2, 2025",
    time: "9:00 AM",
    wasteType: "Recyclables",
    weight: "5.2",
    status: "Completed",
  },
  {
    id: 2,
    date: "April 25, 2025",
    time: "1:00 PM",
    wasteType: "Compost",
    weight: "3.8",
    status: "Completed",
  },
  {
    id: 3,
    date: "April 18, 2025",
    time: "11:00 AM",
    wasteType: "Electronic",
    weight: "2.1",
    status: "Completed",
  },
  {
    id: 4,
    date: "April 10, 2025",
    time: "3:30 PM",
    wasteType: "Metal",
    weight: "4.5",
    status: "Completed",
  },
  {
    id: 5,
    date: "April 3, 2025",
    time: "10:00 AM",
    wasteType: "Paper",
    weight: "6.7",
    status: "Completed",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Scheduled":
      return "bg-blue-100 text-blue-800"
    case "Confirmed":
      return "bg-green-100 text-green-800"
    case "Pending":
      return "bg-yellow-100 text-yellow-800"
    case "Completed":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function SchedulePage() {
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
            <TabsTrigger value="upcoming">Upcoming Schedules</TabsTrigger>
            <TabsTrigger value="completed">Completed Schedules</TabsTrigger>
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
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 text-gray-600 font-medium">Date</th>
                        <th className="text-left py-3 text-gray-600 font-medium">Time</th>
                        <th className="text-left py-3 text-gray-600 font-medium">Waste Type</th>
                        <th className="text-left py-3 text-gray-600 font-medium">Weight (kg)</th>
                        <th className="text-left py-3 text-gray-600 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingSchedules.map((schedule) => (
                        <tr key={schedule.id} className="border-b border-gray-100">
                          <td className="py-4 text-gray-900">{schedule.date}</td>
                          <td className="py-4 text-gray-700 flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{schedule.time}</span>
                          </td>
                          <td className="py-4 text-gray-700">{schedule.wasteType}</td>
                          <td className="py-4 text-gray-700">{schedule.weight}</td>
                          <td className="py-4">
                            <Badge className={getStatusColor(schedule.status)}>{schedule.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {upcomingSchedules.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg mb-2">No upcoming schedules</p>
                    <p>Schedule your first pickup to get started!</p>
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
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 text-gray-600 font-medium">Date</th>
                        <th className="text-left py-3 text-gray-600 font-medium">Time</th>
                        <th className="text-left py-3 text-gray-600 font-medium">Waste Type</th>
                        <th className="text-left py-3 text-gray-600 font-medium">Weight (kg)</th>
                        <th className="text-left py-3 text-gray-600 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedSchedules.map((schedule) => (
                        <tr key={schedule.id} className="border-b border-gray-100">
                          <td className="py-4 text-gray-900">{schedule.date}</td>
                          <td className="py-4 text-gray-700 flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{schedule.time}</span>
                          </td>
                          <td className="py-4 text-gray-700">{schedule.wasteType}</td>
                          <td className="py-4 text-gray-700">{schedule.weight}</td>
                          <td className="py-4">
                            <Badge className={getStatusColor(schedule.status)}>{schedule.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
