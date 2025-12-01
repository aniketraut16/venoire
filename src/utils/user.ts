import { DBUser, UserSignInArgs, SendOTPArgs, SendOTPResponse, VerifyOTPArgs, VerifyOTPResponse } from "@/types/user";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;


export const signIn = async (args: UserSignInArgs , token: string): Promise<Boolean> => {
  try {
    await axios.post(`${baseUrl}/user`, args, { headers: { Authorization: `Bearer ${token}` } });
    return true;
  } catch (error) {
    console.error("Error signing in:", error);
    return false;
  }
};

export const CheckUserExists = async (token: string): Promise<DBUser | null> => {
  try {
    const response = await axios.get(`${baseUrl}/user`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data.data as DBUser;
  } catch (error) {
    console.error("Error checking user exists:", error);
    return null;
  }
};

export const sendOTP = async (args: SendOTPArgs): Promise<SendOTPResponse> => {
  try {
    const response = await axios.post(`${baseUrl}/user/send-otp`, args);
    return response.data as SendOTPResponse;
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to send OTP"
    };
  }
};

export const verifyOTP = async (args: VerifyOTPArgs): Promise<VerifyOTPResponse> => {
  try {
    const response = await axios.post(`${baseUrl}/user/verify-otp`, args);
    return response.data as VerifyOTPResponse;
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to verify OTP"
    };
  }
};