export type AgentType = "e-wallet" | "cash";

/* ──────────────────────────────────────────────────────────────────────────
 * Agent Type Access Helper
 * - e-wallet agent: manual deposit বন্ধ, wallet/my payment methods edit করতে পারবে
 * - cash agent: wallet option বন্ধ, manual deposit access করতে পারবে
 * - backend load-user থেকে agentType / agentStatus.agentType আসবে
 * ────────────────────────────────────────────────────────────────────────── */
export function getAgentTypeFromUser(user: any): AgentType {
  const value =
    user?.agentType ||
    user?.agentStatus?.agentType ||
    user?.statusDoc?.agentType ||
    user?.agent?.agentType ||
    user?.agent?.statusDoc?.agentType;

  return value === "cash" ? "cash" : "e-wallet";
}

export const isEWalletAgent = (user: any) =>
  getAgentTypeFromUser(user) === "e-wallet";

export const isCashAgent = (user: any) =>
  getAgentTypeFromUser(user) === "cash";
