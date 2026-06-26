import type { CardSummaryMetric } from "@/features/cards/components/cardManageData";
import { MetricCard } from "@/shared/components/ui/MetricCard";

interface CardSummaryGridProps {
  items: CardSummaryMetric[];
}

function SummarySparkline({ color, values }: { color: string; values: number[] }) {
  const width = 96;
  const height = 28;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(1, max - min);
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg aria-hidden="true" className="vm-card-summary__sparkline" viewBox={`0 0 ${width} ${height}`}>
      <polyline fill="none" points={points} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.25" />
    </svg>
  );
}

function getSparkColor(accent: CardSummaryMetric["accent"]) {
  switch (accent) {
    case "blue":
      return "#2563EB";
    case "green":
      return "#22C55E";
    case "amber":
      return "#F59E0B";
    case "red":
      return "#EF4444";
  }
}

function SummaryIcon({ icon }: { icon: CardSummaryMetric["icon"] }) {
  switch (icon) {
    case "card":
      return (
        <svg aria-hidden="true" className="vm-card-summary__icon-svg" viewBox="0 0 24 24" fill="none">
          <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" stroke="currentColor" strokeWidth="2" />
          <path d="M3.5 10H20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 14.5H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "user":
      return (
        <svg aria-hidden="true" className="vm-card-summary__icon-svg" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M5 19C5 15.6863 8.13401 13 12 13C15.866 13 19 15.6863 19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "clock":
      return (
        <svg aria-hidden="true" className="vm-card-summary__icon-svg" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7.5V12.2L15.2 14.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "alert":
      return (
        <svg aria-hidden="true" className="vm-card-summary__icon-svg" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7.8V12.7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="12" cy="16.2" r="1.2" fill="currentColor" />
        </svg>
      );
  }
}

export function CardSummaryGrid({ items }: CardSummaryGridProps) {
  return (
    <div className="vm-card-summary-grid">
      {items.map((item) => (
        <MetricCard
          blockClassName="vm-card-summary"
          className={`vm-card-summary vm-card-summary--${item.accent}`}
          contentClassName="vm-card-summary__content"
          delta={item.delta}
          deltaClassName={`vm-card-summary__delta vm-card-summary__delta--${item.deltaTone}`}
          icon={
            <div className="vm-card-summary__icon">
              <SummaryIcon icon={item.icon} />
            </div>
          }
          key={item.label}
          label={item.label}
          labelClassName="vm-card-summary__label"
          sparkline={<SummarySparkline color={getSparkColor(item.accent)} values={item.sparkline} />}
          value={item.value}
          valueClassName="vm-card-summary__value"
        />
      ))}
    </div>
  );
}
