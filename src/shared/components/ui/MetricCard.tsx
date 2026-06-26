import type { ReactNode } from "react";

type MetricCardProps = {
  blockClassName?: string;
  className: string;
  contentClassName?: string;
  delta: string;
  deltaClassName: string;
  icon: ReactNode;
  label: string;
  labelClassName?: string;
  sparkline: ReactNode;
  value: string;
  valueClassName?: string;
};

export function MetricCard({
  blockClassName,
  className,
  contentClassName = "",
  delta,
  deltaClassName,
  icon,
  label,
  labelClassName,
  sparkline,
  value,
  valueClassName
}: MetricCardProps) {
  const block = blockClassName ?? className.split(" ")[0];

  return (
    <article className={className}>
      <div className={`${block}__head`}>
        {icon}
        <div className={contentClassName}>
          <p className={labelClassName}>{label}</p>
          <strong className={valueClassName}>{value}</strong>
        </div>
      </div>
      <div className={`${block}__foot`}>
        <span className={deltaClassName}>{delta}</span>
        {sparkline}
      </div>
    </article>
  );
}
