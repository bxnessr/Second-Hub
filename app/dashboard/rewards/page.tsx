import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Smartphone, Wifi, DollarSign } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"

export default function RewardsPage() {
  const totalPoints = 0
  const minPointsRequired = 10000

  const rewardOptions = [
    {
      type: "Airtime",
      icon: Smartphone,
      description: "Mobile airtime credit",
      pointsRequired: 10000,
      value: "$10",
    },
    {
      type: "Data",
      icon: Wifi,
      description: "Mobile data bundle",
      pointsRequired: 15000,
      value: "5GB",
    },
    {
      type: "Cash",
      icon: DollarSign,
      description: "Cash withdrawal",
      pointsRequired: 20000,
      value: "$20",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rewards</h1>
          <p className="text-gray-600 mt-2">Redeem your points for valuable rewards.</p>
        </div>

        {/* Points Balance */}
        <Card className="bg-gradient-to-r from-[#1A7F3D] to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Total Points</h2>
                <div className="flex items-center space-x-2">
                  <Star className="h-8 w-8" />
                  <span className="text-4xl font-bold">{totalPoints.toLocaleString()}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-100">Minimum for redemption</p>
                <p className="text-xl font-semibold">{minPointsRequired.toLocaleString()} points</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reward Options */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Redeem Options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {rewardOptions.map((reward) => {
              const Icon = reward.icon
              const canRedeem = totalPoints >= reward.pointsRequired

              return (
                <Card key={reward.type} className={`${canRedeem ? "border-[#1A7F3D]" : "border-gray-200"}`}>
                  <CardHeader className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                        canRedeem ? "bg-[#1A7F3D]/10" : "bg-gray-100"
                      }`}
                    >
                      <Icon className={`h-8 w-8 ${canRedeem ? "text-[#1A7F3D]" : "text-gray-400"}`} />
                    </div>
                    <CardTitle className="text-lg">{reward.type}</CardTitle>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-[#1A7F3D]">{reward.value}</p>
                      <p className="text-sm text-gray-500">{reward.pointsRequired.toLocaleString()} points</p>
                    </div>
                    <Button
                      className={`w-full ${
                        canRedeem
                          ? "bg-[#1A7F3D] hover:bg-[#1A7F3D]/90 text-white"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!canRedeem}
                    >
                      {canRedeem ? "Redeem" : "Not Enough Points"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* How to Earn More Points */}
        <Card>
          <CardHeader>
            <CardTitle>How to Earn More Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#1A7F3D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#1A7F3D] font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Log Waste Regularly</h4>
                  <p className="text-sm text-gray-600">Earn 100 points per kg of waste logged</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#1A7F3D]/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#1A7F3D] font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Complete Pickups</h4>
                  <p className="text-sm text-gray-600">Bonus 500 points for each successful pickup</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
