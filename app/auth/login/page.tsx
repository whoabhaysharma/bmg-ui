"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/config";
import { useAuthStore } from "@/lib/store/authStore";
import { authAPI } from "@/lib/api/client";
import Button from "@/components/ui/button";
import Lottie from "lottie-react";
import lottieData from "./lifestyle_of_when_weighing_gym.json";
import { Spinner } from "@/components/ui/spinner"

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken, setLoading, setError, isLoading } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setLocalError(null);
      setError(null);

      const result = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await result.user.getIdToken();

      const response = await authAPI.loginWithGoogle(firebaseToken);
      const { user: userData, token: jwtToken } = response.data;

      // Save auth data to localStorage immediately
      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('authToken', jwtToken);

      // Update Zustand store
      setUser(userData);
      setToken(jwtToken);

      // Determine dashboard path based on role
      const dashboardPath = userData.role === 'OWNER' ? '/admin/dashboard' : '/user/dashboard';
      
      // Use setTimeout to ensure state is updated before redirect
      setTimeout(() => {
        router.push(dashboardPath);
      }, 100);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Login failed";
      setLocalError(message);
      setError(message);
    } finally {
      // Ensures loading state is turned off after success or failure
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-end font-sans overflow-hidden">
      {/* Lottie Animation as a visual centerpiece */}
      <div className="absolute inset-0 flex items-center justify-center -mt-20 pointer-events-none">
        <div className="w-full max-w-lg">
          <Lottie animationData={lottieData} loop={true} />
        </div>
      </div>

      {/* Content section anchored to the bottom */}
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 space-y-8">
        {/* App Name and Tagline */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 text-transparent bg-clip-text">
            BookMyGyms
          </h1>
          <p className="text-gray-900 mt-2">Your gateway to ultimate fitness.</p>
        </div>

        {/* Action Area: Error Message and Login Button */}
        <div className="space-y-4">
          {localError && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm p-3 rounded-lg text-center">
              <p>{localError}</p>
            </div>
          )}

          <Button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4"
            aria-label="Continue with Google"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner className="w-5 h-5" />
                <span className="text-sm">Signing in...</span>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                  alt="Google logo"
                  className="w-5 h-5"
                />
                <span className="text-sm">Continue with Google</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}