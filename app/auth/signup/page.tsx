"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignUpParams } from "@/lib/services/auth/models";
import { signUpWithEmail } from "@/lib/services/auth/auth-post";

const INDUSTRY_OPTIONS = [
  "Livestock",
  "Crop Farming",
  "Flower Farming",
  "Mixed Agriculture",
  "Food Processing",
  "Warehousing",
  "Manufacturing",
  "Other",
];

const POSITION_OPTIONS = [
  "Founder / Owner",
  "Operations Manager",
  "Farm Manager",
  "Safety Officer",
  "Supervisor",
  "Team Lead",
];

const TEAM_MEMBER_OPTIONS = [
  "Just me",
  "2-10 team members",
  "11-25 team members",
  "26-50 team members",
  "50+ team members",
];

const COUNTRY_OPTIONS = [
  "Kenya",
  "Uganda",
  "Tanzania",
  "Rwanda",
  "Burundi",
  "Ethiopia",
  "South Africa",
  "Nigeria",
  "Ghana",
  "Egypt",
  "Morocco",
  "Algeria",
  "Tunisia",
  "Zambia",
  "Zimbabwe",
  "Botswana",
  "Namibia",
  "Malawi",
  "Mozambique",
  "Cameroon",
  "Senegal",
  "Cote d'Ivoire",
  "Democratic Republic of the Congo",
  "United States",
  "Canada",
  "United Kingdom",
  "Ireland",
  "Germany",
  "France",
  "Netherlands",
  "Italy",
  "Spain",
  "Portugal",
  "India",
  "China",
  "Japan",
  "Australia",
  "New Zealand",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Brazil",
  "Mexico",
  "Other",
];

type SignUpStep = 1 | 2;

const STEP_CONTENT: Record<
  SignUpStep,
  {
    title: string;
    description: string;
  }
> = {
  1: {
    title: "Create your account",
    description: "Set up your login details to get started.",
  },
  2: {
    title: "A quick onboarding",
    description:
      "Tell us about your team so we can tailor the workspace from day one.",
  },
};

export default function SignUpPage() {
  const [step, setStep] = useState<SignUpStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<SignUpParams>({
    email: "",
    password: "",
    repassword: "",
    full_name: "",
    country: "",
    team_members: "",
    industry: "",
    position: "",
  });

  const validateStepOne = () => {
    if (!formData.full_name.trim()) {
      return "Full name is required";
    }

    if (!formData.email.trim()) {
      return "Email is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address";
    }

    if (!formData.password) {
      return "Password is required";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters long";
    }

    if (!formData.repassword) {
      return "Please confirm your password";
    }

    if (formData.password !== formData.repassword) {
      return "Passwords do not match";
    }

    return "";
  };

  const validateStepTwo = () => {
    if (!formData.team_members) {
      return "Please choose your team size";
    }

    if (!formData.country) {
      return "Please choose your country";
    }

    if (!formData.industry) {
      return "Please choose your industry";
    }

    if (!formData.position) {
      return "Please choose your position";
    }

    if (!agreeToTerms) {
      return "You must agree to the terms and conditions";
    }

    return "";
  };

  const handleNextStep = () => {
    const validationError = validateStepOne();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const validationError = validateStepTwo();
    if (validationError) {
      setError(validationError);
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
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-8 bg-white rounded-lg mx-4">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              {[1, 2].map((item) => {
                const isActive = step === item;
                const isComplete = step > item;

                return (
                  <div key={item} className="flex items-center flex-1">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                        isActive || isComplete
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item}
                    </div>
                    {item < 2 && (
                      <div
                        className={`h-px flex-1 mx-3 ${
                          step > item ? "bg-emerald-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-600">
              Step {step} of 2
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-1">{STEP_CONTENT[step].title}</h2>
          <p className="text-sm text-gray-600 mb-2">
            {STEP_CONTENT[step].description}
          </p>
          <p className="text-sm text-gray-600 mb-6">
            Already have an account?{" "}
            <a href="/auth" className="text-emerald-600 hover:underline">
              Sign in
            </a>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === 1 ? (
              <>
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
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange("password")}
                        className="pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-gray-500 hover:bg-transparent"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="repassword">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="repassword"
                        name="repassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.repassword}
                        onChange={handleInputChange("repassword")}
                        className="pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 text-gray-500 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Team Members</Label>
                  <Select
                    value={formData.team_members}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, team_members: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your team size" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAM_MEMBER_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, country: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, industry: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRY_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Position</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, position: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your position" />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITION_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              </>
            )}

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <div className="flex gap-3">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setError("");
                    setStep(1);
                  }}
                >
                  Back
                </Button>
              )}

              {step === 1 ? (
                <Button type="button" className="w-full" onClick={handleNextStep}>
                  Continue
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || !agreeToTerms}
                  className="flex-1"
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
              )}
            </div>
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
