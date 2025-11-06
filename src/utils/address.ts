import { AddressType, CreateAddressArgs } from "@/types/address";
import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const createAddress = async (
  args: CreateAddressArgs,
  token: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    await axios.post(`${baseUrl}/address`, args, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, message: "Address created successfully" };
  } catch (error: any) {
    console.error("Error creating address:", error);
    return { success: false, message: error.message as string };
  }
};

export const getAddresses = async (
  token: string
): Promise<{
  success: boolean;
  data: AddressType[];
}> => {
  try {
    const response = await axios.get(`${baseUrl}/address`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as {
      success: boolean;
      data: AddressType[];
    };
  } catch (error: any) {
    console.error("Error getting addresses:", error);
    return { success: false, data: [] };
  }
};

export const updateAddress = async (
  addressId: string,
  args: CreateAddressArgs,
  token: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    await axios.put(`${baseUrl}/address/${addressId}`, args, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, message: "Address updated successfully" };
  } catch (error: any) {
    console.error("Error updating address:", error);
    return { success: false, message: error.message as string };
  }
};

export const deleteAddress = async (
  addressId: string,
  token: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    await axios.delete(`${baseUrl}/address/${addressId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { success: true, message: "Address deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting address:", error);
    return { success: false, message: error.message as string };
  }
};
