"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { completeSignUpWithEmail } from "@/lib/services/auth/auth-post";
import { SignUpVerificationParams } from "@/lib/services/auth/models";

export default function CompleteSignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<SignUpVerificationParams>({
    code: "",
  });

  const [email, setEmail] = useState("");

  useEffect(() => {
    // Get email from URL params if available
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await completeSignUpWithEmail(formData);
      setSuccess(true);
    } catch (err) {
      setError(
        "Failed to verify account. Please check your verification code and try again."
      );
      console.error("Verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange =
    (field: "code" | "email") => (e: React.ChangeEvent<HTMLInputElement>) => {
      if (field === "code") {
        setFormData((prev) => ({
          ...prev,
          code: e.target.value,
        }));
      } else if (field === "email") {
        setEmail(e.target.value);
      }
    };

  if (success) {
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
        </div>

        {/* Logo */}
        <div className="absolute top-8 left-8 text-xl font-bold">
          CHeckIt<span className="text-emerald-600">.</span>
        </div>

        {/* Success Message */}
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg mx-4 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Account Verified!</h2>
            <p className="text-gray-600 mb-6">
              Your account has been successfully verified. You will be
              redirected to the dashboard shortly.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Verification Form */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg mx-4">
          <h2 className="text-2xl font-bold mb-1">Verify your account</h2>
          <p className="text-sm text-gray-600 mb-6">
            We've sent a verification code to your email address. Please enter
            it below to complete your registration.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                name="code"
                type="text"
                placeholder="Enter verification code"
                value={formData.code}
                onChange={handleInputChange("code")}
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
                  Verifying...
                </>
              ) : (
                "Verify Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{" "}
              <a href="#" className="text-emerald-600 hover:underline">
                Resend verification email
              </a>
            </p>
          </div>

          <div className="mt-4 text-center">
            <a
              href="/auth"
              className="text-sm text-emerald-600 hover:underline"
            >
              Back to Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
