import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Leaf } from "lucide-react"
import Link from "next/link"

const faqItems = [
  {
    question: "How do I earn points?",
    answer:
      "You earn points by logging waste and scheduling pickups. Each kilogram of waste logged earns you 100 points, and completing a successful pickup gives you a bonus of 500 points. The more you participate in proper waste management, the more points you accumulate.",
  },
  {
    question: "What can I redeem points for?",
    answer:
      "You can redeem points for airtime, data, or cash after accumulating 10,000 points. Airtime costs 10,000 points ($10 value), data bundles cost 15,000 points (5GB), and cash withdrawal requires 20,000 points ($20 value).",
  },
  {
    question: "Is Bioloop Hub free to use?",
    answer:
      "Yes, Bioloop Hub is completely free for users to log waste and schedule pickups. There are no subscription fees or hidden charges. You only benefit from using our platform through the rewards you earn.",
  },
  {
    question: "How does the pickup service work?",
    answer:
      "Once you log your waste, you can schedule a pickup at your convenience. Our collection partners will arrive within a 2-hour window around your selected time. You'll receive SMS confirmations and can track the status of your pickup in real-time.",
  },
  {
    question: "What types of waste can I log?",
    answer:
      "You can log various types of waste including plastic, paper, organic waste, metal, and electronics. Each type is properly categorized to ensure appropriate disposal and recycling methods are used.",
  },
  {
    question: "How long does it take to receive rewards?",
    answer:
      "Points are credited to your account immediately after successful waste logging and pickup completion. Reward redemption (airtime, data, cash) typically processes within 24-48 hours after your request.",
  },
  {
    question: "Is my personal information secure?",
    answer:
      "Yes, we take data security seriously. All personal information is encrypted and stored securely. We only collect information necessary for service delivery and never share your data with third parties without your consent.",
  },
  {
    question: "Can I cancel a scheduled pickup?",
    answer:
      "Yes, you can cancel or reschedule a pickup up to 2 hours before the scheduled time through your dashboard. This helps us optimize our collection routes and serve other users efficiently.",
  },
]

export default function FAQPage() {
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
            <Link href="/about" className="text-gray-600 hover:text-[#1A7F3D] transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#1A7F3D] transition-colors">
              Contact
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
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about Bioloop Hub and how our waste management platform works.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Accordion type="single" collapsible className="space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-[#1A7F3D]">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-4">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-[#1A7F3D] hover:bg-[#1A7F3D]/90 text-white px-8 py-3 text-lg">
              Contact Support
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
