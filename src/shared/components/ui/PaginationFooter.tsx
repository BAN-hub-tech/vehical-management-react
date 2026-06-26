import { SelectMenu } from "@/shared/components/ui/SelectMenu";

type PageItem = number | "ellipsis";

type PaginationFooterProps = {
  ariaLabel?: string;
  currentPage: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSize: number;
  pageSizeOptions?: number[];
  startIndex: number;
  totalPages: number;
  totalRecords: number;
  className?: string;
};

function formatCount(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value);
}

function getVisiblePages(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

export function PaginationFooter({
  ariaLabel = "Pagination",
  className = "",
  currentPage,
  endIndex,
  onPageChange,
  onPageSizeChange,
  pageSize,
  pageSizeOptions = [5, 10, 20],
  startIndex,
  totalPages,
  totalRecords
}: PaginationFooterProps) {
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className={`vm-card-table-footer ${className}`.trim()}>
      <p className="vm-card-table-footer__summary">
        {totalRecords === 0
          ? "Không có bản ghi phù hợp"
          : `Hiển thị ${formatCount(startIndex)} đến ${formatCount(endIndex)} của ${formatCount(totalRecords)} bản ghi`}
      </p>

      <div className="vm-card-table-footer__actions">
        <label className="vm-card-table-footer__page-size">
          <span>Số dòng mỗi trang</span>
          <SelectMenu
            ariaLabel="Số dòng mỗi trang"
            value={String(pageSize)}
            options={pageSizeOptions.map((option) => ({ label: String(option), value: String(option) }))}
            onChange={(nextValue) => onPageSizeChange(Number(nextValue))}
          />
        </label>

        <nav className="vm-card-pagination" aria-label={ariaLabel}>
          <button className="vm-card-pagination__nav" disabled={currentPage === 1} type="button" onClick={() => onPageChange(currentPage - 1)}>
            <i className="fas fa-chevron-left" />
          </button>

          {visiblePages.map((item, index) =>
            item === "ellipsis" ? (
              <span className="vm-card-pagination__ellipsis" key={`ellipsis-${index}`}>
                ...
              </span>
            ) : (
              <button
                className={`vm-card-pagination__page ${item === currentPage ? "is-active" : ""}`}
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            )
          )}

          <button className="vm-card-pagination__nav" disabled={currentPage === totalPages} type="button" onClick={() => onPageChange(currentPage + 1)}>
            <i className="fas fa-chevron-right" />
          </button>
        </nav>
      </div>
    </div>
  );
}
