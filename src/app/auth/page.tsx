"use client";

import { Suspense, useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import {
    useRouter,
    useSearchParams
} from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";
import { sendOTP, verifyOTP } from "@/utils/user";
import toast from "react-hot-toast";

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const { startLoading, stopLoading } = useLoading();
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    // OTP related states
    const [isOTPMode, setIsOTPMode] = useState(false);
    const [isOTPFlow, setIsOTPFlow] = useState(false); // Track if user selected OTP flow
    const [otpToken, setOtpToken] = useState("");
    const [otp, setOtp] = useState("");
    const [otpTimer, setOtpTimer] = useState(0);

    const authContext = useAuth();
    const { user, login, register, loginWithGoogle, loginWithOTP, resetPassword, needsCompleteSetup } = authContext;
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // OTP Timer
    useEffect(() => {
        if (otpTimer > 0) {
            const interval = setInterval(() => {
                setOtpTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [otpTimer]);

    const handleSendOTP = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError("");
        
        if (!email) {
            setError("Please enter your email address");
            return;
        }

        startLoading();
        try {
            const response = await sendOTP({ email });
            
            if (response.success && response.data) {
                setOtpToken(response.data.token);
                setIsOTPMode(true);
                setOtpTimer(300); // 5 minutes
            } else {
                setError(response.message || "Failed to send OTP");
            }
        } catch (err: any) {
            setError(err.message || "Failed to send OTP");
        } finally {
            stopLoading();
        }
    };

    const handleStartOTPFlow = () => {
        // Toggle between OTP flow and Email/Password flow
        if (isOTPFlow) {
            // Switch back to Email/Password
            setIsOTPFlow(false);
            setIsOTPMode(false);
            setOtp("");
            setOtpToken("");
            setOtpTimer(0);
        } else {
            // Switch to OTP flow
            setIsOTPFlow(true);
            setIsLogin(true);
            setIsResettingPassword(false);
            setPassword("");
            setName("");
        }
        setError("");
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!otp || otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        startLoading();
        try {
            const response = await verifyOTP({ token: otpToken, otp });

            if (response.success && response.data) {
                if (loginWithOTP && typeof loginWithOTP === 'function') {
                    await loginWithOTP(response.data.customToken);
                } else {
                    console.error('loginWithOTP is not available:', authContext);
                    setError("Authentication method not available. Please try again.");
                }
            } else {
                setError(response.message || "Invalid OTP");
            }
        } catch (err: any) {
            console.error("OTP verification error:", err);
            setError(err.message || "Failed to verify OTP");
        } finally {
            stopLoading();
        }
    };

    const handleResendOTP = async () => {
        setError("");
        startLoading();
        
        try {
            const response = await sendOTP({ email });
            
            if (response.success && response.data) {
                setOtpToken(response.data.token);
                setOtpTimer(300);
                setOtp("");
                toast.success("New OTP sent to your email.");
            } else {
                setError(response.message || "Failed to resend OTP");
            }
        } catch (err: any) {
            setError(err.message || "Failed to resend OTP");
        } finally {
            stopLoading();
        }
    };

    const handleBackFromOTP = () => {
        setIsOTPMode(false);
        setIsOTPFlow(false);
        setOtp("");
        setOtpToken("");
        setOtpTimer(0);
        setError("");
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        startLoading();

        try {
            if (isResettingPassword) {
                await resetPassword(email);
                stopLoading();
                setIsResettingPassword(false);
                toast.success("Password reset email sent. Check your inbox.");
                return;
            }

            if (isLogin) {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
            // Defer routing to the effect that watches user/needsCompleteSetup
            stopLoading();
        } catch (err: any) {
            stopLoading();
            setError(err.message || "Authentication failed");
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        startLoading();

        try {
            await loginWithGoogle();
            // Defer routing to the effect that watches user/needsCompleteSetup
            stopLoading();
        } catch (err: any) {
            stopLoading();
            setError(err.message || "Google login failed");
        }
    };

    useEffect(() => {
        if (!user) return;

        if(needsCompleteSetup){
            router.push("/complete-profile" + (redirectUrl ? `?redirect=${redirectUrl}` : ""));
            return;
        }
        if (redirectUrl) {
            router.push(redirectUrl);
        } else {
            router.push("/");
        }
    }, [user, needsCompleteSetup, redirectUrl, router]);

    return (
        <div className="min-h-screen relative flex items-center justify-center px-4 pt-45 pb-15 bg-gray-100">

            <div className="max-w-md w-full bg-white shadow-xl p-8 z-10 backdrop-blur-sm">

                {isOTPMode ? (
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">VERIFY OTP</h1>
                ) : isResettingPassword ? (
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">RESET PASSWORD</h1>
                ) : isOTPFlow ? (
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">SIGN IN WITH OTP</h1>
                ) : (
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">{isLogin ? "WELCOME BACK" : "CREATE ACCOUNT"}</h1>
                )}

                {error && <div className="bg-red-50 text-red-500 p-3 mb-4">{error}</div>}

                {isOTPMode ? (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <div className="text-center mb-6">
                            <p className="text-gray-600 mb-2">
                                We've sent a 6-digit code to
                            </p>
                            <p className="font-semibold text-gray-800">{email}</p>
                            {otpTimer > 0 && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Code expires in {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="otp" className="block text-gray-700 mb-1">Enter OTP</label>
                            <input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full pl-4 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 text-center text-2xl tracking-widest"
                                placeholder="000000"
                                maxLength={6}
                                required
                                onFocus={(e) => e.target.select()}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors shadow-md"
                        >
                            Verify OTP
                        </button>

                        <div className="text-center mt-4">
                            {otpTimer > 0 ? (
                                <p className="text-sm text-gray-600">
                                    Didn't receive the code?{" "}
                                    <span className="text-gray-400">Resend in {otpTimer}s</span>
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    className="text-amber-500 hover:underline text-sm font-medium"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>

                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={handleBackFromOTP}
                                className="text-gray-800 hover:underline text-sm font-medium"
                            >
                                Back to login
                            </button>
                        </div>
                    </form>
                ) : isOTPFlow && !isOTPMode ? (
                    <form onSubmit={handleSendOTP} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-4 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">We'll send a 6-digit code to your email</p>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors shadow-md"
                        >
                            Send OTP
                        </button>

                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={() => setIsOTPFlow(false)}
                                className="text-gray-800 hover:underline text-sm font-medium"
                            >
                                Back to Email/Password
                            </button>
                        </div>
                    </form>
                ) : (
                <form onSubmit={handleAuth} className="space-y-4">
                    {!isLogin && !isResettingPassword && (
                        <div>
                            <label htmlFor="name" className="block text-gray-700 mb-1">Name</label>
                            <div className="relative">

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-4 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    placeholder="Your full name"
                                    required={!isLogin}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                        <div className="relative">

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-4 pr-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                placeholder="Your email address"
                                required
                            />
                        </div>
                    </div>

                    {!isResettingPassword && (
                        <div>
                            <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
                            <div className="relative">

                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-4 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    placeholder="Your password"
                                    required={!isResettingPassword}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="text-gray-400" />
                                    ) : (
                                        <FiEye className="text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors shadow-md"
                    >
                        {isResettingPassword ? (
                            "Send Reset Link"
                        ) : isLogin ? (
                            "Login"
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>
                )}

                {!isResettingPassword && !isOTPMode && (
                    <>
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button
                                    onClick={handleGoogleLogin}
                                    className="w-full flex items-center justify-center bg-white border border-gray-300 py-3 px-4 hover:bg-gray-50 shadow-sm"
                                >
                                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                            <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                            <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                        </g>
                                    </svg>
                                    Sign in with Google
                                </button>

                                <button
                                    onClick={handleStartOTPFlow}
                                    type="button"
                                    className="w-full flex items-center justify-center bg-white border border-gray-300 py-3 px-4 hover:bg-gray-50 shadow-sm mt-3"
                                >
                                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {isOTPFlow ? "Sign in with Email/Password" : "Sign in with Email OTP"}
                                </button>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            {isLogin ? (
                                <p className="text-gray-600">
                                    Don't have an account?{" "}
                                    <button
                                        onClick={() => setIsLogin(false)}
                                        className="text-amber-500 hover:underline font-medium"
                                    >
                                        Sign up
                                    </button>
                                </p>
                            ) : (
                                <p className="text-gray-600">
                                    Already have an account?{" "}
                                    <button
                                        onClick={() => setIsLogin(true)}
                                        className="text-amber-500 hover:underline font-medium"
                                    >
                                        Login
                                    </button>
                                </p>
                            )}
                        </div>
                    </>
                )}

                {!isOTPMode && (
                <div className="mt-4 text-center">
                    {isResettingPassword ? (
                        <button
                            onClick={() => setIsResettingPassword(false)}
                            className="text-amber-500 hover:underline text-sm font-medium"
                        >
                            Back to login
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsResettingPassword(true)}
                            className="text-gray-800 hover:underline text-sm font-medium"
                        >
                            Forgot password?
                        </button>
                    )}
                </div>
                )}
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <Login />
        </Suspense>
    );
}