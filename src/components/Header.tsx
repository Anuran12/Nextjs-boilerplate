"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import Logo from "@/assets/Logo2.svg";
import Insta from "@/assets/instagram.svg";
import Sidebar from "./Sidebar";
import { useSession } from "next-auth/react";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: session } = useSession();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className="flex justify-between items-center p-4 sm:p-6 md:p-8">
        <div className="flex items-center">
          <Link href="/">
            <Image src={Logo} alt="Logo" className="w-[55%] h-auto" />
          </Link>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="#" aria-label="Instagram">
            <Image src={Insta} alt="Instagram" className="w-8 h-8" />
          </Link>
          <button
            aria-label="Menu"
            className="text-white hover:text-[#F8623A] transition-colors"
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Show sidebar regardless of authentication status */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        session={session}
      />
    </>
  );
};

export default Header;
