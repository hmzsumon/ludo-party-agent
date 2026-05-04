import { getAgentTypeFromUser } from "@/lib/agentAccess";
import type { NavItem } from "./sidebar-data";

/* ──────────────────────────────────────────────────────────────────────────
 * Sidebar Permission Filter
 * - e-wallet: Deposit > Manual Deposits hide হবে
 * - cash: Wallet group পুরো hide হবে
 * - e-wallet: Wallet > Add Payment Method hide হবে, শুধু My Payment Methods থাকবে
 * ────────────────────────────────────────────────────────────────────────── */
export function filterNavItemsByAgentType(items: NavItem[], user: any) {
  const agentType = getAgentTypeFromUser(user);

  return items
    .map((item) => {
      /* ────────── cash withdraw page access
         শুধু cash type agent sidebar এ দেখতে পারবে।
      ────────── */
      if (agentType !== "cash" && item.key === "cash-withdraw") {
        return null;
      }

      if (agentType === "cash" && item.key === "wallet") {
        return null;
      }

      if (agentType === "cash" && item.key === "pending-deposits") {
        return null;
      }

      if (agentType === "e-wallet" && item.key === "wallet") {
        return {
          ...item,
          children: item.children?.filter(
            (child) => child.href !== "/wallet/add-payment-method",
          ),
        };
      }

      return item;
    })
    .filter((item): item is NavItem => {
      if (!item) return false;
      if (item.children && item.children.length === 0) return false;
      return true;
    });
}
