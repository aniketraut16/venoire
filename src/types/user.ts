export type DBUser = {
    id: string;
    email: string;
    uid: string;
    first_name: string;
    last_name: string;
    phone: string;
    profile_image_url: string | null;
    gender: 'male' | 'female' | 'other' | null;
};

export type UserSignInArgs = {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    gender: 'male' | 'female' | 'other' | null;
};
