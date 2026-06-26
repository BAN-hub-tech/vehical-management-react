import { useEffect, useState } from "react";
import { CardStateBadge } from "@/features/cards/components/CardStateBadge";
import type { CardManageRecord } from "@/features/cards/components/cardManageData";

interface CardDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  row: CardManageRecord | null;
}

type DrawerPhase = "opening" | "open" | "closing";

const DRAWER_ANIMATION_MS = 240;

function CardPreview() {
  return (
    <div className="vm-card-preview" aria-hidden="true">
      <span className="vm-card-preview__stripe vm-card-preview__stripe--top" />
      <span className="vm-card-preview__chip" />
      <span className="vm-card-preview__stripe vm-card-preview__stripe--mid" />
      <span className="vm-card-preview__stripe vm-card-preview__stripe--small" />
      <span className="vm-card-preview__mark vm-card-preview__mark--circle" />
      <span className="vm-card-preview__mark vm-card-preview__mark--line" />
    </div>
  );
}

export function CardDetailPanel({ isOpen, onClose, row }: CardDetailPanelProps) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [phase, setPhase] = useState<DrawerPhase>(isOpen ? "open" : "closing");

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setPhase("opening");

      const openTimer = window.setTimeout(() => {
        setPhase("open");
      }, 16);

      return () => window.clearTimeout(openTimer);
    }

    if (!isRendered) {
      return undefined;
    }

    setPhase("closing");

    const closeTimer = window.setTimeout(() => {
      setIsRendered(false);
    }, DRAWER_ANIMATION_MS);

    return () => window.clearTimeout(closeTimer);
  }, [isOpen, isRendered]);

  useEffect(() => {
    if (!isRendered) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRendered, onClose]);

  if (!isRendered) {
    return null;
  }

  return (
    <div className="vm-card-detail-drawer" data-state={phase} role="dialog" aria-modal="true" aria-labelledby="vm-card-detail-drawer-title">
      <button className="vm-card-detail-drawer__backdrop" type="button" aria-label="Đóng drawer thông tin thẻ" onClick={onClose} />

      <aside className="vm-card-detail vm-card-detail-drawer__panel">
        {!row ? (
          <div className="vm-card-detail__empty">
            <i className="far fa-clone" />
            <p>Chưa có thẻ phù hợp với bộ lọc hiện tại.</p>
          </div>
        ) : (
          <>
            <div className="vm-card-detail__top">
              <h3 id="vm-card-detail-drawer-title">Thông tin thẻ</h3>
              <button className="vm-card-detail__close" type="button" aria-label="Đóng drawer" onClick={onClose}>
                <i className="fas fa-times" />
              </button>
            </div>

            <div className="vm-card-detail__hero">
              <CardPreview />
              <div className="vm-card-detail__identity">
                <span>Mã thẻ</span>
                <strong>{row.cardCode}</strong>
                <p>{row.cardTypeLabel}</p>
              </div>
            </div>

            <div className="vm-card-detail__facts">
              <div className="vm-card-detail__fact">
                <span>UID</span>
                <strong>
                  {row.uid}
                  <i className="far fa-copy" />
                </strong>
              </div>
              <div className="vm-card-detail__fact">
                <span>Loại thẻ</span>
                <strong>{row.cardTypeLabel}</strong>
              </div>
              <div className="vm-card-detail__fact">
                <span>Loại xe</span>
                <strong>{row.vehicleType}</strong>
              </div>
              <div className="vm-card-detail__fact">
                <span>Trạng thái</span>
                <CardStateBadge kind="inventory" label={row.inventoryStatusLabel} value={row.inventoryStatus} />
              </div>
            </div>

            <div className="vm-card-detail__section">
              <h4>Chủ thẻ hiện tại</h4>
              <div className="vm-card-detail__line">
                <span>
                  <i className="far fa-user" /> {row.customerName ?? "-"}
                </span>
                <strong>{row.phoneNumber ?? "-"}</strong>
              </div>
              <div className="vm-card-detail__line">
                <span>Biển số</span>
                <strong>{row.licensePlate ?? "-"}</strong>
              </div>
            </div>

            <div className="vm-card-detail__section">
              <h4>Vé tháng</h4>
              <div className="vm-card-detail__line">
                <span>Trạng thái</span>
                <strong className="vm-card-detail__muted-badge">
                  {row.subscriptionState === "none" ? "Không có vé tháng" : row.subscriptionStateLabel}
                </strong>
              </div>
              <div className="vm-card-detail__line">
                <span>Hiệu lực</span>
                <strong>-</strong>
              </div>
              <div className="vm-card-detail__line">
                <span>Hết hạn</span>
                <strong>-</strong>
              </div>
            </div>

            <div className="vm-card-detail__section">
              <h4>Báo mất</h4>
              <div className="vm-card-detail__line">
                <span>Trạng thái</span>
                <strong>{row.lostCardState === "open" ? "Mở" : "Không"}</strong>
              </div>
              <div className="vm-card-detail__line">
                <span>Phí mất thẻ</span>
                <strong>{row.lostCardState === "open" ? "100.000đ" : "0đ"}</strong>
              </div>
            </div>

            <div className="vm-card-detail__footer">
              <button className="btn vm-card-detail__footer-btn vm-card-detail__footer-btn--primary" type="button">
                <i className="far fa-edit" />
                <span>Cập nhật</span>
              </button>
              <button className="btn vm-card-detail__footer-btn vm-card-detail__footer-btn--secondary" type="button">
                <i className="fas fa-lock" />
                <span>Khóa thẻ</span>
              </button>
              <button className="btn vm-card-detail__footer-btn vm-card-detail__footer-btn--danger" type="button">
                <i className="far fa-exclamation-circle" />
                <span>Báo mất thẻ</span>
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
