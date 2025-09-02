"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { signUpWithEmail } from "@/lib/services/auth/auth-post";
import { SignUpParams } from "@/lib/services/auth/models";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<SignUpParams>({
    email: "",
    password: "",
    full_name: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signUpWithEmail(formData);
    } catch (err) {
      setError("Failed to create account. Please try again.");
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (field: keyof SignUpParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
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

      {/* Sign Up Form */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg mx-4">
          <h2 className="text-2xl font-bold mb-1">Create your account</h2>
          <p className="text-sm text-gray-600 mb-6">
            Already have an account?{" "}
            <a href="/auth" className="text-emerald-600 hover:underline">
              Sign in
            </a>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleInputChange("full_name")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleInputChange("email")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange("password")}
                required
              />
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
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-8">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              Terms and Conditions
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
