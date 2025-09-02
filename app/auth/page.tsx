"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signInWithEmail } from "@/lib/services/auth/auth-post";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmail(new FormData(e.currentTarget));
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#f3f3fa] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute left-[10%] top-[30%]">
          <div className="relative">
            <div className="w-[300px] h-[150px] bg-white opacity-50 rounded-[50px] rotate-[20deg]"></div>
            <div className="absolute top-[20px] left-[70px] w-[160px] h-[20px] bg-emerald-600 rounded-full"></div>
            <div className="absolute top-[50px] right-[70px] w-[20px] h-[20px] bg-emerald-600 rounded-full"></div>
            <div className="absolute bottom-[30px] right-[80px] w-[20px] h-[20px] bg-emerald-600 rounded-full"></div>
          </div>
        </div>

        {/* Stylized map with ship */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-70">
          <div className="w-full h-full bg-[#f3f3fa]">
            <div className="relative w-full h-full">
              {/* World map silhouette */}
              <div className="absolute inset-0 bg-[#eeeef8] rounded-full scale-150 translate-y-[30%]"></div>

              {/* Location dots */}
              <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-emerald-600 rounded-full"></div>
              <div className="absolute top-1/3 right-1/3 w-4 h-4 bg-emerald-600 rounded-full"></div>
              <div className="absolute bottom-1/4 left-1/5 w-4 h-4 bg-emerald-600 rounded-full"></div>
              <div className="absolute right-[10%] bottom-[40%] w-4 h-4 bg-emerald-600 rounded-full"></div>

              {/* Ship silhouette */}
              <div className="absolute top-[45%] left-[40%] w-[100px] h-[30px] bg-[#333] rounded-md"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-8 text-xl font-bold">
        CHeckIt<span className="text-emerald-600">.</span>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg mx-4">
          <h2 className="text-2xl font-bold mb-1">Sign in to CheckIt</h2>
          <p className="text-sm text-gray-600 mb-6">
            New here?{" "}
            <Link
              href="/auth/signup"
              className="text-emerald-600 hover:underline"
            >
              Create an account
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </Button>
              </div>
              <div className="flex justify-end">
                <Link
                  href="#"
                  className="text-sm text-emerald-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-sm text-gray-500">OR</span>
              </div>
            </div>

            <Button type="button" variant="outline" className="w-full">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Sign in with Google
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-8">
            By continuing, you agree to our{" "}
            <Link href="#" className="text-emerald-600 hover:underline">
              Terms and Conditions
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
