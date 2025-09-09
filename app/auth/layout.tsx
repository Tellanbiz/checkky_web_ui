import type React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const img =
    "https://images.unsplash.com/photo-1741275270995-d897226ffa33?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Page Content */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
        {/* Main Content passed from pages */}
        <div className="max-w-2xl w-full mx-auto">{children}</div>
      </div>

      {/* Right Side - Background Image */}
      <div
        className="hidden lg:flex lg:flex-1 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </div>
  );
}
