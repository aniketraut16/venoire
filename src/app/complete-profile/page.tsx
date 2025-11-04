"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { signIn } from "@/utils/user";
import { UserSignInArgs } from "@/types/user";

export default function CompleteProfile() {
    const { user, token, needsCompleteSetup } = useAuth();
    const router = useRouter();
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [countryCode, setCountryCode] = useState("+91");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const countryCodes = [
        { code: "+91", country: "India" },
        { code: "+1", country: "USA/Canada" },
        { code: "+44", country: "UK" },
        { code: "+61", country: "Australia" },
        { code: "+49", country: "Germany" },
        { code: "+33", country: "France" },
        { code: "+81", country: "Japan" },
        { code: "+86", country: "China" },
        { code: "+971", country: "UAE" },
        { code: "+65", country: "Singapore" },
        { code: "+92", country: "Pakistan" },
        { code: "+880", country: "Bangladesh" },
    ];

    useEffect(() => {
        if (user && !needsCompleteSetup) {
            router.push("/");
        }
        if (!user) {
            router.push("/auth");
        }
    }, [user, needsCompleteSetup, router]);

    const validateForm = (): string | null => {
        if (!firstName.trim()) {
            return "First name is required.";
        }
        if (firstName.trim().length < 2) {
            return "First name must be at least 2 characters long.";
        }
        if (!/^[a-zA-Z\s]+$/.test(firstName.trim())) {
            return "First name can only contain letters and spaces.";
        }

        if (!lastName.trim()) {
            return "Last name is required.";
        }
        if (lastName.trim().length < 2) {
            return "Last name must be at least 2 characters long.";
        }
        if (!/^[a-zA-Z\s]+$/.test(lastName.trim())) {
            return "Last name can only contain letters and spaces.";
        }

        if (!phoneNumber.trim()) {
            return "Phone number is required.";
        }
        if (!/^\d{10,15}$/.test(phoneNumber.trim())) {
            return "Phone number must be 10-15 digits.";
        }

        if (!gender) {
            return "Gender is required.";
        }

        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!user || !token) {
            setError("Authentication required. Please log in again.");
            return;
        }

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const fullPhoneNumber = `${countryCode}${phoneNumber.trim()}`;
            const userData: UserSignInArgs = {
                email: user.email || "",
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                phone: fullPhoneNumber,
                gender: gender,
            };

            const success = await signIn(userData, token);
            
            if (success) {
                window.location.href = "/";
            } else {
                setError("Failed to complete profile. Please try again.");
            }
        } catch (err: any) {
            setError(err.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center px-4 pt-45 pb-15 bg-gray-100">
            <div className="max-w-md w-full bg-white shadow-xl p-8 z-10 backdrop-blur-sm">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">COMPLETE YOUR PROFILE</h1>

                {error && <div className="bg-red-50 text-red-500 p-3 mb-4 rounded">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                value={user.email || ""}
                                className="w-full pl-4 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-100"
                                placeholder="Your email address"
                                disabled
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="firstName" className="block text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input
                                id="firstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full pl-4 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                placeholder="Enter your first name"
                                required
                                minLength={2}
                                pattern="[a-zA-Z\s]+"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <input
                                id="lastName"
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full pl-4 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                placeholder="Enter your last name"
                                required
                                minLength={2}
                                pattern="[a-zA-Z\s]+"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                        <div className="flex gap-2">
                            <div className="relative w-32">
                                <select
                                    id="countryCode"
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                    className="w-full pl-4 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
                                    required
                                >
                                    {countryCodes.map((item) => (
                                        <option key={item.code} value={item.code}>
                                            {item.code}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="relative flex-1">
                                <input
                                    id="phoneNumber"
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                                    className="w-full pl-4 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    placeholder="Enter phone number"
                                    required
                                    minLength={10}
                                    maxLength={15}
                                    pattern="\d{10,15}"
                                />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Enter 10-15 digits without spaces or special characters</p>
                    </div>

                    <div>
                        <label htmlFor="gender" className="block text-gray-700 mb-1">Gender <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <select
                                id="gender"
                                value={gender || ""}
                                onChange={(e) => setGender(e.target.value ? (e.target.value as 'male' | 'female' | 'other') : null)}
                                className="w-full pl-4 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                required
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors shadow-md"
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            "Complete Profile"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
