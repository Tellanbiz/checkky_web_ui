"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  completeSignUpWithEmail,
  signUpWithEmail,
} from "@/lib/services/auth/auth-post";
import {
  SignUpVerificationParams,
  SignUpParams,
} from "@/lib/services/auth/models";
import { decryptData } from "@/lib/utils/encryption";

function CompleteSignUpContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<SignUpVerificationParams>({
    code: "",
  });

  const [email, setEmail] = useState("");
  const [signUpData, setSignUpData] = useState<SignUpParams | null>(null);

  useEffect(() => {
    // Get encrypted data from URL params
    const encryptedDataParam = searchParams.get("data");

    if (encryptedDataParam) {
      try {
        const decryptedData = decryptData(encryptedDataParam);
        const parsedData = JSON.parse(decryptedData) as SignUpParams;

        setEmail(parsedData.email);
        setSignUpData(parsedData);
      } catch (error) {
        console.error("Failed to decrypt signup data:", error);
        setError(
          "Unable to retrieve signup data. Please try signing up again."
        );
      }
    } else {
      setError("Missing signup data. Please try signing up again.");
    }
  }, [searchParams]);

  const handleResend = async () => {
    if (!signUpData) {
      setError(
        "Unable to resend verification code. Please try signing up again."
      );
      return;
    }

    setIsResending(true);
    setError("");

    try {
      await signUpWithEmail(signUpData);
      setError("");
      // You could show a success message here
    } catch (err) {
      setError("");
      console.error("Resend error:", err);
    } finally {
      setIsResending(false);
    }
  };

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8 bg-white rounded-lg mx-4">
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
          <h2 className="text-2xl font-bold mb-2 text-center">
            Account Verified!
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Your account has been successfully verified. You will be redirected
            to the dashboard shortly.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg mx-4">
        <h2 className="text-2xl font-bold mb-1">Verify your account</h2>
        <p className="text-sm text-gray-600 mb-6">
          We've sent a verification code to your email address. Please enter it
          below to complete your registration.
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
            <button
              onClick={handleResend}
              disabled={isResending || !signUpData}
              className="text-emerald-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? "Resending..." : "Resend verification email"}
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <a href="/auth" className="text-sm text-emerald-600 hover:underline">
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CompleteSignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-full max-w-md p-8 bg-white rounded-lg mx-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-600 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <CompleteSignUpContent />
    </Suspense>
  );
}
