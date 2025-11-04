"use client";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
export default function Profile() {
  const { logout } = useAuth();
  const router = useRouter();
  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-35">
        <div>Profile</div>
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}

        >
          Logout
        </button>
      </div>
    </>
  );
}
