import type { ReactNode } from "react";
import { DetailPanel } from "@/shared/components/ui/DetailPanel";
import { FilterToolbar } from "@/shared/components/ui/FilterToolbar";
import { MetricCard } from "@/shared/components/ui/MetricCard";
import { PaginationFooter } from "@/shared/components/ui/PaginationFooter";
import { SelectMenu, type SelectMenuOption } from "@/shared/components/ui/SelectMenu";
import { StatusTabs } from "@/shared/components/ui/StatusTabs";
import type { CatalogStatus, CatalogStatusTabValue, TicketCatalogRecord, VehicleCatalogRecord } from "./catalogManageData";

type MetricTone = "blue" | "green" | "red";

export type CatalogMetric = {
  label: string;
  value: string;
  delta: string;
  tone: MetricTone;
  icon: "ticket" | "vehicle" | "check" | "x";
};

type CatalogHeaderProps = {
  createLabel: string;
  title: string;
};

type CatalogStatusTabsProps = {
  activeValue: CatalogStatusTabValue;
  counts: Record<CatalogStatusTabValue, number>;
  onChange: (value: CatalogStatusTabValue) => void;
};

type CatalogToolbarProps = {
  children?: ReactNode;
  variant?: "ticket" | "vehicle";
  onReset: () => void;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  searchValue: string;
};

type CatalogPaginationProps = {
  currentPage: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSize: number;
  startIndex: number;
  totalPages: number;
  totalRecords: number;
};

