"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { User, Camera, Edit2, Save, X, ShoppingBag, MapPin, Heart, Star, LogOut } from "lucide-react";
import { getProfile, updateProfile, updateProfileImage, deleteProfileImage, getUserOverview } from "@/utils/profile";
import { Profile } from "@/types/profile";
import { useLoading } from "@/contexts/LoadingContext";
import { BuyAgainItems, Order } from "@/types/orders";

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

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [buyNowItems, setBuyNowItems] = useState<BuyAgainItems[]>([]);


  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async (
    profile:boolean = true,
    orders:boolean = true,
  ) => {
    if (!token) return;
    startLoading();
    
    // Fetch profile
    if(profile){
    const profileData = await getProfile(token);
    if (profileData) {
      setProfile(profileData);
    }
    }

    // Fetch orders
    if(orders){
    const usersummary = await getUserOverview(token);
    if (usersummary) {
      setRecentOrders(usersummary.orders);
      setBuyNowItems(usersummary.buynowitems);
    }
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
      await fetchData(true, false);
      setIsEditing(false);
    }
    stopLoading();
  };

  const handleDeleteImage = async () => {
    if (!token) return;
    startLoading();
    const success = await deleteProfileImage(token);
    if (success) {
      await fetchData(true, false);
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

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return "text-green-700 bg-green-50 border-green-200";
      case "shipped":
        return "text-blue-700 bg-blue-50 border-blue-200";
      case "processing":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "cancelled":
        return "text-red-700 bg-red-50 border-red-200";
      case "refunded":
        return "text-purple-700 bg-purple-50 border-purple-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Mobile View */}
        <div className="lg:hidden">
          {!isEditing ? (
            <div>
              {/* Compact User Info Strip */}
              <div className="bg-white border-b border-gray-200">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full border border-gray-300 overflow-hidden bg-gray-100 shrink-0">
                      {profile?.profile_image_url ? (
                        <img
                          src={profile.profile_image_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User size={24} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-sm font-medium text-gray-900 truncate">
                        {profile?.first_name} {profile?.last_name}
                      </h2>
                      <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="ml-3 shrink-0 text-xs font-medium text-black border border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors"
                  >
                    EDIT
                  </button>
                </div>
                <div className="px-4 pb-3">
                  <button
                    onClick={handleLogout}
                    className="w-full text-xs font-medium text-gray-600 border border-gray-300 px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    LOGOUT
                  </button>
                </div>
              </div>

              {/* Recent Orders Section */}
              <div className="p-4 border-b-8 border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Recent Orders</h3>
                  <button
                    onClick={() => router.push("/profile/my-orders")}
                    className="text-xs text-gray-600 hover:text-black"
                  >
                    View All
                  </button>
                </div>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-sm text-gray-500">No orders yet</div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="border border-gray-200 bg-white">
                        <div className="p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500">Order #{order.order_number}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.created_at)}</p>
                            </div>
                            <span
                              className={`text-xs font-semibold px-2 py-1 border uppercase ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <div key={idx} className="w-10 h-10 border border-gray-200 bg-gray-50 shrink-0">
                                <img
                                  src={item.thumbnail_url}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {order.items_count > 2 && (
                              <span className="text-xs text-gray-500">+{order.items_count - 2} more</span>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <span className="text-sm font-semibold text-gray-900">₹{order.total_amount}</span>
                            <button
                              onClick={() => router.push(`/profile/order?orderId=${order.id}`)}
                              className="text-xs font-medium text-black hover:underline"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Buy Again Section */}
              {buyNowItems.length > 0 && (
                <div className="p-4 border-b-8 border-gray-100">
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Buy Again</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {buyNowItems.slice(0, 4).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => router.push(`/product/${item.slug}`)}
                        className="border border-gray-200 bg-white hover:border-black transition-colors text-left"
                      >
                        <div className="aspect-square bg-gray-50">
                          <img
                            src={item.thumbnail_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-xs text-gray-900 line-clamp-2">{item.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Links */}
              <div className="p-4">
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-3">Quick Links</h3>
                <div className="grid grid-cols-2 gap-3">
                  {navigationCircles.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => router.push(item.path)}
                      className="flex flex-col items-center justify-center p-4 border border-gray-300 bg-white hover:border-black transition-colors"
                    >
                      <div className="mb-2 text-black">{item.icon}</div>
                      <span className="text-xs font-medium text-black uppercase tracking-wide text-center">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="mb-6">
                <h2 className="text-lg font-medium uppercase mb-4">Edit Profile</h2>
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
                    <label className="cursor-pointer bg-black text-white px-4 py-2 text-xs hover:bg-gray-900 transition-colors">
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
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile?.email || ""}
                      disabled
                      className="w-full border border-gray-300 px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center justify-center space-x-2 bg-black text-white px-6 py-2.5 hover:bg-gray-900 text-sm"
                    >
                      <Save size={16} />
                      <span className="font-medium tracking-wider uppercase">Save</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-2.5 hover:bg-gray-50 text-sm"
                    >
                      <X size={16} />
                      <span className="font-medium tracking-wider uppercase">Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block p-8">
          {!isEditing ? (
            <>
              {/* Compact User Info Strip */}
              <div className="border-b border-gray-200 pb-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full border border-gray-300 overflow-hidden bg-gray-100 shrink-0">
                      {profile?.profile_image_url ? (
                        <img
                          src={profile.profile_image_url}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User size={32} className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">
                        {profile?.first_name} {profile?.last_name}
                      </h2>
                      <p className="text-sm text-gray-600">{profile?.email}</p>
                      <p className="text-sm text-gray-600">{profile?.phone || "No phone"}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-black text-white px-5 py-2 hover:bg-gray-900 transition-colors text-sm"
                  >
                    <Edit2 size={16} />
                    <span className="font-medium tracking-wider uppercase">Edit Profile</span>
                  </button>
                </div>
              </div>

              {/* Recent Orders Section */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Recent Orders</h3>
                  <button
                    onClick={() => router.push("/profile/my-orders")}
                    className="text-sm text-gray-600 hover:text-black font-medium"
                  >
                    View All Orders
                  </button>
                </div>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-12 border border-gray-200 text-gray-500">No orders yet</div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.slice(0, 5).map((order) => (
                      <div key={order.id} className="border border-gray-200 bg-white hover:border-gray-400 transition-colors">
                        <div className="p-4">
                          <div className="flex items-center justify-between gap-4 mb-3">
                            <div className="flex items-center gap-6 flex-1">
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Order</p>
                                <p className="text-sm font-medium text-gray-900">#{order.order_number}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                                <p className="text-sm text-gray-900">{formatDate(order.created_at)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
                                <p className="text-sm font-semibold text-gray-900">₹{order.total_amount}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`text-xs font-bold px-3 py-1.5 border uppercase tracking-wide ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </span>
                              <button
                                onClick={() => router.push(`/profile/order?orderId=${order.id}`)}
                                className="text-sm font-medium text-black hover:underline whitespace-nowrap"
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                            {order.items.slice(0, 4).map((item, idx) => (
                              <div key={idx} className="w-12 h-12 border border-gray-200 bg-gray-50 shrink-0">
                                <img
                                  src={item.thumbnail_url}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                            {order.items_count > 4 && (
                              <span className="text-sm text-gray-500 ml-1">+{order.items_count - 4} more items</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Buy Again Section */}
              {buyNowItems.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Buy Again</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {buyNowItems.slice(0, 4).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => router.push(`/product/${item.slug}`)}
                        className="border border-gray-200 bg-white hover:border-black transition-colors text-left"
                      >
                        <div className="aspect-square bg-gray-50">
                          <img
                            src={item.thumbnail_url}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-sm text-gray-900 line-clamp-2">{item.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div>
              <h2 className="text-xl font-medium uppercase mb-6">Edit Profile</h2>
              <div className="flex items-start space-x-8">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 mb-4">
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
                    <label className="cursor-pointer bg-black text-white px-4 py-2 text-xs hover:bg-gray-900 transition-colors">
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

                <div className="flex-1 max-w-xl">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile?.email || ""}
                        disabled
                        className="w-full border border-gray-300 px-3 py-2 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center space-x-2 bg-black text-white px-6 py-2.5 hover:bg-gray-900 text-sm"
                      >
                        <Save size={16} />
                        <span className="font-medium tracking-wider uppercase">Save Changes</span>
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-2.5 hover:bg-gray-50 text-sm"
                      >
                        <X size={16} />
                        <span className="font-medium tracking-wider uppercase">Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
