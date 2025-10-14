// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { AuthService } from "../backend/services/auth.service";

// interface LoginFormData {
//   email: string;
//   password: string;
// }

// const LoginForm = () => {
//   const [formData, setFormData] = useState<LoginFormData>({
//     email: "",
//     password: "",
//   });

//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       if (!formData.email) throw new Error("Email is required");
//       if (!formData.password) throw new Error("Password is required");

//       const authService = new AuthService();
//       await authService.login(formData.email, formData.password);

//       console.log("Login successful!");
//       router.push("/landing");
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred during login");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-8">
//       <Card className="w-full max-w-md shadow-xl border border-muted/30 animate-fade-in">
//         <CardHeader className="text-center space-y-1">
//           <CardTitle className="text-2xl font-semibold tracking-tight">
//             Welcome back
//           </CardTitle>
//           <p className="text-sm text-muted-foreground">
//             Enter your email and password to login
//           </p>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="example@domain.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className="focus-visible:ring-2 focus-visible:ring-primary"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 name="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>

//             <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
              
//               Login
//             </Button>

//             {error && (
//               <p className="text-sm text-red-500 text-center">{error}</p>
//             )}
//           </form>
//         </CardContent>
//       </Card>
//     </div>
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService } from "../backend/services/auth.service";
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

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
      if (!formData.password) throw new Error("Password is required");

      const authService = new AuthService();
      await authService.login(formData.email, formData.password);

      console.log("Login successful!");
      router.push("/landing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Decorative blurred blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-300/30 blur-3xl" />

      <Card
        className="w-full max-w-md border border-gray-200 bg-white shadow-lg rounded-2xl animate-fade-in"
      >
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 grid place-items-center shadow-md">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-gray-900">Welcome back</CardTitle>
          <p className="text-sm text-gray-600">Sign in to continue to DailyQuest</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-white text-gray-900 placeholder:text-gray-400 border-gray-300 focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 bg-white text-gray-900 placeholder:text-gray-400 border-gray-300 focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white hover:from-fuchsia-500 hover:to-violet-500 transition-all shadow-lg hover:shadow-fuchsia-600/25 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Logging in...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Login
                </span>
              )}
            </Button>

            {/* Error */}
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div>Forgot password?</div>
              <div className="text-gray-600">Need an account? <span className="text-purple-600">Sign up</span></div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
