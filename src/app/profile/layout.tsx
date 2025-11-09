"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { User, ShoppingBag, MapPin, Heart, Star, LogOut } from "lucide-react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-45 pb-15">
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          <div className="w-80 bg-white border-r border-gray-200">
            <div className="p-8 border-b border-gray-200">
              <h1 className="text-3xl font-light tracking-wide uppercase">My Account</h1>
              <p className="text-gray-600 mt-2 text-sm">Manage your profile and preferences</p>
            </div>

            <nav className="p-4">
              {[
                { path: "/profile", label: "My Profile", icon: <User /> },
                { path: "/profile/my-orders", label: "My Orders", icon: <ShoppingBag /> },
                { path: "/profile/my-addresses", label: "My Addresses", icon: <MapPin /> },
                { path: "/profile/my-whishlist", label: "My Wishlist", icon: <Heart /> },
                { path: "/profile/my-review", label: "My Reviews", icon: <Star /> },
              ].map((tab) => (
                <button
                  key={tab.path}
                  className={`w-full text-left p-4 mb-2 transition-all duration-200 border border-transparent ${
                    isActive(tab.path)
                      ? "bg-black text-white border-black"
                      : "text-gray-700 hover:bg-gray-100 hover:border-gray-200"
                  }`}
                  onClick={() => router.push(tab.path)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{tab.icon}</span>
                    <span className="text-sm font-medium tracking-wide uppercase">{tab.label}</span>
                  </div>
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="w-full text-left p-4 mt-6 transition-all duration-200 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    <LogOut />
                  </span>
                  <span className="text-sm font-medium tracking-wide uppercase">Logout</span>
                </div>
              </button>
            </nav>

            <div className="p-8 mt-8 border-t border-gray-200">
              <div className="bg-gray-900 text-white p-6 text-center">
                <h3 className="text-sm font-medium tracking-wider uppercase mb-2">Need Help?</h3>
                <p className="text-xs text-gray-300 mb-4">Contact our support team</p>
                <p className="text-lg font-light">support@venoire.com</p>
              </div>
            </div>
          </div>

          <div className="flex-1 px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
