"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import DashboardLayout from "@/components/dashboard-layout"

// Sample data for the chart
const wasteData = [
  { month: "Jan", weight: 0 },
  { month: "Feb", weight: 0 },
  { month: "Mar", weight: 0 },
  { month: "Apr", weight: 0 },
  { month: "May", weight: 0 },
  { month: "Jun", weight: 0 },
]

export default function HistoryPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">History & Reports</h1>
          <p className="text-gray-600 mt-2">Track your waste management progress over time.</p>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Waste Logs Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={wasteData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#1A7F3D" strokeWidth={2} dot={{ fill: "#1A7F3D" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Total Waste Logged</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1A7F3D]">0 kg</div>
              <p className="text-sm text-gray-500 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Successful Pickups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1A7F3D]">0</div>
              <p className="text-sm text-gray-500 mt-1">Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Environmental Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#1A7F3D]">0 kg</div>
              <p className="text-sm text-gray-500 mt-1">CO₂ saved</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No activity yet</p>
              <p>Start logging waste to see your history here!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
