import { DBUser, UserSignInArgs } from "@/types/user";
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