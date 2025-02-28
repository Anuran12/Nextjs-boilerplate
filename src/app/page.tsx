import Link from "next/link";
import { Menu } from "lucide-react";

// Components
import UserProfile from "../components/UserProfile";
import OfferCard from "../components/OfferCard";
import ServiceCard from "../components/ServiceCard";
import Image from "next/image";
import Logo from "@/assets/Logo2.svg";
import Insta from "@/assets/instagram.svg";

// Import offer images
import offer1 from "@/assets/offers/offer1.png";
import offer2 from "@/assets/offers/offer2.png";
import offer3 from "@/assets/offers/offer3.png";

// Import service images
import service1 from "@/assets/services/service1.png"; // CAR WASH
import service2 from "@/assets/services/service2.png"; // POLISHING
import service3 from "@/assets/services/service3.png"; // PPF
import service4 from "@/assets/services/service4.png"; // WRAPS
import service5 from "@/assets/services/service5.png"; // DEEP INTERIOR
import service6 from "@/assets/services/service6.png"; // PAINTING

export default function Home() {
  return (
    <div className="bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 sm:p-6 md:p-8">
        <div className="flex items-center">
          <Image src={Logo} alt="Logo" className="w-[55%] h-auto" />
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="#" aria-label="Instagram">
            <Image src={Insta} alt="Instagram" className="w-8 h-8" />
          </Link>
          <button aria-label="Menu" className="text-white">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <main className="px-4 pb-8 sm:px-6 md:px-8 lg:pb-12">
        {/* User Profile - Centered on larger screens */}
        <div className="md:flex md:justify-center">
          <div className="md:w-4/5 lg:w-3/5">
            <UserProfile
              name="Anmol Choudhury"
              vehicle="Tata Nexon"
              vehicleId="KA01MBG578"
              imageUrl="/Logo.png"
            />
          </div>
        </div>

        {/* Offers Section - More columns on larger screens */}
        <section className="mt-8 md:mt-12 lg:mt-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 lg:mb-8 md:text-center">
            Offers
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 md:grid-cols-4 lg:grid-cols-6 md:max-w-4xl md:mx-auto">
            <OfferCard imageUrl={offer1} />
            <OfferCard imageUrl={offer2} />
            <OfferCard imageUrl={offer3} />
          </div>
        </section>

        {/* Services Section - More columns on larger screens */}
        <section className="mt-8 md:mt-12 lg:mt-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 lg:mb-8 md:text-center">
            Services
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6 md:grid-cols-3 lg:grid-cols-4 md:max-w-4xl md:mx-auto">
            <ServiceCard title="CAR WASH" imageUrl={service1} />
            <ServiceCard title="POLISHING" imageUrl={service2} />
            <ServiceCard title="PPF" imageUrl={service3} />
            <ServiceCard title="WRAPS" imageUrl={service4} />
            <ServiceCard title="DEEP INTERIOR" imageUrl={service5} />
            <ServiceCard title="PAINTING" imageUrl={service6} />
          </div>
        </section>

        {/* Footer Section */}
        <footer className="mt-12 py-8 border-t border-gray-800">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">HOPPING CARS</h3>
            <p className="text-gray-400 mb-6">Premium car care services</p>
            <div className="flex justify-center gap-6 mb-6">
              <Link href="#" className="text-white hover:text-green-500">
                About
              </Link>
              <Link href="#" className="text-white hover:text-green-500">
                Services
              </Link>
              <Link href="#" className="text-white hover:text-green-500">
                Contact
              </Link>
            </div>
            <p className="text-sm text-gray-600">
              © 2023 HOPPING CARS. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
