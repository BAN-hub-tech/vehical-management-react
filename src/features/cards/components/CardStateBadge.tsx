import type { CardInventoryStatus, CardLostState, CardSubscriptionState } from "@/features/cards/components/cardManageData";

type CardBadgeTone =
  | "inventory-available"
  | "inventory-assigned"
  | "inventory-in-use"
  | "inventory-pending"
  | "inventory-lost"
  | "inventory-blocked"
  | "subscription-none"
  | "subscription-active"
  | "subscription-pending"
  | "subscription-expired"
  | "lost-none"
  | "lost-open";

function getInventoryTone(value: CardInventoryStatus): CardBadgeTone {
  switch (value) {
    case "available":
      return "inventory-available";
    case "assigned":
      return "inventory-assigned";
    case "in_use":
      return "inventory-in-use";
    case "pending":
      return "inventory-pending";
    case "lost":
      return "inventory-lost";
    case "blocked":
      return "inventory-blocked";
  }
}

function getSubscriptionTone(value: CardSubscriptionState): CardBadgeTone {
  switch (value) {
    case "none":
      return "subscription-none";
    case "active":
      return "subscription-active";
    case "pending":
      return "subscription-pending";
    case "expired":
      return "subscription-expired";
  }
}

function getLostTone(value: CardLostState): CardBadgeTone {
  switch (value) {
    case "none":
      return "lost-none";
    case "open":
      return "lost-open";
  }
}

interface CardStateBadgeProps {
  kind: "inventory" | "subscription" | "lost";
  label: string;
  value: CardInventoryStatus | CardSubscriptionState | CardLostState;
}

export function CardStateBadge({ kind, label, value }: CardStateBadgeProps) {
  const tone =
    kind === "inventory"
      ? getInventoryTone(value as CardInventoryStatus)
      : kind === "subscription"
        ? getSubscriptionTone(value as CardSubscriptionState)
        : getLostTone(value as CardLostState);

  return (
    <span className={`vm-card-badge vm-card-badge--${tone}`}>
      <span className="vm-card-badge__dot" />
      <span>{label}</span>
    </span>
  );
}
