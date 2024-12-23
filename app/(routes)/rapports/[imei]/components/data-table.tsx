"use client";

import React from "react";
import {
  ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnDef,
  SortingState,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/typs/pagination";
import { defaultFilter } from "@/typs/filter";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: Pagination;
  fetch: (filter: any) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination,
  fetch,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [isMounted, setIsMounted] = React.useState<boolean>(false);
  const [filter, setFilter] = React.useState({ ...defaultFilter });

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: filter.currentPage - 1,
        pageSize: filter.size,
      },
    },
  });

  if (!isMounted) {
    return null;
  }

  const handleNextPage = async () => {
    if (filter.currentPage < pagination.totalPage) {
      await fetch({
        ...filter,
        currentPage: filter.currentPage + 1,
      });

      setFilter({
        ...filter,
        currentPage: filter.currentPage + 1,
      });
    }
  };

  const handlePreviousPage = async () => {
    if (filter.currentPage > 1) {
      await fetch({
        ...filter,
        currentPage: filter.currentPage - 1,
      });
      setFilter({
        ...filter,
        currentPage: filter.currentPage - 1,
      });
    }
  };

  const changesize = async (size: any) => {
    await fetch({
      ...filter,
      size: size,
    });
    setFilter({
      ...filter,
      size: size,
    });
  };

  const handleFilter = async (value: string) => {
    await fetch({
      ...filter,
      globalSearch: value,
    });
    setFilter({
      ...filter,
      globalSearch: value,
    });
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-2">
        <div>
          <span className="text-sm text-muted-foreground">
            Showing{" "}
            {pagination?.offsetElements == 0 ? 1 : pagination?.offsetElements} -{" "}
            {(pagination?.numberOfElements ?? 0) +
              (pagination?.offsetElements ?? 0)}{" "}
            of {pagination?.totalElements} results
          </span>
        </div>
        <div className="flex items-center justify-end space-x-2 ">
          <Select onValueChange={(value) => changesize(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={filter.size} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePreviousPage()}
            disabled={filter.currentPage === 1}
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNextPage()}
            disabled={filter.currentPage === pagination?.totalPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
