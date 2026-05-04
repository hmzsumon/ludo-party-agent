"use client";

/* ── DepositWithdrawButtons ───────────────────────────────────────────────────
   স্ক্রিনশটের দুইটা বড় Action বাটন:
   ✅ Deposit  (সবুজ, নিচে তীর আইকন)
   🔴 Withdraw (লাল, উপরে তীর আইকন)
────────────────────────────────────────────────────────────────────────────── */

import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import Link from "next/link";

export default function DepositWithdrawButtons() {
  return (
    /* ── দুটো বাটন পাশাপাশি ── */
    <div className="grid grid-cols-2 gap-2 mt-2">
      {/* ── Deposit বাটন (সবুজ) ── */}
      <Link href="/deposits/manual">
        <div className="flex flex-col items-center justify-center gap-1.5 rounded-b-xl bg-[#1a1a2e] border border-[#2a2a45] py-2 hover:bg-[#1e2a1e] hover:border-green-700/50 transition-all cursor-pointer">
          <div className="w-6 h-6 rounded-full border border-green-500 flex items-center justify-center">
            <ArrowDownToLine size={13} className="text-green-400" />
          </div>
          <span className="text-sm font-semibold text-green-400">Deposit</span>
        </div>
      </Link>

      {/* ── Withdraw বাটন (লাল) ── */}
      <Link href="/withdrawals/pending">
        <div className="flex flex-col items-center justify-center gap-1.5 rounded-b-xl bg-[#1a1a2e] border border-[#2a2a45] py-2 hover:bg-[#2a1a1a] hover:border-red-700/50 transition-all cursor-pointer">
          <div className="w-6 h-6 rounded-full border border-red-500 flex items-center justify-center">
            <ArrowUpToLine size={13} className="text-red-400" />
          </div>
          <span className="text-sm font-semibold text-red-400">Withdraw</span>
        </div>
      </Link>
    </div>
  );
}
