import { Profile, UpdateProfileArgs } from "@/types/profile";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getProfile = async (token: string): Promise<Profile | null> => {
    try {
        const response = await axios.get(`${baseUrl}/user/profile`, { headers: { Authorization: `Bearer ${token}` } });
        return response.data.data as Profile;
    } catch (error) {
        console.error("Error getting profile:", error);
        return null;
        
    }
}

export const updateProfile = async (args: Partial<UpdateProfileArgs>, token: string): Promise<boolean> => {
    try {
        await axios.patch(`${baseUrl}/user/profile`, args, { headers: { Authorization: `Bearer ${token}` } });
        return true;
    } catch (error) {
        console.error("Error updating profile:", error);
        return false;
    }
}

export const updateProfileImage = async (image: File, token: string): Promise<boolean> => {
    try {
        const formData = new FormData();
        formData.append("image", image);
        await axios.post(`${baseUrl}/user/profile/image`, formData, { headers: { Authorization: `Bearer ${token}` } });
        return true;
    } catch (error) {
        console.error("Error updating profile image:", error);
        return false;
    }
}

export const deleteProfileImage = async (token: string): Promise<boolean> => {
    try {
        await axios.delete(`${baseUrl}/user/profile/image`, { headers: { Authorization: `Bearer ${token}` } });
        return true;
    } catch (error) {
        console.error("Error deleting profile image:", error);
        return false;
    }
}