import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  CatalogFilterSelect,
  CatalogHeader,
  CatalogMetricGrid,
  CatalogPagination,
  CatalogStatusTabs,
  CatalogToolbar,
  TicketCatalogTable,
  TicketDetailPanel,
  VehicleCatalogGrid,
  VehicleDetailPanel,
  getStatusCounts,
  type CatalogMetric
} from "@/features/catalog/components/CatalogManageComponents";
import {
  ticketCatalogRecords,
  vehicleCatalogRecords,
  type CatalogStatus,
  type CatalogStatusTabValue,
  type TicketCatalogRecord,
  type VehicleCatalogRecord
} from "@/features/catalog/components/catalogManageData";
import { FilterControls } from "../../../shared/components/form/FilterControls";
import { ActionButtons } from "../../../shared/components/table/ActionButtons";
import { AdminTablePage } from "../../../shared/components/table/AdminTablePage";
import { customerParkingFees, vehicleTypes, visitorParkingFees } from "../../../shared/data/mockData";
import type { TableColumn } from "../../../shared/types/common";

type VisitorFeeRow = (typeof visitorParkingFees)[number];
type CustomerFeeRow = (typeof customerParkingFees)[number];

function matchesText(values: Array<string | number | undefined>, searchValue: string) {
  if (!searchValue.trim()) return true;

  const search = searchValue.trim().toLowerCase();
  return values.some((value) => String(value ?? "").toLowerCase().includes(search));
}

function getPageItems<T>(records: T[], currentPage: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;

  return {
    endDisplayIndex: records.length === 0 ? 0 : startIndex + records.slice(startIndex, startIndex + pageSize).length,
    items: records.slice(startIndex, startIndex + pageSize),
    safeCurrentPage,
    startDisplayIndex: records.length === 0 ? 0 : startIndex + 1,
    totalPages
  };
}

const ticketMetrics: CatalogMetric[] = [
  { label: "Tổng loại vé", value: "12", delta: "+2 so với hôm qua", tone: "blue", icon: "ticket" },
  { label: "Đang hoạt động", value: "9", delta: "+1 so với hôm qua", tone: "green", icon: "check" },
  { label: "Ngừng dùng", value: "3", delta: "-1 so với hôm qua", tone: "red", icon: "x" }
];

const vehicleMetrics: CatalogMetric[] = [
  { label: "Tổng loại xe", value: "6", delta: "+1 so với hôm qua", tone: "blue", icon: "vehicle" },
  { label: "Đang hoạt động", value: "5", delta: "+1 so với hôm qua", tone: "green", icon: "check" },
  { label: "Ngừng dùng", value: "1", delta: "-1 so với hôm qua", tone: "red", icon: "x" }
];

const statusOptions = [
  { label: "Tất cả", value: "all" },
  { label: "Đang hoạt động", value: "active" },
  { label: "Ngừng dùng", value: "inactive" }
];

const priceRuleOptions = [
  { label: "Tất cả", value: "all" },
  { label: "Đã áp dụng giá", value: "has-price" },
  { label: "Chưa có giá", value: "no-price" }
];

function CatalogPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="content-header vm-card-content-header">
      <section className="content vm-admin-content">
        <div className="container-fluid">
          <div className="vm-catalog-page">{children}</div>
        </div>
      </section>
    </div>
  );
}

