import React from "react";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  render: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Array<DataTableColumn<T>>;
  data: T[];
  rowKey: (row: T) => string;
  selectedRowKey?: string | null;
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
  loading?: boolean;
  skeletonRows?: number;
  caption?: string;
  className?: string;
}

export function DataTableSkeleton({
  columns = 5,
  rows = 5,
}: {
  columns?: number;
  rows?: number;
}) {
  return (
    <div
      role="status"
      aria-label="Loading table data"
      className="divide-y divide-slate-100 p-4"
    >
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid gap-4 py-3.5"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: columns }).map((__, colIdx) => (
            <div
              key={colIdx}
              className={cn(
                "h-4 animate-pulse rounded-md bg-slate-200/80",
                colIdx === 0 ? "w-3/4" : "w-1/2"
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  selectedRowKey,
  onRowClick,
  emptyState,
  loading = false,
  skeletonRows = 5,
  caption,
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs",
        className
      )}
    >
      {loading ? (
        <DataTableSkeleton columns={columns.length} rows={skeletonRows} />
      ) : data.length === 0 ? (
        emptyState ?? (
          <div className="p-10 text-center text-sm text-slate-500">
            No records found.
          </div>
        )
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            {caption && <caption className="sr-only">{caption}</caption>}
            <thead className="bg-slate-50/90 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn("px-4 py-3.5 whitespace-nowrap", col.headerClassName)}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {data.map((row) => {
                const key = rowKey(row);
                const isSelected = selectedRowKey === key;
                const interactive = Boolean(onRowClick);

                return (
                  <tr
                    key={key}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              onRowClick(row);
                            }
                          }
                        : undefined
                    }
                    tabIndex={interactive ? 0 : undefined}
                    aria-selected={interactive ? isSelected : undefined}
                    className={cn(
                      "transition-colors",
                      interactive &&
                        "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500",
                      isSelected
                        ? "bg-indigo-50/75 shadow-[inset_3px_0_0_0_#4f46e5]"
                        : "hover:bg-slate-50/90"
                    )}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn("px-4 py-3.5 align-middle", col.cellClassName)}
                      >
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
