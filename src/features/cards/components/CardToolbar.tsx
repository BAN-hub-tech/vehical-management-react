import { SelectMenu } from "@/shared/components/ui/SelectMenu";

interface CardToolbarProps {
  cardTypeValue: string;
  vehicleTypeValue: string;
  inventoryStatusValue: string;
  subscriptionStatusValue: string;
  lostStatusValue: string;
  searchValue: string;
  onCardTypeChange: (value: string) => void;
  onInventoryStatusChange: (value: string) => void;
  onLostStatusChange: (value: string) => void;
  onReset: () => void;
  onSearchChange: (value: string) => void;
  onSubscriptionStatusChange: (value: string) => void;
  onVehicleTypeChange: (value: string) => void;
}

export function CardToolbar({
  cardTypeValue,
  vehicleTypeValue,
  inventoryStatusValue,
  subscriptionStatusValue,
  lostStatusValue,
  searchValue,
  onCardTypeChange,
  onInventoryStatusChange,
  onLostStatusChange,
  onReset,
  onSearchChange,
  onSubscriptionStatusChange,
  onVehicleTypeChange
}: CardToolbarProps) {
  return (
    <div className="vm-card-toolbar">
      <div className="vm-card-toolbar__search-row">
        <label className="vm-card-search">
          <i className="fas fa-search" />
          <input
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Mã thẻ, UID, biển số, khách hàng..."
            type="search"
            value={searchValue}
          />
        </label>
      </div>

      <div className="vm-card-toolbar__filter-row">
        <div className="vm-card-toolbar__filter-group vm-card-toolbar__filter-group--primary">
          <label className="vm-card-filter-field">
            <span>Loại thẻ</span>
            <SelectMenu
              ariaLabel="Loại thẻ"
              value={cardTypeValue}
              onChange={onCardTypeChange}
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Đăng ký", value: "Đăng ký" },
                { label: "Vãng lai", value: "Vãng lai" }
              ]}
            />
          </label>

          <label className="vm-card-filter-field">
            <span>Loại xe</span>
            <SelectMenu
              ariaLabel="Loại xe"
              value={vehicleTypeValue}
              onChange={onVehicleTypeChange}
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Xe máy", value: "Xe máy" },
                { label: "Xe ô tô", value: "Xe ô tô" },
                { label: "Xe khác", value: "Xe khác" }
              ]}
            />
          </label>

          <label className="vm-card-filter-field">
            <span>Trạng thái</span>
            <SelectMenu
              ariaLabel="Trạng thái"
              value={inventoryStatusValue}
              onChange={onInventoryStatusChange}
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Sẵn sàng", value: "available" },
                { label: "Đã gán", value: "assigned" },
                { label: "Trong bãi", value: "in_use" },
                { label: "Chờ xử lý", value: "pending" },
                { label: "Mất thẻ", value: "lost" },
                { label: "Khóa", value: "blocked" }
              ]}
            />
          </label>

          <label className="vm-card-filter-field">
            <span>Vé tháng</span>
            <SelectMenu
              ariaLabel="Vé tháng"
              value={subscriptionStatusValue}
              onChange={onSubscriptionStatusChange}
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Đang hiệu lực", value: "active" },
                { label: "Chờ duyệt", value: "pending" },
                { label: "Hết hạn", value: "expired" },
                { label: "Không", value: "none" }
              ]}
            />
          </label>
        </div>

        <div className="vm-card-toolbar__filter-group vm-card-toolbar__filter-group--secondary">
          <label className="vm-card-filter-field">
            <span>Báo mất</span>
            <SelectMenu
              ariaLabel="Báo mất"
              value={lostStatusValue}
              onChange={onLostStatusChange}
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Mở", value: "open" },
                { label: "Không", value: "none" }
              ]}
            />
          </label>

          <button className="btn vm-card-toolbar__reset" onClick={onReset} type="button">
            <i className="fas fa-redo-alt" />
            <span>Xóa bộ lọc</span>
          </button>
        </div>
      </div>
    </div>
  );
}
