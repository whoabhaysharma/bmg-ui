"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import Lottie from 'lottie-react';
import lottieData from './lifestyle_of_when_weighing_gym.json';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSendOtp = async () => {
    // Basic validation for phone number
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authAPI.sendOtp(phoneNumber);
      router.push(`/auth/verify-otp?phoneNumber=${phoneNumber}`);
      return;
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to send OTP';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-end font-sans overflow-hidden">
      {/* Lottie Animation */}
      <div className="absolute inset-0 flex items-center justify-center -mt-20 pointer-events-none">
        <div className="w-full max-w-lg">
          <Lottie animationData={lottieData} loop={true} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 text-transparent bg-clip-text">
            BookMyGyms
          </h1>
          <p className="text-gray-900 mt-2">Your gateway to ultimate fitness.</p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm p-3 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your 10-digit phone number"
              className="w-full"
              maxLength={10}
            />
          </div>

          <Button
            onClick={handleSendOtp}
            className="w-full flex items-center justify-center gap-3 py-3 px-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner className="w-5 h-5" />
                <span>Sending OTP...</span>
              </>
            ) : (
              <span>Continue with Phone Number</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}