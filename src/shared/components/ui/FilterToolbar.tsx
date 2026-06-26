import type { ReactNode } from "react";

type FilterToolbarProps = {
  children?: ReactNode;
  className?: string;
  onReset: () => void;
  onSearchChange: (value: string) => void;
  resetIconClassName?: string;
  searchLabel?: string;
  searchPlaceholder: string;
  searchValue: string;
};

export function FilterToolbar({
  children,
  className = "",
  onReset,
  onSearchChange,
  resetIconClassName = "fas fa-sync-alt",
  searchLabel = "Tìm kiếm",
  searchPlaceholder,
  searchValue
}: FilterToolbarProps) {
  return (
    <div className={className}>
      <div className="vm-catalog-search-field">
        <span aria-hidden="true">{searchLabel}</span>
        <label className="vm-catalog-search">
          <i className="fas fa-search" />
          <input value={searchValue} placeholder={searchPlaceholder} onChange={(event) => onSearchChange(event.target.value)} />
        </label>
      </div>

      {children}

      <button className="btn vm-catalog-reset" type="button" onClick={onReset}>
        <i className={resetIconClassName} />
        <span>Xóa bộ lọc</span>
      </button>
    </div>
  );
}
