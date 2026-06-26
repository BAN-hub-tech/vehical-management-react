import type { ReactNode } from "react";

type DetailPanelProps = {
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
  empty?: ReactNode;
  hero?: ReactNode;
  title: string;
};

export function DetailPanel({ actions, children, className = "vm-catalog-detail", empty, hero, title }: DetailPanelProps) {
  return (
    <aside className={className}>
      <div className="vm-catalog-detail__top">
        <h3>{title}</h3>
        <button type="button" aria-label="Đóng">
          <i className="fas fa-times" />
        </button>
      </div>

      {empty ? (
        empty
      ) : (
        <>
          {hero}
          {children}
          {actions}
        </>
      )}
    </aside>
  );
}
