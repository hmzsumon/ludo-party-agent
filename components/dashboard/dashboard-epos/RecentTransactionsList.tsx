"use client";

/* ── RecentTransactionsList ───────────────────────────────────────────────────
   assignedAgentId দিয়ে agent এর সব deposit + withdraw ফেচ করে,
   merge করে createdAt অনুযায়ী sort করে শেষ ৩০টা দেখায়।
   স্ক্রিনশটের "Recent transactions" সেকশনের হুবহু রিপ্লিকা।
────────────────────────────────────────────────────────────────────────────── */

import { useGetAllDepositRequestsQuery } from "@/redux/features/deposit/depositApi";
import { useGetAllWithdrawRequestsQuery } from "@/redux/features/withdraw/withdrawApi";
import { ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import RecentTransactionItem from "./RecentTransactionItem";

/* ── unified transaction type ── */
interface UnifiedTx {
  id: string;
  type: "deposit" | "withdraw";
  orderId: string; // e.g. "318842857"
  displayNo: string; // e.g. "...783"
  amount: number;
  createdAt: string;
}

/* ── শেষ কয়েকটা অক্ষর দিয়ে displayNo বানাই ── */
function makeDisplayNo(str: string = "") {
  return "..." + str.slice(-3);
}

export default function RecentTransactionsList() {
  /* ── Agent deposits ── */
  const { data: depositRes, isLoading: depLoading } =
    useGetAllDepositRequestsQuery();

  /* ── Agent withdraws ── */
  const { data: withdrawRes, isLoading: wdLoading } =
    useGetAllWithdrawRequestsQuery(undefined);

  const isLoading = depLoading || wdLoading;

  /* ── Deposits → UnifiedTx ── */
  const deposits: UnifiedTx[] = (depositRes?.deposits ?? []).map((d: any) => ({
    id: d._id,
    type: "deposit",
    orderId: d._id?.slice(-9) || d.orderId || d._id,
    displayNo: makeDisplayNo(d._id),
    amount: d.amount ?? 0,
    createdAt: d.createdAt ?? "",
  }));

  /* ── Withdraws → UnifiedTx ── */
  const withdraws: UnifiedTx[] = (withdrawRes?.withdraws ?? []).map(
    (w: any) => ({
      id: w._id,
      type: "withdraw",
      orderId: w._id?.slice(-9) || w._id,
      displayNo: makeDisplayNo(w._id),
      amount: w.amount ?? 0,
      createdAt: w.createdAt ?? "",
    }),
  );

  /* ── দুটো মিলিয়ে sort → শেষ ৩০টা ── */
  const merged: UnifiedTx[] = [...deposits, ...withdraws]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 30);

  return (
    /* ── Recent Transactions সেকশন wrapper ── */
    <div className="mt-4">
      {/* ── সেকশন হেডার: টাইটেল + External link ── */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-base font-semibold text-white">
          Recent transactions
        </h2>
        <Link
          href="/deposits/all"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ExternalLink size={16} />
        </Link>
      </div>

      {/* ── লোডিং অবস্থা ── */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 size={24} className="text-blue-400 animate-spin" />
        </div>
      )}

      {/* ── ডেটা না থাকলে ── */}
      {!isLoading && merged.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          কোনো লেনদেন পাওয়া যায়নি
        </div>
      )}

      {/* ── Transaction লিস্ট ── */}
      {!isLoading && merged.length > 0 && (
        <div className="flex flex-col gap-2">
          {merged.map((tx) => (
            <RecentTransactionItem
              key={`${tx.type}-${tx.id}`}
              type={tx.type}
              orderId={tx.orderId}
              displayNo={tx.displayNo}
              amount={tx.amount}
              createdAt={tx.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
