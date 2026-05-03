"use client";

/* ── EposBalanceCard ──────────────────────────────────────────────────────────
   স্ক্রিনশটের উপরের "EPOS limit" + Balance সেকশন হুবহু রিপ্লিকা
   - EPOS limit (rolling balance)
   - Main balance (total deposit amount)
   - Progress bar (limit এর ভেতরে কতটুকু ব্যবহার হয়েছে)
────────────────────────────────────────────────────────────────────────────── */

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface EposBalanceCardProps {
  eposLimit: number; // rolling balance / float
  balance: number; // total lifetime deposit amount
  isLoading?: boolean;
}

/* ── 💎 diamond symbol দিয়ে amount format করার helper ── */
export function fmtDiamond(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 }) + " 💎";
}

export default function EposBalanceCard({
  eposLimit,
  balance,
  isLoading,
}: EposBalanceCardProps) {
  /* ── balance লুকানো/দেখানো toggle ── */
  const [hidden, setHidden] = useState(false);

  /* ── progress: balance / eposLimit (max 100%) ── */
  const progress =
    eposLimit > 0 ? Math.min((balance / eposLimit) * 100, 100) : 0;

  const mask = "••••••";

  return (
    /* ── কার্ড wrapper ── */
    <div className="rounded-t-xl bg-[#1a1a2e] px-5 pt-5 pb-4">
      {/* ── সারি ১: EPOS limit লেবেল + eye icon ── */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400 tracking-wide">
          Current Balance
        </span>
        <button
          onClick={() => setHidden((p) => !p)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {hidden ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* ── সারি ২: EPOS limit মূল্য (বড়) ── */}
      <p className="text-xl font-bold text-white tracking-tight">
        {isLoading ? "..." : hidden ? mask : fmtDiamond(eposLimit)}
      </p>

      {/* ── সারি ৩: Balance ── */}
      {/* <p className="text-sm text-gray-400 mt-0.5">
        Balance:{" "}
        <span className="text-gray-200">
          {isLoading ? "..." : hidden ? mask : fmtDiamond(balance)}
        </span>
      </p> */}

      {/* ── Progress bar (নীল) ── */}
      <div className="mt-3 h-1.5 w-full rounded-full bg-[#2a2a45] overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
