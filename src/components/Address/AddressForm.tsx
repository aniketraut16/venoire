"use client";
import { CreateAddressArgs } from '@/types/address';
import { createAddress, updateAddress } from '@/utils/address';
import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function AddressForm(props: {
    method: 'create' | 'update';
    addressId?: string;
    defaultValues?: CreateAddressArgs;
    onCancel: () => void;
}) {
    const [formData, setFormData] = useState<CreateAddressArgs>(props.defaultValues || {
        address_line1: '',
        address_line2: '',
        city: '',
        postal_code: '',
        country: '',
        state: '',
        is_default: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
    
    const handleSubmit = async () => {
        if (!token) {
            toast.error('Authentication required. Please log in again.');
            props.onCancel();
            return;
        }
        setIsLoading(true);
        
        if (props.method === 'create') {
            const success = await createAddress(formData, token);
            if (success.success) {
                toast.success('Address created successfully');
                props.onCancel();
            } else {
                toast.error(success.message);
            }
        } else if (props.method === 'update') {
            if (!props.addressId) {
                toast.error('Address ID is required');
                setIsLoading(false);
                return;
            }
            const success = await updateAddress(props.addressId, formData, token);
            if (success.success) {
                toast.success('Address updated successfully');
                props.onCancel();
            } else {
                toast.error(success.message);
            }
        }
        setIsLoading(false);
    }
    
    return (
        <div 
            className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
            onClick={props.onCancel}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-bold text-black">
                            {props.method === 'create' ? 'Add New Address' : 'Update Address'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {props.method === 'create' 
                                ? 'Fill in the details below to add a new delivery address' 
                                : 'Update your delivery address information'}
                        </p>
                    </div>
                    <button
                        onClick={props.onCancel}
                        className="text-gray-400 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-full"
                        type="button"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <div className="px-8 py-6">
                    <div className="space-y-6">
                        {/* Address Line 1 */}
                        <div>
                            <label htmlFor="address_line1" className="block text-sm font-semibold text-black mb-2">
                                Address Line 1 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="address_line1"
                                name="address_line1"
                                value={formData.address_line1}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black placeholder-gray-400"
                                placeholder="Street address, P.O. box, company name"
                            />
                        </div>

                        {/* Address Line 2 */}
                        <div>
                            <label htmlFor="address_line2" className="block text-sm font-semibold text-black mb-2">
                                Address Line 2
                            </label>
                            <input
                                type="text"
                                id="address_line2"
                                name="address_line2"
                                value={formData.address_line2}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black placeholder-gray-400"
                                placeholder="Apartment, suite, unit, building, floor, etc."
                            />
                        </div>

                        {/* City and Postal Code */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="city" className="block text-sm font-semibold text-black mb-2">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black placeholder-gray-400"
                                    placeholder="Enter city"
                                />
                            </div>
                            <div>
                                <label htmlFor="postal_code" className="block text-sm font-semibold text-black mb-2">
                                    Postal Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="postal_code"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black placeholder-gray-400"
                                    placeholder="ZIP / Postal code"
                                />
                            </div>
                        </div>

                        {/* State and Country */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="state" className="block text-sm font-semibold text-black mb-2">
                                    State / Province <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black placeholder-gray-400"
                                    placeholder="Enter state"
                                />
                            </div>
                            <div>
                                <label htmlFor="country" className="block text-sm font-semibold text-black mb-2">
                                    Country <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-black placeholder-gray-400"
                                    placeholder="Enter country"
                                />
                            </div>
                        </div>

                        {/* Default Address Checkbox */}
                        <div className="flex items-center space-x-3 pt-2">
                            <input
                                type="checkbox"
                                id="is_default"
                                name="is_default"
                                checked={formData.is_default}
                                onChange={handleChange}
                                className="w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-black focus:ring-offset-2 text-black cursor-pointer"
                            />
                            <label htmlFor="is_default" className="text-sm font-medium text-black cursor-pointer">
                                Set as default address
                            </label>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={props.onCancel}
                            className="px-6 py-3 border-2 border-gray-200 text-black font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    {props.method === 'create' ? 'Add Address' : 'Update Address'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}