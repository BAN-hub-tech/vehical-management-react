import { useState } from "react";
import {
  initialPermissionModules,
  permissionActions,
  permissionFilters,
  roleAuditRecords,
  rolePermissionRoles,
  type PermissionAction,
  type PermissionFilter,
  type PermissionModuleRecord,
  type PermissionState,
  type RoleKind,
  type RolePermissionRecord
} from "@/features/iam/components/rolePermissionData";

type RoleFilter = "all" | RoleKind;

function matchesText(values: string[], searchValue: string) {
  const needle = searchValue.trim().toLowerCase();

  if (!needle) return true;

  return values.some((value) => value.toLowerCase().includes(needle));
}

function clonePermissionModules() {
  return initialPermissionModules.map((module) => ({
    ...module,
    permissions: { ...module.permissions }
  }));
}

function SearchBox({ label, onChange, placeholder, value }: { label: string; onChange: (value: string) => void; placeholder: string; value: string }) {
  return (
    <label className="vm-role-search">
      <span className="sr-only">{label}</span>
      <i className="fas fa-search" />
      <input onChange={(event) => onChange(event.target.value)} placeholder={placeholder} type="search" value={value} />
    </label>
  );
}

function RoleIcon({ kind, selected }: { kind: RoleKind; selected: boolean }) {
  return (
    <span className={`vm-role-list__icon ${selected ? "is-selected" : ""}`}>
      <i className={kind === "system" ? "fas fa-shield-alt" : "far fa-user"} />
    </span>
  );
}

