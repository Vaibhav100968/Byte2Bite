import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-black">Byte</span>
                <span className="text-[#FF7F50]">2</span>
                <span className="text-black">Bite</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/about"
              className="text-gray-700 hover:text-[#FF7F50] px-3 py-2 rounded-md text-sm font-medium"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-[#FF7F50] px-3 py-2 rounded-md text-sm font-medium"
            >
              Contact
            </Link>
            <Link
              href="/business/login"
              className="bg-[#FF7F50] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#FF6B3D]"
            >
              Login for Businesses
            </Link>
            <Link
              href="/customer/login"
              className="bg-[#FF7F50] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#FF6B3D]"
            >
              Login for Customers
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
