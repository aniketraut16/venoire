"use client";

import { Suspense, useState, useEffect } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "@/contexts/AuthContext";
import {
    useRouter,
    useSearchParams
} from "next/navigation";
import { useLoading } from "@/contexts/LoadingContext";

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const { startLoading, stopLoading } = useLoading();
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { user, login, register, loginWithGoogle, resetPassword, needsCompleteSetup } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                alert("Password reset email sent. Check your inbox.");
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
        if (redirectUrl) {
            router.push(redirectUrl);
            return;
        }
        router.push(needsCompleteSetup ? "/complete-profile" : "/");
    }, [user, needsCompleteSetup, redirectUrl, router]);

    return (
        <div className="min-h-screen relative flex items-center justify-center px-4 pt-45 pb-15 bg-gray-100">

            <div className="max-w-md w-full bg-white shadow-xl p-8 z-10 backdrop-blur-sm">

                {isResettingPassword ? (
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">RESET PASSWORD</h1>
                ) : (
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">{isLogin ? "WELCOME BACK" : "CREATE ACCOUNT"}</h1>
                )}

                {error && <div className="bg-red-50 text-red-500 p-3 mb-4">{error}</div>}

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

                {!isResettingPassword && (
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