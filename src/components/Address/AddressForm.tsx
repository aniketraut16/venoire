"use client";
import { CreateAddressArgs } from '@/types/address';
import { createAddress, updateAddress } from '@/utils/address';
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import { Country, State, City } from 'country-state-city';

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
        country: 'India',
        state: '',
        is_default: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();
    
    const indiaCountryCode = 'IN';
    const [states, setStates] = useState<{ isoCode: string; name: string }[]>([]);
    const [cities, setCities] = useState<{ name: string }[]>([]);
    const [selectedStateCode, setSelectedStateCode] = useState<string>('');
    
    useEffect(() => {
        const indianStates = State.getStatesOfCountry(indiaCountryCode);
        setStates(indianStates);
        
        if (props.defaultValues?.state) {
            const matchedState = indianStates.find(s => s.name === props.defaultValues?.state);
            if (matchedState) {
                setSelectedStateCode(matchedState.isoCode);
                const stateCities = City.getCitiesOfState(indiaCountryCode, matchedState.isoCode);
                setCities(stateCities);
            }
        }
    }, []);
    
    useEffect(() => {
        if (selectedStateCode) {
            const stateCities = City.getCitiesOfState(indiaCountryCode, selectedStateCode);
            setCities(stateCities);
        } else {
            setCities([]);
        }
    }, [selectedStateCode]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, type, value } = e.target;
        const checked = 'checked' in e.target ? e.target.checked : false;
        
        if (name === 'state') {
            const selectedState = states.find(s => s.name === value);
            if (selectedState) {
                setSelectedStateCode(selectedState.isoCode);
                setFormData({ ...formData, state: value, city: '' });
            }
        } else {
            setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        }
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
            data-lenis-prevent="true"
            className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4"
            onClick={props.onCancel}
        >
            <div 
                className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-light tracking-wide uppercase text-black">
                            {props.method === 'create' ? 'Add New Address' : 'Update Address'}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {props.method === 'create' 
                                ? 'Fill in the details below to add a new delivery address' 
                                : 'Update your delivery address information'}
                        </p>
                    </div>
                    <button
                        onClick={props.onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
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
                            <label htmlFor="address_line1" className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                                Address Line 1 <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                id="address_line1"
                                name="address_line1"
                                value={formData.address_line1}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder-gray-400"
                                placeholder="Street address, P.O. box, company name"
                            />
                        </div>

                        {/* Address Line 2 */}
                        <div>
                            <label htmlFor="address_line2" className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                                Address Line 2
                            </label>
                            <input
                                type="text"
                                id="address_line2"
                                name="address_line2"
                                value={formData.address_line2}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder-gray-400"
                                placeholder="Apartment, suite, unit, building, floor, etc."
                            />
                        </div>

                        {/* Country and State */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="country" className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                                    Country <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value="India"
                                    readOnly
                                    className="w-full px-4 py-3 border border-gray-300 bg-gray-100 text-black cursor-not-allowed"
                                />
                            </div>
                            <div>
                                <label htmlFor="state" className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                                    State / Province <span className="text-red-600">*</span>
                                </label>
                                <select
                                    id="state"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors text-black bg-white"
                                >
                                    <option value="">Select State</option>
                                    {states.map((state) => (
                                        <option key={state.isoCode} value={state.name}>
                                            {state.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* City and Postal Code */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="city" className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                                    City <span className="text-red-600">*</span>
                                </label>
                                <select
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                    disabled={!selectedStateCode}
                                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors text-black bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">Select City</option>
                                    {cities.map((city) => (
                                        <option key={city.name} value={city.name}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="postal_code" className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                                    Postal Code <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="postal_code"
                                    name="postal_code"
                                    value={formData.postal_code}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder-gray-400"
                                    placeholder="ZIP / Postal code"
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
                                className="w-4 h-4 border border-gray-300 text-black focus:ring-2 focus:ring-black cursor-pointer"
                            />
                            <label htmlFor="is_default" className="text-sm font-medium text-gray-900 cursor-pointer">
                                Set as default address
                            </label>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={props.onCancel}
                            className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors uppercase tracking-wider text-sm font-medium"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="px-6 py-3 bg-black text-white hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 uppercase tracking-wider text-sm font-medium"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
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