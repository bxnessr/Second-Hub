"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Recycle, Calendar, Leaf } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import Link from "next/link"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [upcomingPickups, setUpcomingPickups] = useState<any[]>([])
  const [wasteHistory, setWasteHistory] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalPoints: 0,
    wasteRecycled: 0,
    pickupsCompleted: 0,
    co2Saved: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setUser(user)

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(profileData)

      // Fetch upcoming pickups
      const { data: pickupsData } = await supabase
        .from('pickups')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'scheduled')
        .gte('pickup_date', new Date().toISOString().split('T')[0])
        .order('pickup_date', { ascending: true })
        .limit(2)

      setUpcomingPickups(pickupsData || [])

      // Fetch waste history
      const { data: wasteData } = await supabase
        .from('waste_logs')
        .select(`
          *,
          waste_types (name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      setWasteHistory(wasteData || [])

      // Calculate stats
      const { data: allWasteData } = await supabase
        .from('waste_logs')
        .select('weight, points_earned, status')
        .eq('user_id', user.id)

      const { data: allPickupsData } = await supabase
        .from('pickups')
        .select('status')
        .eq('user_id', user.id)

      if (allWasteData && allPickupsData) {
        const totalWeight = allWasteData.reduce((sum, log) => sum + Number(log.weight), 0)
        const totalPoints = allWasteData.reduce((sum, log) => sum + log.points_earned, 0)
        const completedPickups = allPickupsData.filter(p => p.status === 'completed').length
        
        setStats({
          totalPoints,
          wasteRecycled: totalWeight,
          pickupsCompleted: completedPickups,
          co2Saved: Math.round(totalWeight * 2.8) // Rough estimate: 1kg waste = 2.8kg CO2 saved
        })
      }

    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
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
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {profile?.first_name || user?.email?.split('@')[0]}! Here's your waste management overview.</p>
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
              <div className="text-2xl font-bold text-gray-900">{stats.totalPoints.toLocaleString()}</div>
              <div className="text-xs text-[#1A7F3D]">Total earned</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Waste Recycled</span>
                <Recycle className="h-4 w-4 text-[#1A7F3D]" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.wasteRecycled.toFixed(1)} kg</div>
              <div className="text-xs text-[#1A7F3D]">Total processed</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Pickups Completed</span>
                <Calendar className="h-4 w-4 text-[#1A7F3D]" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.pickupsCompleted}</div>
              <div className="text-xs text-[#1A7F3D]">{upcomingPickups.length} upcoming</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Environmental Impact</span>
                <Leaf className="h-4 w-4 text-[#1A7F3D]" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.co2Saved} kg CO₂</div>
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
            {upcomingPickups.length > 0 ? upcomingPickups.map((pickup) => (
              <div key={pickup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-[#1A7F3D]" />
                  <div>
                    <div className="font-medium text-gray-900">{pickup.waste_types?.join(', ')} Pickup</div>
                    <div className="text-sm text-gray-600">
                      {new Date(pickup.pickup_date).toLocaleDateString()} • {pickup.pickup_time_start} - {pickup.pickup_time_end}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-[#1A7F3D] border-[#1A7F3D] bg-transparent">
                  Reschedule
                </Button>
              </div>
            )) : (
              <div className="text-center text-gray-500 py-8">
                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No upcoming pickups scheduled</p>
                <Link href="/dashboard/schedule">
                  <Button className="mt-2 bg-[#1A7F3D] hover:bg-[#1A7F3D]/90">Schedule Pickup</Button>
                </Link>
              </div>
            )}
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
                  {wasteHistory.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100">
                      <td className="py-3 text-gray-900">{log.id.slice(0, 8)}</td>
                      <td className="py-3 text-gray-700">{new Date(log.created_at).toLocaleDateString()}</td>
                      <td className="py-3 text-gray-700">{log.waste_types?.name}</td>
                      <td className="py-3 text-gray-700">{log.weight} kg</td>
                      <td className="py-3">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 text-[#1A7F3D]" />
                          <span className="text-[#1A7F3D] font-medium">{log.points_earned}</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <Badge 
                          variant="secondary" 
                          className={
                            log.status === 'completed' ? 'bg-green-100 text-green-800' :
                            log.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {log.status}
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
