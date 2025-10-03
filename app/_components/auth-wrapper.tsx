"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "../backend/services/auth.service";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertTriangle } from "lucide-react";

interface AuthWrapperProps {
  children: React.ReactNode;
  requireEmailVerification?: boolean;
}

export default function AuthWrapper({
  children,
  requireEmailVerification = true
}: AuthWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authService = new AuthService();
      const userId = await authService.getCurrentUserId();

      if (!userId) {
        setError("Please log in to access this page");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        return;
      }

      // Check if user exists in database (basic check)
      if (requireEmailVerification) {
        const userEmail = await authService.getCurrentUserEmail();
        if (!userEmail) {
          setError("Account verification required");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
          return;
        }
      }

      setIsAuthenticated(true);
    } catch (err) {
      console.error("Auth check failed:", err);
      setError("Authentication failed. Please log in again.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <p className="text-muted-foreground">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md border-destructive/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertTriangle className="w-8 h-8 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-red-600">
              Authentication Required
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {error}
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to login page...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