type TicketTableProps = {
  rows: TicketCatalogRecord[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

type VehicleGridProps = {
  rows: VehicleCatalogRecord[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

type TicketDetailProps = {
  row: TicketCatalogRecord | null;
};

type VehicleDetailProps = {
  row: VehicleCatalogRecord | null;
};

const statusLabels: Record<CatalogStatus, string> = {
  active: "ACTIVE",
  inactive: "INACTIVE"
};

const statusText: Record<CatalogStatus, string> = {
  active: "Đang hoạt động",
  inactive: "Ngừng dùng"
};

function formatCount(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function Sparkline({ tone }: { tone: MetricTone }) {
  const points = tone === "red" ? "2,24 14,16 24,20 34,14 46,18 58,16 70,22 82,18 94,20 106,10" : "2,24 14,18 24,21 34,16 46,19 58,15 70,17 82,11 94,18 106,8";

  return (
    <svg aria-hidden="true" className="vm-catalog-metric__sparkline" viewBox="0 0 108 32">
      <polyline className={`vm-catalog-metric__sparkline-line vm-catalog-metric__sparkline-line--${tone}`} points={points} />
    </svg>
  );
}

export function CatalogStatusBadge({ status }: { status: CatalogStatus }) {
  return <span className={`vm-catalog-status vm-catalog-status--${status}`}>{statusLabels[status]}</span>;
}

export function CatalogIcon({
  detail = false,
  icon,
  tone = "blue"
}: {
  detail?: boolean;
  icon: CatalogMetric["icon"] | VehicleCatalogRecord["icon"];
  tone?: MetricTone;
}) {
  const className = `vm-catalog-icon vm-catalog-icon--${tone} ${detail ? "vm-catalog-icon--detail" : ""}`;

  if (icon === "ticket") {
    return (
      <span className={className}>
        <i className="fas fa-ticket-alt" />
      </span>
    );
  }

  if (icon === "vehicle") {
    return (
      <span className={className}>
        <i className="fas fa-car" />
      </span>
    );
  }

  if (icon === "check") {
    return (
      <span className={className}>
        <i className="fas fa-check" />
      </span>
    );
  }

  if (icon === "x") {
    return (
      <span className={className}>
        <i className="fas fa-times" />
      </span>
    );
  }

  const vehicleIconClass: Record<VehicleCatalogRecord["icon"], string> = {
    motorbike: "fas fa-motorcycle",
    car: "fas fa-car-side",
    bike: "fas fa-bicycle",
    scooter: "fas fa-charging-station",
    truck: "fas fa-truck",
    heavyTruck: "fas fa-truck-moving"
  };

  return (
    <span className={className}>
      <i className={vehicleIconClass[icon]} />
    </span>
  );
}

export function CatalogHeader({ createLabel, title }: CatalogHeaderProps) {
  return (
    <div className="vm-catalog-header">
      <div className="vm-catalog-header__main">
        <h2>{title}</h2>
        <button className="vm-catalog-header__help" type="button">
          <i className="far fa-question-circle" />
          <span>Hướng dẫn &amp; Trợ giúp</span>
        </button>
      </div>

      <div className="vm-catalog-header__actions">
        <button className="btn vm-catalog-btn vm-catalog-btn--primary" type="button">
          <i className="fas fa-plus" />
          <span>{createLabel}</span>
        </button>
        <button className="btn vm-catalog-btn vm-catalog-btn--secondary" type="button">
          <i className="fas fa-download" />
          <span>Xuất dữ liệu</span>
          <i className="fas fa-chevron-down" />
        </button>
      </div>
    </div>
  );
}

export function CatalogMetricGrid({ items }: { items: CatalogMetric[] }) {
  return (
    <div className="vm-catalog-metrics" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((item) => (
        <MetricCard
          className="vm-catalog-metric"
          delta={item.delta}
          deltaClassName={`vm-catalog-metric__delta vm-catalog-metric__delta--${item.tone}`}
          icon={<CatalogIcon icon={item.icon} tone={item.tone} />}
          key={item.label}
          label={item.label}
          sparkline={<Sparkline tone={item.tone} />}
          value={item.value}
        />
      ))}
    </div>
  );
}

export function CatalogStatusTabs({ activeValue, counts, onChange }: CatalogStatusTabsProps) {
  const tabs = [
    { value: "all" as const, label: "Tất cả" },
    { value: "active" as const, label: "Đang hoạt động" },
    { value: "inactive" as const, label: "Ngừng dùng" }
  ];

  return <StatusTabs activeValue={activeValue} ariaLabel="Catalog status tabs" className="vm-catalog-tabs-shell" counts={counts} onChange={onChange} tabs={tabs} />;
}

export function CatalogToolbar({ children, onReset, onSearchChange, searchPlaceholder, searchValue, variant = "ticket" }: CatalogToolbarProps) {
  return (
    <FilterToolbar
      className={`vm-catalog-toolbar vm-catalog-toolbar--${variant}`}
      onReset={onReset}
      onSearchChange={onSearchChange}
      searchPlaceholder={searchPlaceholder}
      searchValue={searchValue}
    >
      {children}
    </FilterToolbar>
  );
}

export function CatalogFilterSelect({
  label,
  onChange,
  options,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  options: SelectMenuOption[];
  value: string;
}) {
  return (
    <label className="vm-catalog-filter">
      <span>{label}</span>
      <SelectMenu ariaLabel={label} value={value} options={options} onChange={onChange} />
    </label>
  );
}

export function CatalogPagination({
  currentPage,
  endIndex,
  onPageChange,
  onPageSizeChange,
  pageSize,
  startIndex,
  totalPages,
  totalRecords
}: CatalogPaginationProps) {
  return (
    <PaginationFooter
      ariaLabel="Catalog pagination"
      className="vm-catalog-card-pagination"
      currentPage={currentPage}
      endIndex={endIndex}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      pageSize={pageSize}
      startIndex={startIndex}
      totalPages={totalPages}
      totalRecords={totalRecords}
    />
  );
}

export function TicketCatalogTable({ onSelect, rows, selectedId }: TicketTableProps) {
  return (
    <div className="vm-catalog-table-shell">
      <table className="table vm-catalog-table">
        <thead>
          <tr>
            <th className="vm-catalog-table__radio-cell" />
            <th>Mã</th>
            <th>Tên</th>
            <th>Thời hạn</th>
            <th>Trạng thái</th>
            <th>Áp dụng giá</th>
            <th>Cập nhật</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const selected = row.id === selectedId;

            return (
              <tr className={selected ? "is-selected" : ""} key={row.id} onClick={() => onSelect(row.id)}>
                <td className="vm-catalog-table__radio-cell">
                  <span className={`vm-catalog-radio ${selected ? "is-selected" : ""}`}>
                    {selected ? <i className="fas fa-check" /> : null}
                  </span>
                </td>
                <td className="vm-catalog-table__code">{row.code}</td>
                <td>{row.name}</td>
                <td>{row.duration}</td>
                <td>
                  <CatalogStatusBadge status={row.status} />
                </td>
                <td>{row.priceRuleCount}</td>
                <td>
                  <div className="vm-catalog-updated">
                    <span>{row.updatedAt}</span>
                    <strong>{row.updatedTime}</strong>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function TicketDetailPanel({ row }: TicketDetailProps) {
  if (!row) {
    return (
      <DetailPanel title="Thông tin loại vé" empty={<p className="vm-catalog-detail__empty">Chưa có loại vé phù hợp.</p>} />
    );
  }

  return (
    <DetailPanel
      title="Thông tin loại vé"
      hero={
        <div className="vm-catalog-detail__hero">
        <CatalogIcon icon="ticket" tone="blue" detail />
        <div>
          <span>Mã</span>
          <strong>{row.code}</strong>
        </div>
        </div>
      }
      actions={
        <button className="btn vm-catalog-detail__update" type="button">
          <i className="far fa-edit" />
          <span>Cập nhật</span>
        </button>
      }
    >
      <dl className="vm-catalog-detail__list">
        <div>
          <dt>Tên</dt>
          <dd>{row.name}</dd>
        </div>
        <div>
          <dt>Thời hạn</dt>
          <dd>{row.duration}</dd>
        </div>
        <div>
          <dt>Trạng thái</dt>
          <dd>
            <CatalogStatusBadge status={row.status} />
          </dd>
        </div>
        <div>
          <dt>Áp dụng giá</dt>
          <dd>{row.priceRuleCount} rule giá</dd>
        </div>
        <div>
          <dt>Mô tả</dt>
          <dd>{row.description}</dd>
        </div>
      </dl>

      <div className="vm-catalog-detail__meta">
        <div>
          <span>Cập nhật lần cuối</span>
          <strong>
            {row.updatedAt} {row.updatedTime}
          </strong>
        </div>
        <div>
          <span>Người cập nhật</span>
          <strong>Nguyễn Văn Admin</strong>
        </div>
      </div>
    </DetailPanel>
  );
}

export function VehicleCatalogGrid({ onSelect, rows, selectedId }: VehicleGridProps) {
  return (
    <div className="vm-catalog-vehicle-grid">
      {rows.map((row) => {
        const selected = row.id === selectedId;
        const tone = row.status === "active" ? "blue" : "red";

        return (
          <button className={`vm-catalog-vehicle-card ${selected ? "is-selected" : ""}`} key={row.id} type="button" onClick={() => onSelect(row.id)}>
            {selected ? (
              <span className="vm-catalog-vehicle-card__check">
                <i className="fas fa-check" />
              </span>
            ) : null}
            <div className="vm-catalog-vehicle-card__head">
              <CatalogIcon icon={row.icon} tone={tone} />
              <div>
                <strong>{row.name}</strong>
                <CatalogStatusBadge status={row.status} />
              </div>
            </div>
            <dl className="vm-catalog-vehicle-card__copy">
              <div>
                <dt>Mã</dt>
                <dd>{row.code}</dd>
              </div>
              <div>
                <dt>Mô tả</dt>
                <dd>{row.description}</dd>
              </div>
            </dl>
            <div className="vm-catalog-vehicle-card__stats">
              <div>
                <span>Số xe liên kết</span>
                <strong>{formatCount(row.linkedCount)}</strong>
              </div>
              <div>
                <span>Số rule giá</span>
                <strong>{formatCount(row.priceRuleCount)}</strong>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function VehicleDetailPanel({ row }: VehicleDetailProps) {
  if (!row) {
    return (
      <DetailPanel title="Thông tin loại phương tiện" empty={<p className="vm-catalog-detail__empty">Chưa có loại phương tiện phù hợp.</p>} />
    );
  }

  return (
    <DetailPanel
      title="Thông tin loại phương tiện"
      hero={
        <div className="vm-catalog-detail__hero vm-catalog-detail__hero--center">
          <CatalogIcon icon={row.icon} tone={row.status === "active" ? "blue" : "red"} detail />
        </div>
      }
      actions={
        <button className="btn vm-catalog-detail__update" type="button">
          <i className="far fa-edit" />
          <span>Cập nhật</span>
        </button>
      }
    >
      <dl className="vm-catalog-detail__list">
        <div>
          <dt>Mã</dt>
          <dd>{row.code}</dd>
        </div>
        <div>
          <dt>Tên</dt>
          <dd>{row.name}</dd>
        </div>
        <div>
          <dt>Trạng thái</dt>
          <dd>
            <CatalogStatusBadge status={row.status} />
          </dd>
        </div>
        <div>
          <dt>Mô tả</dt>
          <dd>{row.description}</dd>
        </div>
        <div>
          <dt>Số xe liên kết</dt>
          <dd>{formatCount(row.linkedCount)}</dd>
        </div>
        <div>
          <dt>Số rule giá liên kết</dt>
          <dd>{formatCount(row.priceRuleCount)}</dd>
        </div>
      </dl>

      <div className="vm-catalog-detail__meta">
        <div>
          <span>Cập nhật lần cuối</span>
          <strong>
            {row.updatedAt} {row.updatedTime}
          </strong>
        </div>
        <div>
          <span>Người cập nhật</span>
          <strong>Nguyễn Văn Admin</strong>
        </div>
      </div>
    </DetailPanel>
  );
}

export function getStatusCounts<T extends { status: CatalogStatus }>(rows: T[]) {
  return {
    all: rows.length,
    active: rows.filter((row) => row.status === "active").length,
    inactive: rows.filter((row) => row.status === "inactive").length
  };
}

export { formatCount, statusText };
