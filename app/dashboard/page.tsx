
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  TrendingUp, 
  Award, 
  Recycle,
  Plus,
  Clock,
  Gift,
  Loader2
} from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { supabase } from "@/lib/supabase"

interface UserStats {
  totalPoints: number
  totalWaste: number
  pickupsCompleted: number
  rewardsRedeemed: number
}

interface WasteLog {
  id: string
  waste_type: string
  amount: number
  points_earned: number
  created_at: string
}

interface Pickup {
  id: string
  pickup_date: string
  pickup_time_start: string
  pickup_time_end: string
  waste_types: string[]
  status: string
}

export default function DashboardPage() {
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    totalWaste: 0,
    pickupsCompleted: 0,
    rewardsRedeemed: 0
  })
  const [recentWasteLogs, setRecentWasteLogs] = useState<WasteLog[]>([])
  const [upcomingPickups, setUpcomingPickups] = useState<Pickup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch user profile with points
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_points')
        .eq('id', user.id)
        .single()

      // Fetch waste logs
      const { data: wasteLogs } = await supabase
        .from('waste_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch upcoming pickups
      const { data: pickups } = await supabase
        .from('pickups')
        .select('*')
        .eq('user_id', user.id)
        .gte('pickup_date', new Date().toISOString().split('T')[0])
        .eq('status', 'scheduled')
        .order('pickup_date', { ascending: true })
        .limit(3)

      // Fetch user rewards count
      const { data: userRewards } = await supabase
        .from('user_rewards')
        .select('id')
        .eq('user_id', user.id)

      // Calculate stats
      const totalWaste = wasteLogs?.reduce((sum, log) => sum + log.amount, 0) || 0
      const completedPickups = await supabase
        .from('pickups')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'completed')

      setUserStats({
        totalPoints: profile?.total_points || 0,
        totalWaste: Number(totalWaste.toFixed(1)),
        pickupsCompleted: completedPickups.data?.length || 0,
        rewardsRedeemed: userRewards?.length || 0
      })

      setRecentWasteLogs(wasteLogs || [])
      setUpcomingPickups(pickups || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your waste management and environmental impact</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-[#1A7F3D]/10 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-[#1A7F3D]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.totalPoints}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Recycle className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Waste Collected</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.totalWaste}kg</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pickups Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.pickupsCompleted}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Gift className="h-4 w-4 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rewards Redeemed</p>
                  <p className="text-2xl font-bold text-gray-900">{userStats.rewardsRedeemed}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                  <p className="text-sm text-gray-600">Your latest waste logs</p>
                </div>
                <Link href="/dashboard/log-waste">
                  <Button variant="ghost" className="text-[#1A7F3D] text-sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Log Waste
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentWasteLogs.length > 0 ? recentWasteLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Recycle className="h-5 w-5 text-[#1A7F3D]" />
                    <div>
                      <div className="font-medium text-gray-900">{log.waste_type}</div>
                      <div className="text-sm text-gray-600">{log.amount}kg • {formatDate(log.created_at)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-[#1A7F3D]">+{log.points_earned} pts</div>
                  </div>
                </div>
              )) : (
                <div className="text-center text-gray-500 py-8">
                  <Recycle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No waste logs yet</p>
                  <Link href="/dashboard/log-waste">
                    <Button className="mt-2 bg-[#1A7F3D] hover:bg-[#1A7F3D]/90">Log Your First Waste</Button>
                  </Link>
                </div>
              )}
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
                <Link href="/dashboard/schedule">
                  <Button variant="ghost" className="text-[#1A7F3D] text-sm">
                    View All
                  </Button>
                </Link>
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
                        {formatDate(pickup.pickup_date)} • {pickup.pickup_time_start} - {pickup.pickup_time_end}
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
                  <Link href="/dashboard/schedule/new">
                    <Button className="mt-2 bg-[#1A7F3D] hover:bg-[#1A7F3D]/90">Schedule Pickup</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/log-waste">
                <Button className="w-full h-20 bg-[#1A7F3D] hover:bg-[#1A7F3D]/90 text-white flex flex-col items-center justify-center space-y-2">
                  <Plus className="h-6 w-6" />
                  <span>Log Waste</span>
                </Button>
              </Link>
              
              <Link href="/dashboard/schedule/new">
                <Button className="w-full h-20 bg-blue-600 hover:bg-blue-700 text-white flex flex-col items-center justify-center space-y-2">
                  <Calendar className="h-6 w-6" />
                  <span>Schedule Pickup</span>
                </Button>
              </Link>
              
              <Link href="/dashboard/rewards">
                <Button className="w-full h-20 bg-purple-600 hover:bg-purple-700 text-white flex flex-col items-center justify-center space-y-2">
                  <Gift className="h-6 w-6" />
                  <span>View Rewards</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
