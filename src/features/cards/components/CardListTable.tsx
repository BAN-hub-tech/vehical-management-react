import { CardStateBadge } from "@/features/cards/components/CardStateBadge";
import type { CardManageRecord } from "@/features/cards/components/cardManageData";
import { PaginationFooter } from "@/shared/components/ui/PaginationFooter";

interface CardListTableProps {
  checkedIds: string[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSelectRow: (id: string) => void;
  onToggleAllRows: () => void;
  onToggleRowCheck: (id: string) => void;
  pageSize: number;
  rows: CardManageRecord[];
  selectedId: string | null;
  totalRecords: number;
}

function HeaderSort() {
  return <i className="fas fa-sort vm-card-table__sort" aria-hidden="true" />;
}

export function CardListTable({
  checkedIds,
  currentPage,
  onPageChange,
  onPageSizeChange,
  onSelectRow,
  onToggleAllRows,
  onToggleRowCheck,
  pageSize,
  rows,
  selectedId,
  totalRecords
}: CardListTableProps) {
  const startIndex = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex = totalRecords === 0 ? 0 : startIndex + rows.length - 1;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const checkedCount = rows.filter((row) => checkedIds.includes(row.id)).length;
  const allRowsChecked = rows.length > 0 && checkedCount === rows.length;
  const someRowsChecked = checkedCount > 0 && checkedCount < rows.length;

  return (
    <div className="vm-card-table-shell">
      <div className="table-responsive">
        <table className="table vm-card-table">
          <thead>
            <tr>
              <th className="vm-card-table__checkbox-cell">
                <button
                  className={`vm-card-check ${allRowsChecked ? "is-selected" : ""} ${someRowsChecked ? "is-partial" : ""}`}
                  type="button"
                  aria-label="Chọn tất cả dòng trong trang"
                  onClick={onToggleAllRows}
                >
                  {allRowsChecked ? <i className="fas fa-check" /> : someRowsChecked ? <i className="fas fa-minus" /> : null}
                </button>
              </th>
              <th>Mã thẻ <HeaderSort /></th>
              <th>Loại thẻ <HeaderSort /></th>
              <th>Loại xe</th>
              <th>Khách hàng</th>
              <th>Biển số</th>
              <th>Trạng thái</th>
              <th>Vé tháng</th>
              <th>Báo mất <HeaderSort /></th>
              <th>Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isSelected = row.id === selectedId;
              const isChecked = checkedIds.includes(row.id);

              return (
                <tr className={isSelected ? "is-selected" : ""} key={row.id} onClick={() => onSelectRow(row.id)}>
                  <td className="vm-card-table__checkbox-cell">
                    <button
                      className={`vm-card-check ${isChecked ? "is-selected" : ""}`}
                      type="button"
                      aria-label={`Chọn dòng ${row.cardCode}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        onToggleRowCheck(row.id);
                      }}
                    >
                      {isChecked ? <i className="fas fa-check" /> : null}
                    </button>
                  </td>
                  <td className="vm-card-table__code">{row.cardCode}</td>
                  <td>{row.cardTypeLabel}</td>
                  <td>{row.vehicleType}</td>
                  <td>{row.customerName ?? "-"}</td>
                  <td>{row.licensePlate ?? "-"}</td>
                  <td>
                    <CardStateBadge kind="inventory" label={row.inventoryStatusLabel} value={row.inventoryStatus} />
                  </td>
                  <td className={`vm-card-table__text-state ${row.subscriptionState !== "none" ? "is-highlight" : ""}`}>
                    {row.subscriptionStateLabel}
                  </td>
                  <td>
                    {row.lostCardState === "open" ? (
                      <span className="vm-card-table__alert-state">{row.lostCardStateLabel}</span>
                    ) : (
                      <span className="vm-card-table__muted-pill">{row.lostCardStateLabel}</span>
                    )}
                  </td>
                  <td>
                    <div className="vm-card-table__updated">
                      <span>{row.updatedDate}</span>
                      <strong>{row.updatedTime}</strong>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <PaginationFooter
        ariaLabel="Card pagination"
        currentPage={currentPage}
        endIndex={endIndex}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        pageSize={pageSize}
        startIndex={startIndex}
        totalPages={totalPages}
        totalRecords={totalRecords}
      />
    </div>
  );
}
