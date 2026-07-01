import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { adminNavigation } from "../../../config/navigation";
import type { AdminSidebarEntry, AdminSidebarIcon, AdminSidebarLeaf } from "../../types/common";
import { cn } from "@/lib/cn";

function isPathMatch(pathname: string, matches: string[]) {
  return matches.some((match) => pathname === match || pathname.startsWith(`${match}/`));
}

function SidebarIcon({ icon }: { icon: AdminSidebarIcon }) {
  const iconClassName = {
    dashboard: "fas fa-tachometer-alt",
    swipe: "fas fa-car-side",
    card: "fas fa-credit-card",
    catalog: "fas fa-ticket-alt",
    parking: "fas fa-parking",
    pricing: "fas fa-file-invoice-dollar",
    members: "fas fa-users",
    role: "fas fa-user-shield",
    settings: "fas fa-cog",
  } satisfies Record<AdminSidebarIcon, string>;

  return <i className={cn("tw-text-[1rem]", iconClassName[icon])} aria-hidden="true" />;
}

function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <i
      className="fas fa-chevron-down tw-text-[0.78rem] tw-transition-transform tw-duration-200"
      style={{ transform: expanded ? "rotate(0deg)" : "rotate(-90deg)" }}
      aria-hidden="true"
    />
  );
}

function isLeafActive(item: AdminSidebarLeaf, pathname: string) {
  return isPathMatch(pathname, item.matches);
}

function isEntryActive(entry: Extract<AdminSidebarEntry, { kind: "group" }>, pathname: string) {
  return entry.items.some((item) => isLeafActive(item, pathname));
}

function getActiveGroupLabel(pathname: string) {
  const activeGroup = adminNavigation.find((entry) => entry.kind === "group" && isEntryActive(entry, pathname));
  return activeGroup?.kind === "group" ? activeGroup.label : null;
}

function SidebarLeaf({ item }: { item: AdminSidebarLeaf }) {
  const location = useLocation();
  const active = isLeafActive(item, location.pathname);

  return (
    <NavLink
      to={item.to}
      className={cn(
        "tw-ml-8 tw-flex tw-min-h-10 tw-items-center tw-gap-3 tw-rounded-vm-md tw-px-3 tw-text-[0.92rem] tw-font-bold tw-text-vm-slate-700 hover:tw-bg-brand-50 hover:tw-text-vm-primary hover:tw-no-underline",
        active ? "tw-bg-brand-50 tw-text-vm-primary" : "",
      )}
    >
      <span className={cn("tw-h-2 tw-w-2 tw-rounded-full", active ? "tw-bg-vm-primary" : "tw-bg-slate-300")} aria-hidden="true" />
      <span className="tw-min-w-0 tw-truncate">{item.label}</span>
    </NavLink>
  );
}

function SidebarGroup({
  entry,
  active,
  expanded,
  onToggle,
}: {
  entry: Extract<AdminSidebarEntry, { kind: "group" }>;
  active: boolean;
  expanded: boolean;
  onToggle: (label: string) => void;
}) {
  return (
    <div className="tw-grid tw-gap-1">
      <button
        type="button"
        onClick={() => onToggle(entry.label)}
        className={cn(
          "tw-flex tw-min-h-[48px] tw-w-full tw-items-center tw-justify-between tw-gap-3 tw-rounded-vm-sm tw-border-0 tw-px-3 tw-text-left tw-text-[0.96rem] tw-font-extrabold tw-transition",
          active ? "tw-bg-vm-primary tw-text-white" : "tw-bg-white tw-text-slate-900 hover:tw-bg-brand-50 hover:tw-text-vm-primary",
        )}
      >
        <span className="tw-flex tw-min-w-0 tw-items-center tw-gap-3">
          <span className={cn("tw-inline-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center tw-rounded-vm-sm", active ? "tw-bg-white/14 tw-text-white" : "tw-bg-brand-50 tw-text-vm-primary")}>
            <SidebarIcon icon={entry.icon} />
          </span>
          <span className="tw-min-w-0 tw-truncate">{entry.label}</span>
        </span>
        <Chevron expanded={expanded} />
      </button>

      {expanded ? <div className="tw-grid tw-gap-1 tw-border-0 tw-border-l tw-border-solid tw-border-brand-100 tw-pl-1">{entry.items.map((item) => <SidebarLeaf key={`${entry.label}-${item.label}`} item={item} />)}</div> : null}
    </div>
  );
}

export function AdminSidebar() {
  const location = useLocation();
  const [expandedGroupLabel, setExpandedGroupLabel] = useState<string | null>(() => getActiveGroupLabel(location.pathname));

  useEffect(() => {
    setExpandedGroupLabel(getActiveGroupLabel(location.pathname));
  }, [location.pathname]);

  const handleToggleGroup = (label: string) => {
    setExpandedGroupLabel((current) => (current === label ? null : label));
  };

  return (
    <aside className="tw-fixed tw-bottom-0 tw-left-0 tw-top-[72px] tw-z-[1040] tw-w-[248px] tw-border-0 tw-border-r tw-border-solid tw-border-slate-200/95 tw-bg-white tw-shadow-[12px_0_28px_rgba(15,23,42,0.05)] max-[992px]:tw-hidden" aria-label="CoParking admin sidebar">
      <div className="tw-h-full tw-overflow-y-auto tw-px-4 tw-pb-4 tw-pt-7 [scrollbar-width:none] [&::-webkit-scrollbar]:tw-hidden">
        <nav className="tw-grid tw-gap-2" role="menu" aria-label="CoParking admin navigation">
          {adminNavigation.map((entry, index) => {
            if (entry.kind === "divider") {
              return <div key={`divider-${index}`} className="tw-my-2 tw-h-px tw-bg-slate-100" />;
            }

            if (entry.kind === "group") {
              return (
                <SidebarGroup
                  key={entry.label}
                  entry={entry}
                  active={isEntryActive(entry, location.pathname)}
                  expanded={expandedGroupLabel === entry.label}
                  onToggle={handleToggleGroup}
                />
              );
            }

            const active = isPathMatch(location.pathname, entry.matches);

            return (
              <NavLink
                key={entry.label}
                to={entry.to}
                className={cn(
                  "tw-flex tw-min-h-[48px] tw-items-center tw-gap-3 tw-rounded-vm-sm tw-px-3 tw-text-[0.96rem] tw-font-extrabold tw-transition hover:tw-bg-brand-50 hover:tw-text-vm-primary hover:tw-no-underline",
                  active ? "tw-bg-vm-primary tw-text-white tw-shadow-[0_12px_24px_rgba(37,99,235,0.18)] hover:tw-translate-y-px hover:tw-bg-vm-primary-hover hover:tw-text-white" : "tw-bg-white tw-text-slate-900",
                )}
              >
                <span className={cn("tw-inline-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center tw-rounded-vm-sm", active ? "tw-bg-white/15 tw-text-white" : "tw-bg-brand-50 tw-text-vm-primary")}>
                  <SidebarIcon icon={entry.icon} />
                </span>
                <span className="tw-min-w-0 tw-truncate">{entry.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
