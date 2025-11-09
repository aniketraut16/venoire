"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Plus, Pencil, Trash2, Home, Building, MapPinned } from "lucide-react";
import { AddressType, CreateAddressArgs } from "@/types/address";
import { getAddresses, deleteAddress } from "@/utils/address";
import AddressForm from "@/components/Address/AddressForm";
import toast from "react-hot-toast";
import { useLoading } from "@/contexts/LoadingContext";

export default function MyAddresses() {
  const { token } = useAuth();
  const { startLoading, stopLoading } = useLoading();
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
    <div className="bg-white border border-gray-200 p-8">
      <div className="max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-light tracking-wide uppercase">My Addresses</h2>
            <p className="text-sm text-gray-600 mt-1">Manage your delivery addresses</p>
          </div>
          <button
            onClick={openCreateAddress}
            className="flex items-center space-x-2 bg-black text-white px-6 py-3 hover:bg-gray-900 transition-colors duration-200"
          >
            <Plus size={20} />
            <span className="text-sm font-medium tracking-wider uppercase">Add Address</span>
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-300">
            <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg mb-2">No addresses found</p>
            <p className="text-sm text-gray-400 mb-6">Add your first delivery address to get started</p>
            <button
              onClick={openCreateAddress}
              className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 hover:bg-gray-900 transition-colors duration-200"
            >
              <Plus size={20} />
              <span className="text-sm font-medium tracking-wider uppercase">Add Your First Address</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`border-2 p-6 transition-all duration-200 hover:shadow-lg relative ${
                  addr.is_default ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {addr.is_default && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-black text-white px-3 py-1 text-xs font-medium uppercase tracking-wider">
                      Default
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className="p-2 bg-gray-100 border border-gray-200">
                      {addr.is_default ? (
                        <Home size={20} className="text-black" />
                      ) : (
                        <Building size={20} className="text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-lg mb-1">{addr.address_line1}</h3>
                      {addr.address_line2 && (
                        <p className="text-sm text-gray-600 mb-1">{addr.address_line2}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {addr.city}, {addr.state} {addr.postal_code}
                      </p>
                      <p className="text-sm text-gray-600">{addr.country}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <MapPinned size={14} />
                    <span>Delivery Address</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditAddress(addr)}
                      className="p-2 border border-gray-300 hover:bg-gray-100 hover:border-black transition-colors duration-200"
                      aria-label="Edit address"
                      title="Edit address"
                    >
                      <Pencil size={16} className="text-gray-700" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="p-2 border border-gray-300 hover:bg-red-50 hover:border-red-500 transition-colors duration-200"
                      aria-label="Delete address"
                      title="Delete address"
                    >
                      <Trash2 size={16} className="text-gray-700 hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {addresses.length > 0 && (
          <div className="mt-8 p-6 bg-gray-50 border-l-4 border-black">
            <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-2">
              Address Guidelines
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
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
