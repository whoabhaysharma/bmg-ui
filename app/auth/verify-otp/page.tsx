"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { useAuthStore } from '@/lib/store/authStore';
import { authAPI } from '@/lib/api/client';
import Lottie from 'lottie-react';
import lottieData from '../login/lifestyle_of_when_weighing_gym.json';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phoneNumber');
  const { setUser, setToken } = useAuthStore();

  useEffect(() => {
    if (!phoneNumber) {
      router.push('/auth/login');
    }
  }, [phoneNumber, router]);

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.verifyOtp(phoneNumber!, otp);
      const { user: userData, token: jwtToken } = response.data;

      localStorage.setItem('authUser', JSON.stringify(userData));
      localStorage.setItem('authToken', jwtToken);

      setUser(userData);
      setToken(jwtToken);

      const dashboardPath = ['OWNER', 'ADMIN'].includes(userData.role) ? '/admin/dashboard' : '/user/dashboard';
      router.push(dashboardPath);
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Failed to verify OTP';
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
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Verify Your Phone</h2>
          <p className="text-gray-600 mt-2">
            An OTP has been sent to <span className="font-semibold">{phoneNumber}</span>.
          </p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-300 text-sm p-3 rounded-lg text-center">
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter the 6-digit OTP"
              className="w-full text-center"
              maxLength={6}
            />
          </div>

          <Button
            onClick={handleVerifyOtp}
            className="w-full flex items-center justify-center gap-3 py-3 px-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner className="w-5 h-5" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Verify OTP</span>
            )}
          </Button>

          <div className="text-center">
            <Button variant="link" onClick={() => router.push('/auth/login')}>
              Go back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}