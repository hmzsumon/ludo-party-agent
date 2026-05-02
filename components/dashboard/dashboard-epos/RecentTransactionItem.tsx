"use client";

/* ── RecentTransactionItem ────────────────────────────────────────────────────
   স্ক্রিনশটের একটি single transaction row:
   - বাম: গোল আইকন (সবুজ=deposit, লাল=withdraw)
   - মাঝ: No. ...XXX + ID নম্বর
   - ডান: +/- amount + তারিখ-সময়
────────────────────────────────────────────────────────────────────────────── */

import { ArrowDownToLine, ArrowUpToLine } from "lucide-react";
import { fmtDiamond } from "./EposBalanceCard";

interface TransactionItemProps {
  type: "deposit" | "withdraw";
  orderId: string; // e.g. "318842857"
  displayNo: string; // e.g. "...783"
  amount: number;
  createdAt: string; // ISO date string
}

/* ── তারিখ ফরম্যাট করার ছোট হেল্পার ── */
function formatDateTime(isoStr: string) {
  try {
    const d = new Date(isoStr);
    const day = String(d.getDate()).padStart(2, "0");
    const mon = String(d.getMonth() + 1).padStart(2, "0");
    const yr = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");
    return `${day}.${mon}.${yr} / ${hh}:${mm}:${ss}`;
  } catch {
    return isoStr;
  }
}

export default function RecentTransactionItem({
  type,
  orderId,
  displayNo,
  amount,
  createdAt,
}: TransactionItemProps) {
  const isDeposit = type === "deposit";

  return (
    /* ── একটি row: বাম আইকন + মাঝে তথ্য + ডানে amount/date ── */
    <div className="flex items-center gap-3 bg-[#1a1a2e] rounded-xl px-4 py-3">
      {/* ── গোল আইকন ── */}
      <div
        className={`w-9 h-9 shrink-0 rounded-full border flex items-center justify-center
          ${
            isDeposit
              ? "border-green-600 bg-green-600/10"
              : "border-red-500 bg-red-500/10"
          }`}
      >
        {isDeposit ? (
          <ArrowDownToLine size={16} className="text-green-400" />
        ) : (
          <ArrowUpToLine size={16} className="text-red-400" />
        )}
      </div>

      {/* ── মাঝের তথ্য: No + ID ── */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-100 truncate">
          №{displayNo}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">ID {orderId}</p>
      </div>

      {/* ── ডানের amount + date ── */}
      <div className="text-right shrink-0">
        <p
          className={`text-sm font-semibold ${
            isDeposit ? "text-gray-100" : "text-red-400"
          }`}
        >
          {isDeposit ? "+" : "-"}
          {fmtDiamond(amount)}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {formatDateTime(createdAt)}
        </p>
      </div>
    </div>
  );
}
