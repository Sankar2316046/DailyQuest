"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import supabase from "@/lib/supabase";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get tokens from URL parameters
        const token_hash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (!token_hash || type !== 'signup') {
          throw new Error('Invalid verification link');
        }

        // Verify the email
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'signup',
        });

        if (error) throw error;

        // After successful verification, insert user data into users table
        if (data.user) {
          const userMetadata = data.user.user_metadata;
          const { error: insertError } = await supabase
            .from('users')
            .insert([{
              id: data.user.id,
              name: userMetadata?.name || 'User',
              email: data.user.email
            }]);

          if (insertError && !insertError.message.includes('duplicate key')) {
            console.error('Error inserting user data:', insertError);
            // Don't throw here as the verification succeeded
          }
        }

        setStatus('success');
        setMessage('Email verified successfully! Redirecting to dashboard...');

        // Redirect to landing page after successful verification
        setTimeout(() => {
          router.push('/landing');
        }, 2000);
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Failed to verify email. Please try again.');
      }
    };

    handleEmailVerification();
  }, [searchParams, router]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-600" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-8">
      <Card className="w-full max-w-md shadow-xl border border-muted/30">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {getStatusIcon()}
          </div>
          <CardTitle className={`text-2xl font-semibold tracking-tight ${getStatusColor()}`}>
            {status === 'loading' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {message}
          </p>

          {status === 'error' && (
            <div className="space-y-2">
              <button
                onClick={() => router.push('/signup')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Signing Up Again
              </button>
              <button
                onClick={() => router.push('/login')}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Go to Login
              </button>
            </div>
          )}

          {status === 'loading' && (
            <p className="text-sm text-muted-foreground">
              Please wait while we verify your email...
            </p>
          )}

          {status === 'success' && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Welcome to DailyQuest! You'll be redirected shortly.
              </p>
              <div className="flex justify-center">
                <div className="animate-pulse flex space-x-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-600 rounded-full animation-delay-200"></div>
                  <div className="w-2 h-2 bg-green-600 rounded-full animation-delay-400"></div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
