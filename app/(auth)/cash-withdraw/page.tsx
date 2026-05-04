"use client";

import { isCashAgent } from "@/lib/agentAccess";
import {
  useAdminApproveWithdrawMutation,
  useGetCashWithdrawByCodeQuery,
} from "@/redux/features/withdraw/withdrawApi";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

/* ──────────────────────────────────────────────────────────────────────────
 * Cash Withdraw Page
 * - cash type agent only
 * - user history থেকে পাওয়া 6 character code দিয়ে search করবে
 * - screen-1 / screen-2 এর মত simple payout confirm flow
 * ────────────────────────────────────────────────────────────────────────── */
export default function CashWithdrawPage() {
  const searchParams = useSearchParams();
  const user = useSelector((state: any) => state.auth.user);

  const initialCode = String(searchParams.get("code") || "").toUpperCase();
  const [code, setCode] = useState(initialCode);
  const [searchCode, setSearchCode] = useState(initialCode);

  const isCash = isCashAgent(user);

  const { data, isFetching, isError, error, refetch } =
    useGetCashWithdrawByCodeQuery(searchCode, {
      skip: !isCash || searchCode.length !== 6,
    });

  const [approveWithdraw, { isLoading: isApproving }] =
    useAdminApproveWithdrawMutation();

  const withdraw = data?.data || data?.withdraw;

  const amount = useMemo(() => {
    return Number(
      withdraw?.net_payout_amount ||
        withdraw?.netAmount ||
        withdraw?.amount ||
        0,
    );
  }, [withdraw]);

  useEffect(() => {
    if (initialCode.length === 6) setSearchCode(initialCode);
  }, [initialCode]);

  const submitSearch = () => {
    const nextCode = code.trim().toUpperCase();

    if (!/^[A-Z0-9]{6}$/.test(nextCode)) {
      toast.error("Enter valid 6 character withdraw code");
      return;
    }

    setSearchCode(nextCode);
  };

  const handleApprove = async () => {
    if (!withdraw?._id) return toast.error("Withdraw not found");
    if (withdraw?.status === "approved") return toast.info("Already approved");

    try {
      await approveWithdraw({
        id: withdraw._id,
        txnId: withdraw.withdrawCode || searchCode,
        agentNumber: user?.phone || user?.customerId || "cash-agent",
      }).unwrap();

      toast.success("Withdraw approved successfully");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Approve failed");
    }
  };

  if (!isCash) {
    return (
      <div className="mx-auto max-w-xl p-4">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-100">
          {/* ────────── cash access guard ────────── */}
          Only cash type agent can access Cash Withdraw page.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-4">
      {/* ────────── header ────────── */}
      <div className="rounded-3xl border border-white/10 bg-[#11131f] p-4 shadow-2xl">
        <div className="text-center text-2xl font-bold text-white">Pay out</div>
        <p className="mt-1 text-center text-xs text-white/45">
          Enter user withdraw code and approve cash payout.
        </p>
      </div>

      {/* ────────── code search card ────────── */}
      <div className="rounded-3xl border border-white/10 bg-[#0f1118] p-5 shadow-2xl">
        <label className="mb-2 block text-center text-sm font-semibold text-white/70">
          Enter withdrawal code
        </label>
        <input
          value={code}
          onChange={(e) =>
            setCode(
              e.target.value
                .replace(/[^a-zA-Z0-9]/g, "")
                .toUpperCase()
                .slice(0, 6),
            )
          }
          onKeyDown={(e) => e.key === "Enter" && submitSearch()}
          placeholder="HGB6A2"
          className="mx-auto block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center text-2xl font-bold uppercase tracking-[0.35em] text-white outline-none placeholder:text-white/20 focus:border-indigo-400/70"
        />

        <button
          type="button"
          onClick={submitSearch}
          disabled={isFetching}
          className="mt-4 w-full rounded-2xl bg-indigo-500 py-4 text-lg font-bold text-white shadow-lg shadow-indigo-500/25 disabled:opacity-50"
        >
          {isFetching ? "Searching..." : "Next"}
        </button>
      </div>

      {isError && searchCode.length === 6 && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
          {(error as any)?.data?.message || "No withdraw found for this code"}
        </div>
      )}

      {/* ────────── withdrawal details bottom-card style ────────── */}
      {withdraw && (
        <div className="rounded-[2rem] border border-white/10 bg-[#0d0f16] p-6 shadow-2xl">
          <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-white/25" />

          <h2 className="text-center text-2xl font-black text-white">
            Withdrawal details
          </h2>

          <div className="mt-5 text-center text-2xl font-black text-white">
            {amount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            ৳
          </div>

          <div className="my-6 border-t border-dashed border-white/25" />

          <div className="space-y-4 text-base">
            <InfoRow label="Transaction" value="Withdrawal" />
            <InfoRow label="Recipient" value={withdraw.name || "-"} />
            <InfoRow label="WebUser ID" value={withdraw.customerId || "-"} />
            <InfoRow label="Code" value={withdraw.withdrawCode || searchCode} />
            <InfoRow
              label="Status"
              value={String(withdraw.status || "pending")}
            />
          </div>

          <button
            type="button"
            onClick={handleApprove}
            disabled={isApproving || withdraw.status === "approved"}
            className="mt-8 w-full rounded-2xl bg-indigo-500 py-4 text-xl font-black text-white shadow-lg shadow-indigo-500/25 disabled:opacity-50"
          >
            {withdraw.status === "approved"
              ? "Already Withdrawn"
              : isApproving
                ? "Withdrawing..."
                : "Withdraw"}
          </button>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-white/45">{label}</div>
      <div className="text-right font-bold text-white">{value}</div>
    </div>
  );
}
