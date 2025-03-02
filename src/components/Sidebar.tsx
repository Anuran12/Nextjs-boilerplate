"use client";
import { FC } from "react";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import Link from "next/link";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  session: Session | null;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose, session }) => {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#1A1919] z-50 transform transition-transform duration-300 ease-in-out shadow-lg ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">Menu</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-[#F8623A] transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-4">
              <li>
                <Link
                  href="/"
                  className="block py-2 px-4 text-white hover:bg-[#F8623A]/10 hover:text-[#F8623A] rounded-lg transition-colors"
                  onClick={onClose}
                >
                  Home
                </Link>
              </li>
              {session && (
                <li>
                  <Link
                    href="/profile"
                    className="block py-2 px-4 text-white hover:bg-[#F8623A]/10 hover:text-[#F8623A] rounded-lg transition-colors"
                    onClick={onClose}
                  >
                    Profile
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/services"
                  className="block py-2 px-4 text-white hover:bg-[#F8623A]/10 hover:text-[#F8623A] rounded-lg transition-colors"
                  onClick={onClose}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/offers"
                  className="block py-2 px-4 text-white hover:bg-[#F8623A]/10 hover:text-[#F8623A] rounded-lg transition-colors"
                  onClick={onClose}
                >
                  Offers
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="block py-2 px-4 text-white hover:bg-[#F8623A]/10 hover:text-[#F8623A] rounded-lg transition-colors"
                  onClick={onClose}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="block py-2 px-4 text-white hover:bg-[#F8623A]/10 hover:text-[#F8623A] rounded-lg transition-colors"
                  onClick={onClose}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          {/* Authentication buttons */}
          <div className="p-4 border-t border-white/10">
            {session ? (
              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 bg-[#F8623A] text-white rounded-lg hover:bg-[#F8623A]/80 transition-colors"
              >
                Logout
              </button>
            ) : (
              <div className="space-y-2 flex flex-col gap-2">
                <Link href="/login" onClick={onClose}>
                  <button className="w-full py-2 px-4 bg-[#F8623A] text-white rounded-lg hover:bg-[#F8623A]/80 transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/signup" onClick={onClose}>
                  <button className="w-full py-2 px-4 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
