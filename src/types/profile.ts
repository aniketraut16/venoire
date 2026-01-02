import { BuyAgainItems, Order } from "./orders";

export type Profile = {
    id: string;
    email: string;
    uid: string;
    first_name: string;
    last_name: string;
    phone: string;
    profile_image_url: string | null;
    gender: 'male' | 'female' | 'other' | null;
    role: 'customer' | 'admin' | 'seller';
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type UpdateProfileArgs = {
    first_name: string;
    last_name: string;
    phone: string;
    gender: 'male' | 'female' | 'other';
}

export type UserOverview = {
    orders: Order[];
    buynowitems: BuyAgainItems[];
}