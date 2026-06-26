export function CardManageHeader() {
  return (
    <div className="vm-card-manage-header">
      <div className="vm-card-manage-header__main">
        <h2 className="vm-card-manage-header__title">Quản lý thẻ</h2>
        <button className="vm-card-manage-header__help" type="button">
          <i className="far fa-question-circle" />
          <span>Hướng dẫn &amp; Trợ giúp</span>
        </button>
      </div>

      <div className="vm-card-manage-header__actions">
        <button className="btn vm-card-toolbar__create vm-card-manage-header__create" type="button">
          <i className="far fa-plus-square" />
          <span>Cấp thẻ mới</span>
        </button>
      </div>
    </div>
  );
}