export function TicketListPage() {
  const [activeStatus, setActiveStatus] = useState<CatalogStatusTabValue>("all");
  const [statusValue, setStatusValue] = useState("all");
  const [priceRuleValue, setPriceRuleValue] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedId, setSelectedId] = useState(ticketCatalogRecords[0]?.id ?? null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredRecords = ticketCatalogRecords.filter((row) => {
    const matchesTab = activeStatus === "all" ? true : row.status === activeStatus;
    const matchesStatus = statusValue === "all" ? true : row.status === (statusValue as CatalogStatus);
    const matchesPrice =
      priceRuleValue === "all" ? true : priceRuleValue === "has-price" ? row.priceRuleCount > 0 : row.priceRuleCount === 0;

    return matchesTab && matchesStatus && matchesPrice && matchesText([row.code, row.name, row.duration, row.description], searchValue);
  });

  const page = getPageItems<TicketCatalogRecord>(filteredRecords, currentPage, pageSize);
  const effectiveSelectedId = filteredRecords.some((row) => row.id === selectedId) ? selectedId : filteredRecords[0]?.id ?? null;
  const selectedRecord = filteredRecords.find((row) => row.id === effectiveSelectedId) ?? null;

  useEffect(() => {
    if (currentPage !== page.safeCurrentPage) {
      setCurrentPage(page.safeCurrentPage);
    }
  }, [currentPage, page.safeCurrentPage]);

  const resetFilters = () => {
    setActiveStatus("all");
    setStatusValue("all");
    setPriceRuleValue("all");
    setSearchValue("");
    setCurrentPage(1);
  };

  return (
    <CatalogPageShell>
      <CatalogHeader createLabel="Thêm loại vé" title="Loại vé" />
      <CatalogMetricGrid items={ticketMetrics} />
      <CatalogStatusTabs activeValue={activeStatus} counts={getStatusCounts(ticketCatalogRecords)} onChange={(value) => {
        setActiveStatus(value);
        setCurrentPage(1);
      }} />

      <div className="vm-catalog-board vm-catalog-board--ticket">
        <main className="vm-catalog-main">
          <CatalogToolbar
            variant="ticket"
            searchPlaceholder="Tìm mã, tên loại vé..."
            searchValue={searchValue}
            onSearchChange={(value) => {
              setSearchValue(value);
              setCurrentPage(1);
            }}
            onReset={resetFilters}
          >
            <CatalogFilterSelect
              label="Trạng thái"
              options={statusOptions}
              value={statusValue}
              onChange={(value) => {
                setStatusValue(value);
                setCurrentPage(1);
              }}
            />
            <CatalogFilterSelect
              label="Áp dụng giá"
              options={priceRuleOptions}
              value={priceRuleValue}
              onChange={(value) => {
                setPriceRuleValue(value);
                setCurrentPage(1);
              }}
            />
          </CatalogToolbar>

          <TicketCatalogTable rows={page.items} selectedId={effectiveSelectedId} onSelect={setSelectedId} />
          <CatalogPagination
            currentPage={page.safeCurrentPage}
            endIndex={page.endDisplayIndex}
            onPageChange={setCurrentPage}
            onPageSizeChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
            pageSize={pageSize}
            startIndex={page.startDisplayIndex}
            totalPages={page.totalPages}
            totalRecords={filteredRecords.length}
          />
        </main>

        <TicketDetailPanel row={selectedRecord} />
      </div>
    </CatalogPageShell>
  );
}

