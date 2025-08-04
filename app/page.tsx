"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Truck, Gift } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-[#1A7F3D]" />
            <span className="text-2xl font-bold text-[#1A7F3D]">Bioloop Hub</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/about" className="text-gray-600 hover:text-[#1A7F3D] transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#1A7F3D] transition-colors">
              Contact
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-[#1A7F3D] transition-colors">
              FAQ
            </Link>
            <Link href="/signin">
              <Button className="bg-[#1A7F3D] hover:bg-[#1A7F3D]/90 text-white">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight text-center lg:text-left">
                  Simplifying Waste Management,
                  <span className="text-[#1A7F3D]"> Rewarding Sustainability</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed text-center lg:text-left">
                  Log waste, schedule pickups, and earn rewards for keeping the environment clean.
                </p>
              </div>
              <div className="flex justify-center lg:justify-start">
                <Link href="/signin">
                  <Button size="lg" className="bg-[#1A7F3D] hover:bg-[#1A7F3D]/90 text-white px-8 py-3 text-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
            {/* Floating Animation */}
            <div className="relative flex justify-center order-1 lg:order-2 min-h-[400px]">
              <div className="absolute top-1/4 left-1/4 animate-float-slow w-32 h-32 bg-[#1A7F3D]/80 rounded-full blur-xl" />
              <div className="absolute top-1/2 left-2/3 animate-float-fast w-20 h-20 bg-white/95 rounded-full blur-lg" />
              <div className="absolute top-2/3 left-1/3 animate-float-medium w-16 h-16 bg-[#1A7F3D]/90 rounded-full blur-md" />
              <div className="absolute top-1/3 left-2/4 animate-float-medium w-24 h-24 bg-white/100 rounded-full blur-lg" />
              <div className="absolute top-2/4 left-1/2 animate-float-slow w-12 h-12 bg-[#1A7F3D]/80 rounded-full blur-md" />
              <style jsx>{`
                @keyframes float-slow {
                  0%, 100% { transform: translateY(0) scale(1); }
                  50% { transform: translateY(-30px) scale(1.05); }
                }
                @keyframes float-medium {
                  0%, 100% { transform: translateY(0) scale(1); }
                  50% { transform: translateY(-15px) scale(1.08); }
                }
                @keyframes float-fast {
                  0%, 100% { transform: translateY(0) scale(1); }
                  50% { transform: translateY(-40px) scale(0.95); }
                }
                .animate-float-slow { animation: float-slow 7s ease-in-out infinite; }
                .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
                .animate-float-fast { animation: float-fast 2.5s ease-in-out infinite; }
              `}</style>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Bioloop Hub?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform makes waste management simple, rewarding, and environmentally friendly.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-gray-100 hover:border-[#1A7F3D] transition-colors duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#1A7F3D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="h-8 w-8 text-[#1A7F3D]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Log Waste Easily</h3>
                <p className="text-gray-600">
                  Submit the type, weight, and photo of your waste quickly through our intuitive interface.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-[#1A7F3D] transition-colors duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#1A7F3D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="h-8 w-8 text-[#1A7F3D]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Schedule Pickup</h3>
                <p className="text-gray-600">
                  Book waste pickups at your convenience and track the status in real-time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-[#1A7F3D] transition-colors duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#1A7F3D]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Gift className="h-8 w-8 text-[#1A7F3D]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Earn Points & Rewards</h3>
                <p className="text-gray-600">Every pickup earns you points redeemable as cash, data, or airtime.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started with Bioloop Hub in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#1A7F3D] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 1: Sign Up</h3>
              <p className="text-gray-600">
                Create your free Bioloop Hub account and join our community of eco-conscious users.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#1A7F3D] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 2: Log Waste</h3>
              <p className="text-gray-600">
                Submit your waste details and request pickup through our easy-to-use platform.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#1A7F3D] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Step 3: Earn Rewards</h3>
              <p className="text-gray-600">
                Get points for every proper disposal and redeem them for valuable rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1A7F3D]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already earning rewards while protecting our environment.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-[#1A7F3D] hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-6 w-6 text-[#1A7F3D]" />
                <span className="text-xl font-bold">Bioloop Hub</span>
              </div>
              <p className="text-gray-400">Simplifying waste management and rewarding sustainability.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/signin" className="hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white transition-colors">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Bioloop Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
