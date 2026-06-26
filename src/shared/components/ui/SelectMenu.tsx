import { useEffect, useRef, useState } from "react";

export type SelectMenuOption = {
  label: string;
  value: string;
};

type SelectMenuProps = {
  ariaLabel: string;
  clearValue?: string;
  onChange: (value: string) => void;
  options: SelectMenuOption[];
  value: string;
};

export function SelectMenu({ ariaLabel, clearValue = "all", onChange, options, value }: SelectMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selected = options.find((option) => option.value === value) ?? options[0];
  const canClear = value !== clearValue && options.some((option) => option.value === clearValue);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="vm-select-menu vm-catalog-select" ref={rootRef}>
      <button
        aria-expanded={open}
        aria-label={ariaLabel}
        className={`vm-select-menu__trigger vm-catalog-select__trigger ${open ? "is-open" : ""}`}
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span>{selected?.label}</span>
        {canClear ? (
          <span
            className="vm-select-menu__clear"
            role="button"
            tabIndex={0}
            aria-label={`Bỏ chọn ${ariaLabel}`}
            onClick={(event) => {
              event.stopPropagation();
              onChange(clearValue);
              setOpen(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                event.stopPropagation();
                onChange(clearValue);
                setOpen(false);
              }
            }}
          >
            <i className="fas fa-times" />
          </span>
        ) : null}
        <i className="fas fa-chevron-down" />
      </button>

      {open ? (
        <div className="vm-select-menu__menu vm-catalog-select__menu">
          {options.map((option) => {
            const selectedOption = option.value === value;

            return (
              <button
                className={`vm-select-menu__item vm-catalog-select__item ${selectedOption ? "is-selected" : ""}`}
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span className="vm-select-menu__mark vm-catalog-select__mark">{selectedOption ? <span /> : null}</span>
                <span className="vm-select-menu__label vm-catalog-select__label">{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
