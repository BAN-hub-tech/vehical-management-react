type StatusTab<TValue extends string> = {
  label: string;
  value: TValue;
};

type StatusTabsProps<TValue extends string> = {
  activeValue: TValue;
  ariaLabel?: string;
  className?: string;
  counts: Partial<Record<TValue, number>>;
  onChange: (value: TValue) => void;
  tabs: Array<StatusTab<TValue>>;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export function StatusTabs<TValue extends string>({
  activeValue,
  ariaLabel = "Status tabs",
  className = "",
  counts,
  onChange,
  tabs
}: StatusTabsProps<TValue>) {
  const activeIndex = tabs.findIndex((tab) => tab.value === activeValue);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;
  const activeTab = tabs[safeActiveIndex];
  const beforeTabs = tabs.slice(0, safeActiveIndex);
  const afterTabs = tabs.slice(safeActiveIndex + 1);

  return (
    <div className={`vm-card-status-tabs-shell ${className}`.trim()} role="tablist" aria-label={ariaLabel}>
      <div className="vm-card-status-tabs vm-card-status-tabs--before">
        {beforeTabs.map((tab, index) => (
          <button
            className={`vm-card-status-tab ${index === beforeTabs.length - 1 ? "is-prev-neighbor" : ""}`}
            data-tab={tab.value}
            key={tab.value}
            onClick={() => onChange(tab.value)}
            type="button"
          >
            <span>{tab.label}</span>
            <strong>{formatCount(counts[tab.value] ?? 0)}</strong>
          </button>
        ))}
      </div>

      {activeTab ? (
        <button
          className="vm-card-status-tab vm-card-status-tab--floating is-active"
          data-tab={activeTab.value}
          onClick={() => onChange(activeTab.value)}
          type="button"
        >
          <span>{activeTab.label}</span>
          <strong>{formatCount(counts[activeTab.value] ?? 0)}</strong>
        </button>
      ) : null}

      <div className="vm-card-status-tabs vm-card-status-tabs--after">
        {afterTabs.map((tab, index) => (
          <button
            className={`vm-card-status-tab ${index === 0 ? "is-next-neighbor" : ""}`}
            data-tab={tab.value}
            key={tab.value}
            onClick={() => onChange(tab.value)}
            type="button"
          >
            <span>{tab.label}</span>
            <strong>{formatCount(counts[tab.value] ?? 0)}</strong>
          </button>
        ))}
      </div>
    </div>
  );
}
