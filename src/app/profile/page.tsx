"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { User, Camera, Edit2, Save, X, ShoppingBag, MapPin, Heart, Star, LogOut } from "lucide-react";
import { getProfile, updateProfile, updateProfileImage, deleteProfileImage } from "@/utils/profile";
import { Profile } from "@/types/profile";
import { useLoading } from "@/contexts/LoadingContext";

export default function MyProfilePage() {
  const { token, logout } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    gender: "male" as "male" | "female" | "other",
  });

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const fetchProfile = async () => {
    if (!token) return;
    startLoading();
    const data = await getProfile(token);
    if (data) {
      setProfile(data);
      setFormData({
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
        gender: data.gender || "male",
      });
    }
    stopLoading();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!token) return;
    startLoading();

    if (imageFile) {
      await updateProfileImage(imageFile, token);
      setImageFile(null);
      setImagePreview(null);
    }

    const success = await updateProfile(formData, token);
    if (success) {
      await fetchProfile();
      setIsEditing(false);
    }
    stopLoading();
  };

  const handleDeleteImage = async () => {
    if (!token) return;
    startLoading();
    const success = await deleteProfileImage(token);
    if (success) {
      await fetchProfile();
    }
    stopLoading();
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        gender: profile.gender || "male",
      });
    }
    setImageFile(null);
    setImagePreview(null);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const navigationCircles = [
    { path: "/profile/my-orders", label: "My Orders", icon: <ShoppingBag size={28} /> },
    { path: "/profile/my-addresses", label: "My Addresses", icon: <MapPin size={28} /> },
    { path: "/profile/my-whishlist", label: "My Wishlist", icon: <Heart size={28} /> },
    { path: "/profile/my-review", label: "My Reviews", icon: <Star size={28} /> },
  ];

  return (
    <div className="bg-white lg:border lg:border-gray-200 p-0 lg:p-8">
      <div className="max-w-3xl">
        {/* Mobile View */}
        <div className="lg:hidden">
          {!isEditing ? (
            <div>
              <div className="bg-white p-4 border-b border-gray-200">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 flex-shrink-0">
                    {profile?.profile_image_url ? (
                      <img
                        src={profile.profile_image_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={40} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-medium text-gray-900 truncate">
                      {profile?.first_name} {profile?.last_name}
                    </h2>
                    <p className="text-sm text-gray-600 truncate">{profile?.email}</p>
                    <p className="text-sm text-gray-600 mt-1">{profile?.phone || "No phone"}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center space-x-2 bg-black text-white px-4 py-3 hover:bg-gray-900 transition-colors duration-200"
                >
                  <Edit2 size={18} />
                  <span className="text-sm font-medium tracking-wider uppercase">Edit</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center space-x-2 border-2 border-red-600 text-red-600 px-4 py-3 hover:bg-red-600 hover:text-white transition-colors duration-200"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium tracking-wider uppercase">Logout</span>
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Quick Access</h3>
                <div className="grid grid-cols-2 gap-4">
                  {navigationCircles.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => router.push(item.path)}
                      className="flex flex-col items-center justify-center p-6 border-2 border-gray-300 bg-white hover:border-black hover:shadow-lg transition-all duration-200 aspect-square"
                    >
                      <div className="mb-3 text-black">{item.icon}</div>
                      <span className="text-xs font-medium text-black uppercase tracking-wide text-center">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="bg-gray-50 p-4 border-l-4 border-black">
                  <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                    Account Info
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-gray-900 font-medium">
                        {profile?.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="text-gray-900 font-medium capitalize">
                        {profile?.gender || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span className="text-gray-900 font-medium">
                        {profile?.created_at
                          ? new Date(profile.created_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                            })
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="mb-6">
                <h2 className="text-xl font-light tracking-wide uppercase mb-4">Edit Profile</h2>
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 mb-4">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : profile?.profile_image_url ? (
                      <img src={profile.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <label className="cursor-pointer bg-gray-900 text-white px-4 py-2 text-xs hover:bg-black transition-colors">
                      <Camera size={14} className="inline mr-2" />
                      <span className="uppercase tracking-wider">Change</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    {(profile?.profile_image_url || imagePreview) && (
                      <button
                        onClick={handleDeleteImage}
                        className="bg-red-600 text-white px-4 py-2 text-xs hover:bg-red-700 transition-colors uppercase tracking-wider"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile?.email || ""}
                      disabled
                      className="w-full border border-gray-300 px-4 py-3 bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center justify-center space-x-2 bg-black text-white px-6 py-3 hover:bg-gray-900"
                    >
                      <Save size={16} />
                      <span className="text-sm font-medium tracking-wider uppercase">Save Changes</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 hover:bg-gray-100"
                    >
                      <X size={16} />
                      <span className="text-sm font-medium tracking-wider uppercase">Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop View (unchanged) */}
        <div className="hidden lg:block">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 md:mb-8 gap-4">
            <h2 className="text-xl md:text-2xl font-light tracking-wide uppercase">My Profile</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center space-x-2 bg-black text-white px-4 md:px-6 py-2 hover:bg-gray-900 transition-colors duration-200 w-full sm:w-auto"
              >
                <Edit2 size={16} />
                <span className="text-sm font-medium tracking-wider uppercase">Edit</span>
              </button>
            )}
          </div>

          <div className="mb-6 md:mb-8 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
            <div className="relative flex flex-col items-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile Preview" width={128} height={128} className="w-full h-full object-cover" />
                ) : profile?.profile_image_url ? (
                  <img src={profile.profile_image_url} alt="Profile" width={128} height={128} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <label className="cursor-pointer bg-gray-900 text-white px-4 py-2 text-xs hover:bg-black transition-colors duration-200 flex items-center justify-center space-x-2">
                    <Camera size={14} />
                    <span className="uppercase tracking-wider">Change</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {(profile?.profile_image_url || imagePreview) && (
                    <button
                      onClick={handleDeleteImage}
                      className="bg-red-600 text-white px-4 py-2 text-xs hover:bg-red-700 transition-colors duration-200 uppercase tracking-wider"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1">
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                    <p className="text-gray-900">{profile?.first_name} {profile?.last_name}</p>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email Address</p>
                    <p className="text-gray-900">{profile?.email}</p>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="text-gray-900">{profile?.phone || "Not provided"}</p>
                  </div>
                  <div className="border-b border-gray-200 pb-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Gender</p>
                    <p className="text-gray-900 capitalize">{profile?.gender || "Not specified"}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">First Name</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">Last Name</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none transition-colors duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profile?.email || ""}
                      disabled
                      className="w-full border border-gray-300 px-4 py-3 bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none transition-colors duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-900 uppercase tracking-wider mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-4 py-3 focus:border-black focus:outline-none transition-colors duration-200"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center justify-center space-x-2 bg-black text-white px-6 py-3 hover:bg-gray-900 transition-colors duration-200 disabled:bg-gray-400"
                    >
                      <Save size={16} />
                      <span className="text-sm font-medium tracking-wider uppercase">Save Changes</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <X size={16} />
                      <span className="text-sm font-medium tracking-wider uppercase">Cancel</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200">
              <h3 className="text-sm font-medium tracking-wider uppercase text-gray-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 border-l-2 border-black">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Account Status</p>
                  <p className="text-gray-900">{profile?.is_active ? "Active" : "Inactive"}</p>
                </div>
                <div className="bg-gray-50 p-4 border-l-2 border-black">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Member Since</p>
                  <p className="text-gray-900 text-sm md:text-base">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
