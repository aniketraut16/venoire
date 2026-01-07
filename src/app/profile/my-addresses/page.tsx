"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { MapPin, Plus, Pencil, Trash2, Home, Building, MapPinned, ChevronLeft } from "lucide-react";
import { AddressType, CreateAddressArgs } from "@/types/address";
import { getAddresses, deleteAddress } from "@/utils/address";
import AddressForm from "@/components/Address/AddressForm";
import toast from "react-hot-toast";
import { useLoading } from "@/contexts/LoadingContext";

export default function MyAddresses() {
  const { token } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [showAddressForm, setShowAddressForm] = useState<null | {
    method: "create" | "update";
    addressId?: string;
    defaultValues?: CreateAddressArgs;
  }>(null);

  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
  }, [token, showAddressForm]);

  const fetchAddresses = async () => {
    if (!token) return;
    startLoading();
    const res = await getAddresses(token);
    if (res.success) {
      setAddresses(res.data || []);
    }
    stopLoading();
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!token) {
      toast.error("Authentication required");
      return;
    }
    const confirmed = window.confirm(
      "Are you sure you want to delete this address? This action cannot be undone."
    );
    if (!confirmed) return;

    startLoading();
    const res = await deleteAddress(addressId, token);
    if (res.success) {
      toast.success("Address deleted successfully");
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
    } else {
      toast.error(res.message || "Failed to delete address");
    }
    stopLoading();
  };

  const openCreateAddress = () => {
    setShowAddressForm({ method: "create" });
  };

  const openEditAddress = (addr: AddressType) => {
    const defaults: CreateAddressArgs = {
      address_line1: addr.address_line1,
      address_line2: addr.address_line2 || "",
      city: addr.city,
      postal_code: addr.postal_code,
      country: addr.country,
      state: addr.state || "",
      is_default: addr.is_default,
    };
    setShowAddressForm({ method: "update", addressId: addr.id, defaultValues: defaults });
  };

  return (
    <div className="bg-white lg:border lg:border-gray-200 p-4 md:p-8">
      <div className="max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 md:mb-8">
          <div className="flex items-start gap-3 flex-1">
            <button
              onClick={() => router.push("/profile")}
              className="lg:hidden p-2 hover:bg-gray-100 transition-colors duration-200 border border-gray-300 mt-0.5 shrink-0"
              aria-label="Back to profile"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-light tracking-wide uppercase">My Addresses</h2>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Manage your delivery addresses</p>
            </div>
          </div>
          <button
            onClick={openCreateAddress}
            className="flex items-center justify-center space-x-2 bg-black text-white px-4 md:px-6 py-2 md:py-3 hover:bg-gray-900 transition-colors duration-200 w-full sm:w-auto"
          >
            <Plus size={20} />
            <span className="text-sm font-medium tracking-wider uppercase">Add Address</span>
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-12 md:py-16 border-2 border-dashed border-gray-300">
            <MapPin size={48} className="mx-auto text-gray-300 mb-4 md:hidden" />
            <MapPin size={64} className="mx-auto text-gray-300 mb-4 hidden md:block" />
            <p className="text-gray-600 text-base md:text-lg mb-2">No addresses found</p>
            <p className="text-xs md:text-sm text-gray-400 mb-6 px-4">Add your first delivery address to get started</p>
            <button
              onClick={openCreateAddress}
              className="inline-flex items-center justify-center space-x-2 bg-black text-white px-4 md:px-6 py-2 md:py-3 hover:bg-gray-900 transition-colors duration-200 w-11/12 sm:w-auto"
            >
              <Plus size={20} />
              <span className="text-sm font-medium tracking-wider uppercase">Add Your First Address</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`border-2 p-4 md:p-6 transition-all duration-200 hover:shadow-lg relative ${
                  addr.is_default ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {addr.is_default && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-black text-white px-2 md:px-3 py-1 text-xs font-medium uppercase tracking-wider">
                      Default
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="p-2 bg-gray-100 border border-gray-200 shrink-0">
                      {addr.is_default ? (
                        <Home size={18} className="text-black md:w-5 md:h-5" />
                      ) : (
                        <Building size={18} className="text-gray-600 md:w-5 md:h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 text-base md:text-lg mb-1 break-words">{addr.address_line1}</h3>
                      {addr.address_line2 && (
                        <p className="text-xs md:text-sm text-gray-600 mb-1 break-words">{addr.address_line2}</p>
                      )}
                      <p className="text-xs md:text-sm text-gray-600">
                        {addr.city}, {addr.state} {addr.postal_code}
                      </p>
                      <p className="text-xs md:text-sm text-gray-600">{addr.country}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <MapPinned size={14} />
                    <span>Delivery Address</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditAddress(addr)}
                      className="flex-1 sm:flex-none p-2 border border-gray-300 hover:bg-gray-100 hover:border-black transition-colors duration-200 flex items-center gap-2 justify-center"
                      aria-label="Edit address"
                      title="Edit address"
                    >
                      <Pencil size={16} className="text-gray-700" />
                      <span className="md:hidden block text-sm font-medium tracking-wider uppercase">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="flex-1 sm:flex-none p-2 border border-gray-300 hover:bg-red-50 hover:border-red-500 transition-colors duration-200 flex items-center gap-2 justify-center"
                      aria-label="Delete address"
                      title="Delete address"
                    >
                      <Trash2 size={16} className="text-gray-700 hover:text-red-600" />
                      <span className="md:hidden block text-sm font-medium tracking-wider uppercase">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {addresses.length > 0 && (
          <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gray-50 border-l-4 border-black">
            <h4 className="text-xs md:text-sm font-medium text-gray-900 uppercase tracking-wider mb-2">
              Address Guidelines
            </h4>
            <ul className="text-xs md:text-sm text-gray-600 space-y-1">
              <li>• Ensure your address is complete with all required details</li>
              <li>• Set a default address for faster checkout</li>
              <li>• You can add multiple addresses for different locations</li>
              <li>• Default address will be pre-selected during checkout</li>
            </ul>
          </div>
        )}
      </div>

      {showAddressForm && (
        <AddressForm
          method={showAddressForm.method}
          addressId={showAddressForm.addressId}
          defaultValues={showAddressForm.defaultValues}
          onCancel={() => setShowAddressForm(null)}
        />
      )}
    </div>
  );
}
