"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase/config";
import { useAuthStore } from "@/lib/store/authStore";
import { authAPI } from "@/lib/api/client";
import Button from "@/components/button";
import { Loader } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setToken, setLoading, setError, isLoading } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);
  const [gymName, setGymName] = useState("");

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setLocalError(null);
      setError(null);

      const result = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await result.user.getIdToken();

      const response = await authAPI.registerGymOwner(firebaseToken, { gymName });
      const { user: userData, token: jwtToken } = response.data;

      setUser(userData);
      setToken(jwtToken);
      router.push("/dashboard");
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Registration failed";
      setLocalError(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-end font-sans overflow-hidden">
      {/* Content section anchored to the bottom */}
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 space-y-8">
        {/* App Name and Tagline */}
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 text-transparent bg-clip-text">
            BookMyGyms
          </h1>
          <p className="text-gray-900 mt-2">Register your gym and reach more customers.</p>
        </div>

        {/* Gym Name Input */}
        <div className="space-y-4">
          <input
            type="text"
            value={gymName}
            onChange={(e) => setGymName(e.target.value)}
            placeholder="Enter your gym name"
            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />

          {localError && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm p-3 rounded-lg text-center">
              <p>{localError}</p>
            </div>
          )}

          <Button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 px-4"
            aria-label="Continue with Google"
            disabled={isLoading || !gymName.trim()}
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span className="text-sm">Registering...</span>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                  alt="Google logo"
                  className="w-5 h-5"
                />
                <span className="text-sm">Continue as Gym Owner</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}