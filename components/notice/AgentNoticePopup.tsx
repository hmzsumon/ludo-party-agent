"use client";

/* ────────── imports ────────── */
import {
  useGetMyNotificationsQuery,
  useMarkReadMutation,
} from "@/redux/features/notifications/notificationApi";
import { Bell, Check, Megaphone, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

/* ────────── component ────────── */
export default function AgentNoticePopup() {
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);

  /* ────────── unread agent notice pull ──────────
     Admin notice category agent_announcement হিসেবে save হয়।
     Polling রাখলাম, socket miss হলেও agent notice দেখতে পাবে।
  ─────────────────────────────────────────── */
  const { data } = useGetMyNotificationsQuery(
    { unread: true },
    { pollingInterval: 30000 },
  );

  const [markRead, { isLoading }] = useMarkReadMutation();

  const notices = useMemo(() => {
    const list = data?.notifications ?? data?.data ?? [];
    return list.filter((item: any) => {
      const category = String(item?.category || "").toLowerCase();
      const id = String(item?._id || "");
      return category === "agent_announcement" && !hiddenIds.includes(id);
    });
  }, [data, hiddenIds]);

  const notice = notices[0];
  if (!notice?._id) return null;

  const closeLocal = () => {
    setHiddenIds((prev) => [...prev, String(notice._id)]);
  };

  const markAsRead = async () => {
    await markRead({ id: String(notice._id) });
    closeLocal();
  };

  return (
    <div className="fixed inset-x-3 bottom-4 z-[70] mx-auto max-w-md sm:right-5 sm:left-auto sm:mx-0">
      <div className="relative overflow-hidden rounded-[26px] border border-cyan-300/25 bg-[linear-gradient(145deg,rgba(3,37,65,0.98),rgba(4,20,38,0.98))] p-4 text-white shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-14 bottom-0 h-28 w-28 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="relative flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/15">
            <Megaphone className="h-5 w-5 text-cyan-200" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Bell className="h-3.5 w-3.5 text-cyan-200" />
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-200/90">
                Agent Notice
              </span>
            </div>

            <h3 className="line-clamp-2 text-base font-black leading-5">
              {notice.title || "Admin Notice"}
            </h3>
            <p className="mt-2 line-clamp-4 text-sm leading-5 text-white/75">
              {notice.message || "-"}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {notice.url ? (
                <Link
                  href={notice.url}
                  onClick={markAsRead}
                  className="inline-flex items-center gap-1 rounded-full bg-cyan-300 px-3 py-1.5 text-xs font-black text-[#071c2c] transition hover:bg-cyan-200"
                >
                  Open
                </Link>
              ) : null}

              <button
                type="button"
                onClick={markAsRead}
                disabled={isLoading}
                className="inline-flex items-center gap-1 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-100 transition hover:bg-emerald-400/20 disabled:opacity-60"
              >
                <Check className="h-3.5 w-3.5" /> Got it
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={closeLocal}
            className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Close notice"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
