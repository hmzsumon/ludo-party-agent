"use client";

import { getErrorMessage } from "@/lib/getErrorMessage";
import { useLogoutUserMutation } from "@/redux/features/auth/authApi";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

/* ── user header block used in Mobile ──────────────────────── */
export default function SidebarUserBlock() {
  const { user } = useSelector((s: any) => s.auth);
  const router = useRouter();
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser(undefined).unwrap();
      toast.success("Logout successfully");
      router.push("/");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(user?.customerId || "");
    } catch {}
  };

  return (
    <div className="mb-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-3">
      <div className="flex flex-col  gap-2">
        <div>
          <div className="text-sm font-semibold text-white">{user?.name}</div>
          <div className="text-xs text-neutral-400">{user?.email}</div>
        </div>
        <div className="flex items-center justify-between">
          <code className="text-xs text-neutral-300">{user?.customerId}</code>
          <button
            type="button"
            onClick={copyId}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-800"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy
          </button>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <button
          type="button"
          onClick={handleLogout}
          className="block w-full rounded-lg px-2 py-2 text-left text-sm hover:bg-neutral-900"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
