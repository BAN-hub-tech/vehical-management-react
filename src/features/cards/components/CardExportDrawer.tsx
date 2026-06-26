import { useEffect, useState } from "react";

interface CardExportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  totalRecords: number;
}

type ExportFormat = "excel" | "csv" | "pdf";
type ExportScope = "page" | "filtered" | "all";
type DrawerPhase = "opening" | "open" | "closing";

const DRAWER_ANIMATION_MS = 240;

function formatRecordCount(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

export function CardExportDrawer({ isOpen, onClose, totalRecords }: CardExportDrawerProps) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [phase, setPhase] = useState<DrawerPhase>(isOpen ? "open" : "closing");
  const [format, setFormat] = useState<ExportFormat>("excel");
  const [scope, setScope] = useState<ExportScope>("filtered");
  const [includeOwner, setIncludeOwner] = useState(true);
  const [includeSubscription, setIncludeSubscription] = useState(true);
  const [includeLostCard, setIncludeLostCard] = useState(true);
  const [includeTimeline, setIncludeTimeline] = useState(false);

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

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRendered, onClose]);

  if (!isRendered) {
    return null;
  }

  return (
    <div className="vm-card-export-drawer" data-state={phase} role="dialog" aria-modal="true" aria-labelledby="vm-card-export-drawer-title">
      <button className="vm-card-export-drawer__backdrop" type="button" aria-label="Đóng drawer xuất dữ liệu" onClick={onClose} />

      <aside className="vm-card-export-drawer__panel">
        <div className="vm-card-export-drawer__header">
          <div>
            <h3 id="vm-card-export-drawer-title">Xuất dữ liệu thẻ</h3>
            <p className="vm-card-export-drawer__subtitle">Chọn định dạng và phạm vi xuất phù hợp với báo cáo bạn đang cần.</p>
          </div>

          <button className="vm-card-export-drawer__close" type="button" aria-label="Đóng drawer" onClick={onClose}>
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="vm-card-export-drawer__body">
          <section className="vm-card-export-drawer__section">
            <div className="vm-card-export-drawer__section-head">
              <h4>Định dạng file</h4>
              <span>Xuất nhanh</span>
            </div>

            <div className="vm-card-export-drawer__format-grid">
              {[
                { value: "excel" as const, label: "Excel", helper: "Báo cáo tổng hợp" },
                { value: "csv" as const, label: "CSV", helper: "Dữ liệu thô" },
                { value: "pdf" as const, label: "PDF", helper: "Chia sẻ nội bộ" }
              ].map((item) => (
                <button
                  key={item.value}
                  className={`vm-card-export-drawer__format ${format === item.value ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setFormat(item.value)}
                >
                  <strong>{item.label}</strong>
                  <span className="vm-card-export-drawer__format-help" aria-hidden="true">
                    ?
                    <span className="vm-card-export-drawer__format-tooltip">{item.helper}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="vm-card-export-drawer__section">
            <div className="vm-card-export-drawer__section-head">
              <h4>Phạm vi dữ liệu</h4>
              <span>{formatRecordCount(totalRecords)} bản ghi</span>
            </div>

            <div className="vm-card-export-drawer__scope-list">
              {[
                { value: "page" as const, label: "Trang hiện tại", helper: "Lấy đúng dữ liệu đang hiển thị trong bảng" },
                { value: "filtered" as const, label: "Theo bộ lọc hiện tại", helper: "Áp dụng tất cả bộ lọc đang bật" },
                { value: "all" as const, label: "Toàn bộ danh sách", helper: "Xuất toàn bộ dữ liệu thẻ trong hệ thống" }
              ].map((item) => (
                <button
                  key={item.value}
                  className={`vm-card-export-drawer__scope ${scope === item.value ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setScope(item.value)}
                >
                  <span className="vm-card-export-drawer__scope-mark" aria-hidden="true" />
                  <span className="vm-card-export-drawer__scope-copy">
                    <strong>{item.label}</strong>
                    <small>{item.helper}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="vm-card-export-drawer__section">
            <div className="vm-card-export-drawer__section-head">
              <h4>Trường dữ liệu đi kèm</h4>
              <span>Tùy chọn</span>
            </div>

            <div className="vm-card-export-drawer__toggle-list">
              {[
                {
                  checked: includeOwner,
                  label: "Thông tin chủ thẻ",
                  helper: "Tên khách hàng, biển số, số điện thoại",
                  onChange: setIncludeOwner
                },
                {
                  checked: includeSubscription,
                  label: "Trạng thái vé tháng",
                  helper: "Hiệu lực, chờ duyệt, hết hạn",
                  onChange: setIncludeSubscription
                },
                {
                  checked: includeLostCard,
                  label: "Thông tin báo mất",
                  helper: "Trạng thái mở, phí mất thẻ",
                  onChange: setIncludeLostCard
                },
                {
                  checked: includeTimeline,
                  label: "Mốc cập nhật",
                  helper: "Ngày giờ cập nhật cuối cùng",
                  onChange: setIncludeTimeline
                }
              ].map((item) => (
                <label key={item.label} className="vm-card-export-drawer__toggle">
                  <input checked={item.checked} type="checkbox" onChange={(event) => item.onChange(event.target.checked)} />
                  <span className="vm-card-export-drawer__toggle-box" aria-hidden="true">
                    <i className="fas fa-check" />
                  </span>
                  <span className="vm-card-export-drawer__toggle-copy">
                    <strong>{item.label}</strong>
                    <small>{item.helper}</small>
                  </span>
                </label>
              ))}
            </div>
          </section>

          <div className="vm-card-export-drawer__summary">
            <div>
              <span>Sẵn sàng xuất</span>
              <strong>{formatRecordCount(totalRecords)} bản ghi</strong>
            </div>
            <p>
              {format === "excel" ? "Tệp Excel nhiều sheet" : format === "csv" ? "Tệp CSV một bảng dữ liệu" : "Tệp PDF dạng báo cáo"}
            </p>
          </div>
        </div>

        <div className="vm-card-export-drawer__footer">
          <button className="btn vm-card-export-drawer__secondary" type="button" onClick={onClose}>
            Hủy
          </button>
          <button className="btn vm-card-export-drawer__primary" type="button">
            <i className="fas fa-file-export" />
            <span>Xuất file</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
