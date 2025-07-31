import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Recycle, Calendar, Leaf } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"

const upcomingPickups = [
  {
    id: 1,
    type: "Recyclables Pickup",
    date: "May 9, 2025",
    time: "9:00 AM - 12:00 PM",
  },
  {
    id: 2,
    type: "Compost Pickup",
    date: "May 16, 2025",
    time: "1:00 PM - 4:00 PM",
  },
]

const pickupHistory = [
  {
    id: "PU-1234",
    date: "May 2, 2025",
    type: "Recyclables",
    weight: "5.2 kg",
    points: 52,
    status: "Completed",
  },
  {
    id: "PU-1235",
    date: "April 25, 2025",
    type: "Compost",
    weight: "3.8 kg",
    points: 38,
    status: "Completed",
  },
  {
    id: "PU-1236",
    date: "April 18, 2025",
    type: "Electronic",
    weight: "2.1 kg",
    points: 63,
    status: "Completed",
  },
  {
    id: "PU-1237",
    date: "April 10, 2025",
    type: "General Waste",
    weight: "4.5 kg",
    points: 22,
    status: "Completed",
  },
  {
    id: "PU-1238",
    date: "April 3, 2025",
    type: "Recyclables",
    weight: "6.7 kg",
    points: 67,
    status: "Completed",
  },
]

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, John! Here's your waste management overview.</p>
          </div>
          <Link href="/dashboard/log-waste">
            <Button className="bg-[#1A7F3D] hover:bg-[#1A7F3D]/90 text-white">+ Log New Waste</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Points</span>
                <Star className="h-4 w-4 text-[#1A7F3D]" />
              </div>
              <div className="text-2xl font-bold text-gray-900">1,250</div>
              <div className="text-xs text-[#1A7F3D]">+120 this month</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Waste Recycled</span>
                <Recycle className="h-4 w-4 text-[#1A7F3D]" />
              </div>
              <div className="text-2xl font-bold text-gray-900">42.3 kg</div>
              <div className="text-xs text-[#1A7F3D]">+15% from last month</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Pickups Completed</span>
                <Calendar className="h-4 w-4 text-[#1A7F3D]" />
              </div>
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-xs text-[#1A7F3D]">2 scheduled this month</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Environmental Impact</span>
                <Leaf className="h-4 w-4 text-[#1A7F3D]" />
              </div>
              <div className="text-2xl font-bold text-gray-900">120 kg CO₂</div>
              <div className="text-xs text-[#1A7F3D]">Emissions saved</div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Goals</CardTitle>
            <p className="text-sm text-gray-600">Track your progress towards sustainability targets</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Reduce plastic waste</span>
                <span className="text-gray-500">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Increase recycling</span>
                <span className="text-gray-500">60%</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Compost organic waste</span>
                <span className="text-gray-500">90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Pickups */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Upcoming Pickups</CardTitle>
                <p className="text-sm text-gray-600">Your scheduled waste collection</p>
              </div>
              <Button variant="ghost" className="text-[#1A7F3D] text-sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingPickups.map((pickup) => (
              <div key={pickup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-[#1A7F3D]" />
                  <div>
                    <div className="font-medium text-gray-900">{pickup.type}</div>
                    <div className="text-sm text-gray-600">
                      {pickup.date} • {pickup.time}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-[#1A7F3D] border-[#1A7F3D] bg-transparent">
                  Reschedule
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pickup History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Pickup History</CardTitle>
                <p className="text-sm text-gray-600">Your recent waste collection history</p>
              </div>
              <Button variant="ghost" className="text-[#1A7F3D] text-sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-600 font-medium">ID</th>
                    <th className="text-left py-2 text-gray-600 font-medium">Date</th>
                    <th className="text-left py-2 text-gray-600 font-medium">Type</th>
                    <th className="text-left py-2 text-gray-600 font-medium">Weight</th>
                    <th className="text-left py-2 text-gray-600 font-medium">Points</th>
                    <th className="text-left py-2 text-gray-600 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pickupHistory.map((pickup) => (
                    <tr key={pickup.id} className="border-b border-gray-100">
                      <td className="py-3 text-gray-900">{pickup.id}</td>
                      <td className="py-3 text-gray-700">{pickup.date}</td>
                      <td className="py-3 text-gray-700">{pickup.type}</td>
                      <td className="py-3 text-gray-700">{pickup.weight}</td>
                      <td className="py-3">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-[#1A7F3D]" />
                          <span className="text-[#1A7F3D] font-medium">{pickup.points}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {pickup.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">A list of your recent waste pickups.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
