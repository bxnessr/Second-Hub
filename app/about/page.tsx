import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Leaf, Users, Target, Award } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-[#1A7F3D]" />
            <span className="text-2xl font-bold text-[#1A7F3D]">Bioloop Hub</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-[#1A7F3D] transition-colors">
              Home
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#1A7F3D] transition-colors">
              Contact
            </Link>
            <Link href="/faq" className="text-gray-600 hover:text-[#1A7F3D] transition-colors">
              FAQ
            </Link>
            <Link href="/signin">
              <Button className="bg-[#1A7F3D] hover:bg-[#1A7F3D]/90 text-white">Sign In</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">About Bioloop Hub</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bioloop Hub is committed to reducing environmental impact by connecting users to a seamless waste management
            and reward system. We believe that sustainability should be rewarding, accessible, and simple for everyone.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To revolutionize waste management by making it convenient, rewarding, and environmentally responsible.
                We empower individuals and communities to take active roles in protecting our planet while earning
                tangible rewards for their efforts.
              </p>
              <p className="text-lg text-gray-600">
                Through innovative technology and strategic partnerships, we're building a sustainable future where
                waste becomes a resource and environmental consciousness is incentivized.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="text-center p-6">
                <Users className="h-12 w-12 text-[#1A7F3D] mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Community Driven</h3>
                <p className="text-sm text-gray-600">Building a network of environmentally conscious users</p>
              </Card>
              <Card className="text-center p-6">
                <Target className="h-12 w-12 text-[#1A7F3D] mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Goal Oriented</h3>
                <p className="text-sm text-gray-600">Focused on measurable environmental impact</p>
              </Card>
              <Card className="text-center p-6">
                <Award className="h-12 w-12 text-[#1A7F3D] mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Reward Based</h3>
                <p className="text-sm text-gray-600">Incentivizing sustainable behavior through rewards</p>
              </Card>
              <Card className="text-center p-6">
                <Leaf className="h-12 w-12 text-[#1A7F3D] mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Eco Friendly</h3>
                <p className="text-sm text-gray-600">Committed to environmental sustainability</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Make a Difference</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform connects waste generators with collection services while rewarding sustainable behavior.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#1A7F3D] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Logging</h3>
              <p className="text-gray-600">
                Users easily log their waste with photos and details, creating a comprehensive database of waste
                generation patterns.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#1A7F3D] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Efficient Collection</h3>
              <p className="text-gray-600">
                Our network of collection partners ensures timely and proper disposal of waste, optimizing routes and
                reducing environmental impact.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#1A7F3D] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Meaningful Rewards</h3>
              <p className="text-gray-600">
                Points earned through proper waste management can be redeemed for cash, airtime, data, and other
                valuable rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1A7F3D]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Join Our Mission</h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Be part of the solution. Start earning rewards while making a positive impact on the environment.
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
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
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
