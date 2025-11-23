"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { signUpWithEmail } from "@/lib/services/auth/auth-post";
import { SignUpParams } from "@/lib/services/auth/models";
import { encryptData } from "@/lib/utils/encryption";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<SignUpParams>({
    email: "",
    password: "",
    repassword: "",
    full_name: "",
  });
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (!formData.full_name.trim()) {
      setError("Full name is required");
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    if (!formData.repassword) {
      setError("Please confirm your password");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.repassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions");
      setIsLoading(false);
      return;
    }

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
    <div className="min-h-screen flex items-center justify-center bg-white">
      {/* Sign Up Form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg mx-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="repassword">Confirm Password</Label>
                <Input
                  id="repassword"
                  name="repassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.repassword}
                  onChange={handleInputChange("repassword")}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreeToTerms}
                onCheckedChange={(checked) =>
                  setAgreeToTerms(checked as boolean)
                }
              />
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <a
                  href="https://checkky.com/terms-of-service"
                  className="text-emerald-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms and Conditions
                </a>
              </Label>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <Button
              type="submit"
              disabled={isLoading || !agreeToTerms}
              className="w-full"
            >
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
            By creating an account, you acknowledge that you have read and agree
            to our{" "}
            <a
              href="https://checkky.com/terms-of-service"
              className="text-emerald-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms and Conditions
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