export function VehicleListPage() {
  const [statusValue, setStatusValue] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [selectedId, setSelectedId] = useState(vehicleCatalogRecords[0]?.id ?? null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredRecords = vehicleCatalogRecords.filter((row) => {
    const matchesStatus = statusValue === "all" ? true : row.status === (statusValue as CatalogStatus);

    return matchesStatus && matchesText([row.code, row.name, row.description], searchValue);
  });

  const page = getPageItems<VehicleCatalogRecord>(filteredRecords, currentPage, pageSize);
  const effectiveSelectedId = filteredRecords.some((row) => row.id === selectedId) ? selectedId : filteredRecords[0]?.id ?? null;
  const selectedRecord = filteredRecords.find((row) => row.id === effectiveSelectedId) ?? null;

  useEffect(() => {
    if (currentPage !== page.safeCurrentPage) {
      setCurrentPage(page.safeCurrentPage);
    }
  }, [currentPage, page.safeCurrentPage]);

  const resetFilters = () => {
    setStatusValue("all");
    setSearchValue("");
    setCurrentPage(1);
  };

  return (
    <CatalogPageShell>
      <CatalogHeader createLabel="Thêm loại xe" title="Loại phương tiện" />
      <CatalogMetricGrid items={vehicleMetrics} />

      <div className="vm-catalog-board vm-catalog-board--vehicle">
        <main className="vm-catalog-main">
          <CatalogToolbar
            variant="vehicle"
            searchPlaceholder="Tìm mã, tên loại xe..."
            searchValue={searchValue}
            onSearchChange={(value) => {
              setSearchValue(value);
              setCurrentPage(1);
            }}
            onReset={resetFilters}
          >
            <CatalogFilterSelect
              label="Trạng thái"
              options={statusOptions}
              value={statusValue}
              onChange={(value) => {
                setStatusValue(value);
                setCurrentPage(1);
              }}
            />
          </CatalogToolbar>

          <VehicleCatalogGrid rows={page.items} selectedId={effectiveSelectedId} onSelect={setSelectedId} />
          <CatalogPagination
            currentPage={page.safeCurrentPage}
            endIndex={page.endDisplayIndex}
            onPageChange={setCurrentPage}
            onPageSizeChange={(value) => {
              setPageSize(value);
              setCurrentPage(1);
            }}
            pageSize={pageSize}
            startIndex={page.startDisplayIndex}
            totalPages={page.totalPages}
            totalRecords={filteredRecords.length}
          />
        </main>

        <VehicleDetailPanel row={selectedRecord} />
      </div>
    </CatalogPageShell>
  );
}

const badge = (status: string) => <span className="badge bg-cyan">{status}</span>;

const addButton = (href: string) => (
  <div className="form-group col-2 ml-auto mr-3 mt-3">
    <Link to={href} className="btn btn-info btn-block">
      <i className="fas fa-plus-circle" /> Thêm mới
    </Link>
  </div>
);

export function VisitorParkingFeePage() {
  const columns: TableColumn<VisitorFeeRow>[] = [
    { key: "stt", label: "STT", render: (_row, index) => index + 1 },
    { key: "id", label: "ID bảng giá" },
    { key: "vehicleType", label: "Loại xe" },
    { key: "timeRange", label: "Khung giờ" },
    { key: "price", label: "Phí dịch vụ" },
    { key: "lostCardFee", label: "Phí mất thẻ" },
    { key: "status", label: "Trạng thái", render: (row) => badge(row.status) },
    { key: "actions", label: "Chức năng", width: "100px", render: () => <ActionButtons editHref="/admin/visitorParkingFee/form" /> }
  ];

  return (
    <AdminTablePage
      title="Quản lý phí vãng lai"
      breadcrumbs={[{ label: "Bảng giá", href: "/admin/visitorParkingFee" }, { label: "Phí vãng lai" }]}
      tableTitle="Bảng quản lý phí vãng lai"
      columns={columns}
      rows={visitorParkingFees}
      filters={<FilterControls selects={[{ name: "vehicleTypeId", placeholder: "Tất cả loại xe", options: vehicleTypes }]} />}
      actions={addButton("/admin/visitorParkingFee/form")}
    />
  );
}

export function RegistrationFeePage() {
  const columns: TableColumn<CustomerFeeRow>[] = [
    { key: "stt", label: "STT", render: (_row, index) => index + 1 },
    { key: "id", label: "ID phí đăng ký" },
    { key: "vehicleType", label: "Loại xe" },
    { key: "ticketType", label: "Loại vé" },
    { key: "price", label: "Phí đăng ký" },
    { key: "duration", label: "Thời hạn" },
    { key: "status", label: "Trạng thái", render: (row) => badge(row.status) },
    { key: "actions", label: "Chức năng", width: "100px", render: () => <ActionButtons editHref="/admin/parkingFeeOfCustomer/form" /> }
  ];

  return (
    <AdminTablePage
      title="Quản lý phí đăng ký"
      breadcrumbs={[{ label: "Bảng giá", href: "/admin/parkingFeeOfCustomer" }, { label: "Phí đăng ký" }]}
      tableTitle="Bảng quản lý phí đăng ký"
      columns={columns}
      rows={customerParkingFees}
      filters={<FilterControls selects={[{ name: "vehicleTypeId", placeholder: "Tất cả loại xe", options: vehicleTypes }]} />}
      actions={addButton("/admin/parkingFeeOfCustomer/form")}
    />
  );
}