function RoleListPanel({
  activeFilter,
  collapsed,
  onCollapse,
  onFilterChange,
  onRoleSelect,
  onSearchChange,
  roles,
  searchValue,
  selectedRoleId
}: {
  activeFilter: RoleFilter;
  collapsed: boolean;
  onCollapse: () => void;
  onFilterChange: (value: RoleFilter) => void;
  onRoleSelect: (roleId: string) => void;
  onSearchChange: (value: string) => void;
  roles: RolePermissionRecord[];
  searchValue: string;
  selectedRoleId: string;
}) {
  const filters: Array<{ label: string; value: RoleFilter }> = [
    { label: "Tất cả", value: "all" },
    { label: "Role hệ thống", value: "system" },
    { label: "Role tùy chỉnh", value: "custom" }
  ];

  return (
    <aside aria-hidden={collapsed} className={`vm-role-panel vm-role-panel--roles ${collapsed ? "is-collapsed" : ""}`}>
      <div className="vm-role-panel__titlebar">
        <h3>Vai trò</h3>
        <button className="vm-role-panel__collapse" type="button" aria-label="Thu gọn khối vai trò" onClick={onCollapse}>
          <i className="fas fa-angle-left" />
        </button>
      </div>
      <SearchBox label="Tìm vai trò" onChange={onSearchChange} placeholder="Tìm vai trò..." value={searchValue} />

      <div className="vm-role-filter-tabs" role="tablist" aria-label="Lọc vai trò">
        {filters.map((filter) => (
          <button
            className={activeFilter === filter.value ? "is-active" : ""}
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            type="button"
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="vm-role-list">
        {roles.map((role) => {
          const selected = role.id === selectedRoleId;

          return (
            <button className={`vm-role-list__item ${selected ? "is-selected" : ""}`} key={role.id} onClick={() => onRoleSelect(role.id)} type="button">
              <RoleIcon kind={role.kind} selected={selected} />
              <span className="vm-role-list__copy">
                <strong>{role.code}</strong>
                <small>{role.description}</small>
              </span>
              <span className="vm-role-list__badges">
                {selected ? <span className="vm-role-pill vm-role-pill--green">Đang chọn</span> : null}
                <span className={`vm-role-pill ${role.locked ? "vm-role-pill--muted" : "vm-role-pill--soft"}`}>
                  {role.locked ? <i className="fas fa-lock" /> : null}
                  {role.locked ? "Bị khóa" : "Có thể chỉnh sửa"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <button className="vm-role-create" type="button">
        <i className="fas fa-plus" />
        <span>Tạo vai trò mới</span>
      </button>

      <div className="vm-role-warning">
        <i className="fas fa-lock" />
        <div>
          <strong>Vai trò hệ thống không thể chỉnh sửa</strong>
          <p>Để bảo mật hệ thống, các role hệ thống bị khóa và không thể thay đổi quyền.</p>
        </div>
      </div>
    </aside>
  );
}

function PermissionCheck({
  disabled,
  onToggle,
  state
}: {
  disabled: boolean;
  onToggle: () => void;
  state: PermissionState;
}) {
  if (state === "locked") {
    return (
      <span className="vm-permission-check is-locked" aria-label="Bị khóa">
        <i className="fas fa-lock" />
      </span>
    );
  }

  return (
    <button
      aria-pressed={state === "granted"}
      className={`vm-permission-check ${state === "granted" ? "is-granted" : ""}`}
      disabled={disabled}
      onClick={onToggle}
      type="button"
    >
      {state === "granted" ? <i className="fas fa-check" /> : null}
    </button>
  );
}

function PermissionMatrix({
  activeFilter,
  disabled,
  modules,
  onFilterChange,
  onSearchChange,
  onToggle,
  searchValue
}: {
  activeFilter: PermissionFilter;
  disabled: boolean;
  modules: PermissionModuleRecord[];
  onFilterChange: (value: PermissionFilter) => void;
  onSearchChange: (value: string) => void;
  onToggle: (moduleKey: string, action: PermissionAction) => void;
  searchValue: string;
}) {
  return (
    <section className="vm-role-panel vm-role-panel--matrix">
      <h3>Quyền theo module</h3>

      <div className="vm-role-matrix-toolbar">
        <SearchBox label="Tìm quyền" onChange={onSearchChange} placeholder="Tìm quyền, module, hành động..." value={searchValue} />
        <div className="vm-role-scope-tabs" role="tablist" aria-label="Nhóm quyền">
          {permissionFilters.map((filter) => (
            <button
              className={activeFilter === filter.value ? "is-active" : ""}
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="vm-role-matrix">
        <table>
          <thead>
            <tr>
              <th>Module</th>
              {permissionActions.map((action) => (
                <th key={action.key}>{action.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module.key}>
                <td>{module.label}</td>
                {permissionActions.map((action) => (
                  <td key={action.key}>
                    <PermissionCheck
                      disabled={disabled}
                      state={module.permissions[action.key]}
                      onToggle={() => onToggle(module.key, action.key)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="vm-role-legend">
        <span>Chú thích:</span>
        <span>
          <i className="vm-permission-check is-granted fas fa-check" /> Đã cấp
        </span>
        <span>
          <i className="vm-permission-check" /> Chưa cấp
        </span>
        <span>
          <i className="vm-permission-check is-locked fas fa-lock" /> Bị khóa/Không thể chỉnh sửa
        </span>
      </div>

      <div className="vm-role-sync-note">
        <i className="fas fa-info-circle" />
        <span>Thay đổi sẽ được áp dụng khi bạn nhấn “Lưu thay đổi”. Hệ thống sẽ đồng bộ toàn bộ quyền của vai trò.</span>
      </div>
    </section>
  );
}

function SummaryPanel({ role }: { role: RolePermissionRecord }) {
  return (
    <aside className="vm-role-panel vm-role-panel--summary">
      <h3>Tóm tắt</h3>

      <div className="vm-role-summary-head">
        <span className="vm-role-summary-avatar">
          <i className="far fa-user" />
        </span>
        <div>
          <h4>{role.code}</h4>
          <span className="vm-role-pill vm-role-pill--green">Có thể chỉnh sửa</span>
          <p>{role.description}</p>
        </div>
      </div>

      <div className="vm-role-summary-stats">
        <div className="vm-role-summary-stat vm-role-summary-stat--blue">
          <strong>18</strong>
          <span>Quyền đã cấp</span>
        </div>
        <div className="vm-role-summary-stat vm-role-summary-stat--orange">
          <strong>4</strong>
          <span>Quyền chờ lưu</span>
        </div>
      </div>

      <div className="vm-role-summary-legend">
        <span>
          <i className="vm-permission-check is-granted fas fa-check" /> Đã cấp
        </span>
        <span>
          <i className="vm-permission-check" /> Chưa cấp
        </span>
        <span>
          <i className="vm-permission-check is-locked fas fa-lock" /> Bị khóa/Không thể chỉnh sửa
        </span>
      </div>

      <div className="vm-role-alert">
        <i className="fas fa-exclamation-triangle" />
        <div>
          <strong>Cảnh báo</strong>
          <p>Role hệ thống bị khóa theo backend</p>
        </div>
      </div>

      <div className="vm-role-history">
        <h4>Lịch sử chỉnh sửa gần đây</h4>
        <div className="vm-role-history__list">
          {roleAuditRecords.map((item) => (
            <article className="vm-role-history__item" key={item.id}>
              <span className={`vm-role-history__dot vm-role-history__dot--${item.tone}`} />
              <div>
                <div className="vm-role-history__meta">
                  <span>{item.date}</span>
                  <strong>{item.actor}</strong>
                </div>
                <p>{item.description}</p>
                {item.synced ? <span className="vm-role-history__sync">Đồng bộ</span> : null}
              </div>
            </article>
          ))}
        </div>
      </div>

      <button className="vm-role-history__view" type="button">
        <span>Xem tất cả lịch sử</span>
        <i className="fas fa-chevron-right" />
      </button>
    </aside>
  );
}

export function RolePermissionPage() {
  const [roleSearch, setRoleSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [selectedRoleId, setSelectedRoleId] = useState("supervisor-custom");
  const [permissionSearch, setPermissionSearch] = useState("");
  const [permissionFilter, setPermissionFilter] = useState<PermissionFilter>("all");
  const [rolePanelOpen, setRolePanelOpen] = useState(true);
  const [modules, setModules] = useState<PermissionModuleRecord[]>(clonePermissionModules);

  const filteredRoles = rolePermissionRoles.filter((role) => {
    const matchesFilter = roleFilter === "all" ? true : role.kind === roleFilter;
    return matchesFilter && matchesText([role.code, role.name, role.description], roleSearch);
  });

  const selectedRole = rolePermissionRoles.find((role) => role.id === selectedRoleId) ?? rolePermissionRoles[0];
  const filteredModules = modules.filter((module) => matchesText([module.label, module.key], permissionSearch));
  const matrixDisabled = selectedRole.locked;

  const togglePermission = (moduleKey: string, action: PermissionAction) => {
    if (matrixDisabled) return;

    setModules((current) =>
      current.map((module) => {
        if (module.key !== moduleKey) return module;

        const currentState = module.permissions[action];
        if (currentState === "locked") return module;

        return {
          ...module,
          permissions: {
            ...module.permissions,
            [action]: currentState === "granted" ? "empty" : "granted"
          }
        };
      })
    );
  };

  const resetPage = () => {
    setRoleSearch("");
    setRoleFilter("all");
    setSelectedRoleId("supervisor-custom");
    setPermissionSearch("");
    setPermissionFilter("all");
    setModules(clonePermissionModules());
  };

  return (
    <div className="content-header vm-card-content-header">
      <section className="content vm-admin-content">
        <div className="container-fluid">
          <div className="vm-role-permission-page">
            <header className="vm-role-page-header">
              <div className="vm-role-page-header__main">
                <h2>Phân quyền vai trò</h2>
                <button className="vm-role-page-header__help" type="button">
                  <i className="far fa-question-circle" />
                  <span>Hướng dẫn &amp; Trợ giúp</span>
                </button>
              </div>

              <div className="vm-role-page-header__actions">
                <button className="btn vm-role-btn vm-role-btn--secondary" onClick={resetPage} type="button">
                  <i className="fas fa-undo" />
                  <span>Đặt lại</span>
                </button>
                <button className="btn vm-role-btn vm-role-btn--primary" type="button">
                  <i className="far fa-save" />
                  <span>Lưu thay đổi</span>
                </button>
              </div>
            </header>

            <div className={`vm-role-permission-layout ${rolePanelOpen ? "" : "is-role-collapsed"}`}>
              {!rolePanelOpen ? (
                <button className="vm-role-panel-opener" type="button" aria-label="Mở khối vai trò" onClick={() => setRolePanelOpen(true)}>
                  <i className="fas fa-angle-right" />
                  <span>Vai trò</span>
                </button>
              ) : null}

              <RoleListPanel
                activeFilter={roleFilter}
                collapsed={!rolePanelOpen}
                roles={filteredRoles}
                searchValue={roleSearch}
                selectedRoleId={selectedRoleId}
                onCollapse={() => setRolePanelOpen(false)}
                onFilterChange={setRoleFilter}
                onRoleSelect={setSelectedRoleId}
                onSearchChange={setRoleSearch}
              />

              <PermissionMatrix
                activeFilter={permissionFilter}
                disabled={matrixDisabled}
                modules={filteredModules}
                searchValue={permissionSearch}
                onFilterChange={setPermissionFilter}
                onSearchChange={setPermissionSearch}
                onToggle={togglePermission}
              />

              <SummaryPanel role={selectedRole} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
