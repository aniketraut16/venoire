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

export type SendOTPArgs = {
    email: string;
};

export type SendOTPResponse = {
    success: boolean;
    message: string;
    data?: {
        token: string;
        expiresIn: number;
    };
};

export type VerifyOTPArgs = {
    token: string;
    otp: string;
};

export type VerifyOTPResponse = {
    success: boolean;
    message: string;
    data?: {
        customToken: string;
        userExists: boolean;
        user?: DBUser;
        email?: string;
        uid?: string;
    };
};