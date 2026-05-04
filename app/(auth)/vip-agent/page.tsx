"use client";

import { ArrowLeft, Crown, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";

const VipAgentPage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      {/* ────────── Main Card Wrapper ────────── */}
      <div className="w-full max-w-lg rounded-3xl border border-yellow-500/20 bg-gradient-to-br from-[#111827] via-[#0f172a] to-[#111827] p-6 shadow-2xl">
        {/* ────────── Back Button ────────── */}
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {/* ────────── Icon Section ────────── */}
        <div className="mb-5 flex justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/10 ring-4 ring-yellow-500/10">
            <Crown className="h-10 w-10 text-yellow-400" />
          </div>
        </div>

        {/* ────────── Heading Section ────────── */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            VIP Access Required
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-300 sm:text-base">
            You are not a{" "}
            <span className="font-semibold text-yellow-400">VIP Agent</span>.
            Please contact support to upgrade your account and unlock VIP
            features.
          </p>
        </div>

        {/* ────────── Info Box ────────── */}
        <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-semibold text-white">
                Why am I seeing this?
              </h2>
              <p className="mt-1 text-sm text-gray-300">
                This section is only available for VIP Agents. Upgrade your
                account to access premium tools and exclusive features.
              </p>
            </div>
          </div>
        </div>

        {/* ────────── Action Buttons ────────── */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => router.back()}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-medium text-white transition hover:bg-white/10"
          >
            Go Back
          </button>

          <button className="flex-1 rounded-xl bg-yellow-500 px-4 py-3 font-semibold text-black transition hover:bg-yellow-400">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default VipAgentPage;
