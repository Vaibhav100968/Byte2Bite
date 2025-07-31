import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="bg-zinc-900 py-12 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="footer-column">
            <h3 className="mb-4 text-lg font-semibold">Byte2Bite</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 transition-colors hover:text-orange-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 transition-colors hover:text-orange-500">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 transition-colors hover:text-orange-500">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="mb-4 text-lg font-semibold">For Restaurants</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/restaurant/partner" className="text-gray-300 transition-colors hover:text-orange-500">
                  Partner with us
                </Link>
              </li>
              <li>
                <Link href="/restaurant/dashboard" className="text-gray-300 transition-colors hover:text-orange-500">
                  Restaurant dashboard
                </Link>
              </li>
              <li>
                <Link href="/restaurant/marketing" className="text-gray-300 transition-colors hover:text-orange-500">
                  Marketing solutions
                </Link>
              </li>
              <li>
                <Link href="/restaurant/api" className="text-gray-300 transition-colors hover:text-orange-500">
                  Restaurant API
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="mb-4 text-lg font-semibold">For Customers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/signup" className="text-gray-300 transition-colors hover:text-orange-500">
                  Sign up
                </Link>
              </li>
              <li>
                <Link href="/payment" className="text-gray-300 transition-colors hover:text-orange-500">
                  Add payment method
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-gray-300 transition-colors hover:text-orange-500">
                  Order history
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-300 transition-colors hover:text-orange-500">
                  Help center
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="mb-4 text-lg font-semibold">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-300 transition-colors hover:text-orange-500">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 transition-colors hover:text-orange-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 transition-colors hover:text-orange-500">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-gray-300 transition-colors hover:text-orange-500">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p>&copy; 2025 Byte2Bite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

