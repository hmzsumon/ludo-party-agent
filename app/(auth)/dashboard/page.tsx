"use client";

import DepositWithdrawButtons from "@/components/dashboard/dashboard-epos/DepositWithdrawButtons";
import EposBalanceCard from "@/components/dashboard/dashboard-epos/EposBalanceCard";
import RecentTransactionsList from "@/components/dashboard/dashboard-epos/RecentTransactionsList";
/* ── app/(auth)/dashboard/page.tsx ───────────────────────────────────────────
   Agent Dashboard — EPOS স্টাইল (স্ক্রিনশট হুবহু ফলো করে)
   ✅ EposBalanceCard        → EPOS limit + Balance + progress bar
   ✅ DepositWithdrawButtons → Deposit + Withdraw action বাটন
   ✅ RecentTransactionsList → assignedAgentId এর last 30 deposit+withdraw
   ─────────────────────────────────────────────────────────────────────────── */

import { useGetMyDashboardSummaryQuery } from "@/redux/features/agent/agentFinanceApi";

/* ── Component Imports ── */

export default function AgentDashboardPage() {
  /* ── Dashboard summary API (একটাই call, সব KPI এক সাথে) ── */
  const { data: dashRes, isLoading: dashLoading } =
    useGetMyDashboardSummaryQuery();

  const data = dashRes?.data || {};

  /* ── EPOS limit = rolling balance (agent এর float balance) ── */
  const eposLimit = data?.rollingBalance ?? 0;

  /* ── Balance = lifetime approved deposit amount ── */
  const balance = data?.deposits?.lifetimeAmount ?? 0;

  return (
    /* ── পুরো পেজ: dark background #0f0f1a ── */
    <main className="min-h-screen bg-[#0f0f1a] text-white">
      {/* ── Content wrapper: mobile-first, centered, max-md ── */}
      <div className="mx-auto max-w-md px-1 pt-4 pb-10">
        {/* ── সেকশন ১: EPOS Balance Card (উপরের বড় ব্যালান্স বক্স) ── */}
        <EposBalanceCard
          eposLimit={eposLimit}
          balance={balance}
          isLoading={dashLoading}
        />

        {/* ── সেকশন ২: Deposit + Withdraw দুটো বড় বাটন ── */}
        <DepositWithdrawButtons />

        {/* ── সেকশন ৩: Recent Transactions (last 30টা) ── */}
        <RecentTransactionsList />
      </div>
    </main>
  );
}
