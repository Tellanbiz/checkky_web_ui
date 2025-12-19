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
      const maybeRedirectDigest = (err as any)?.digest;
      if (
        typeof maybeRedirectDigest === "string" &&
        maybeRedirectDigest.startsWith("NEXT_REDIRECT")
      ) {
        throw err;
      }
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl w-[400px] mx-auto text-start">
        <h2 className="text-4xl font-bold mb-2">Checkky</h2>
        <p className=" text-gray-600 mb-8 text-sm">
          Please enter your email and password to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-left">
              Email address or ID number *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email or ID number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-left">
              Password *
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-emerald-600 hover:underline"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show Password"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <Label htmlFor="remember" className="text-sm">
                Remember for 30 days
              </Label>
            </div>
            <Link href="#" className="text-sm text-emerald-600 hover:underline">
              Forgot Password
            </Link>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-sm font-medium"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              "Continue to Account"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-8">
          Don't have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-emerald-600 hover:underline"
          >
            Sign up
          </Link>
        </p>

        <p className="text-center text-xs text-gray-500 mt-4">
          By continuing, you acknowledge that you have read and agree to our{" "}
          <a
            href="https://checkky.com/terms-of-service"
            className="text-emerald-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms and Conditions
          </a>
        </p>
      </div>
    </>
  );
}
