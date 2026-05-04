// Central place to edit menu items
import type { LucideIcon } from "lucide-react";
import {
  Crown,
  Download,
  Grid2x2,
  LifeBuoy,
  MessageSquare,
  SquareGanttChart,
  Users,
  Wallet,
} from "lucide-react";

export type NavChild = { label: string; sublabel?: string; href: string };
export type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: "new" | number;
  children?: NavChild[];
  section?: "default" | "bottom";
};

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: Grid2x2, href: "/dashboard" },
  {
    key: "pending",
    label: "User Pending Deposits",
    icon: Users,
    href: "/deposits/pending",
  },

  {
    key: "agent-deposits",
    label: "Agent Deposits",
    icon: Download,

    children: [{ label: "Deposits Requests", href: "/deposit" }],
  },

  {
    key: "wallet",
    label: "Wallet",
    icon: Wallet,

    children: [
      { label: "Add Payment Method", href: "/wallet/add-payment-method" },
      {
        label: "My Payment Methods",
        href: "/wallet/my-payment-methods",
      },
    ],
  },

  {
    key: "vip-agent",
    label: "VIP Agent",
    icon: Crown,

    children: [{ label: "VIP Agent", href: "/vip-agent" }],
  },

  {
    key: "chat",
    label: "Live Chat",
    icon: MessageSquare,
    href: "/dashboard/chat",
    section: "bottom",
  },
  {
    key: "support",
    label: "Support",
    icon: LifeBuoy,
    href: "/dashboard/support",
  },
];

export const INVITE_CARD = {
  title: "Invite friends and earn money",
  icon: SquareGanttChart,
  href: "/dashboard/referrals",
};
