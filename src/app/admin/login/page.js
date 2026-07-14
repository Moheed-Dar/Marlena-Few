"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Home } from "lucide-react";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#39518A] flex items-center justify-center relative overflow-hidden px-4">
      {/* Background with watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
          <div className="relative w-75 h-75 sm:w-100 sm:h-100">
            <Image
              src="/images/logo1.png"
              alt="Watermark"
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(43,127,255,0.12)_0%,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(43,127,255,0.08)_0%,transparent_50%)]" />
      </div>

      {/* Back to Home */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-[#1b3454] border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/20 transition-all"
      >
        <Home size={16} />
        <span className="text-xs font-medium hidden sm:inline">Back Home</span>
      </Link>

      {/* Wrap the component that uses useSearchParams in Suspense */}
      <Suspense fallback={<div className="text-white/50">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}