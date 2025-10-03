"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthService } from "../backend/services/auth.service";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import EmailVerificationModal from "./email-verification-modal";
import supabase from "@/lib/supabase"; 

interface SignUpFormData {
  password: string;
  confirmPassword: string;
  email: string;
  name: string;
}

const SignUpForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    password: "",
    confirmPassword: "",
    email: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    try {
      if (!formData.email) throw new Error("Email is required");
      if (formData.password.length < 8)
        throw new Error("Password must be at least 8 characters");
      if (formData.password !== formData.confirmPassword)
        throw new Error("Passwords do not match");
  
      const authService = new AuthService();
      const { user } = await authService.signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
  
      console.log("User signed up successfully!", user);

      // Show verification modal instead of redirecting
      setShowVerificationModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: formData.email,
    });

    if (error) throw error;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-8">
      <Card className="w-full max-w-md shadow-xl border border-muted/30 animate-fade-in">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Create your account
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign up to get started
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div> 
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@domain.com"
                value={formData.email}
                onChange={handleChange}
                className="focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading}
              
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Sign Up
            </Button>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </form>
        </CardContent>
      </Card>

      <EmailVerificationModal
        isOpen={showVerificationModal}
        email={formData.email}
        onClose={() => {
          setShowVerificationModal(false);
          // Optionally redirect to login page or keep them here
          // router.push("/login");
        }}
        onResendEmail={handleResendEmail}
      />
    </div>
  );
};

export default SignUpForm;
