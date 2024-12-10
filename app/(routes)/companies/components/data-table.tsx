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
import { defaultFilter, Filter } from "@/typs/filter";
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
  const [filter, setFilter] = React.useState({ ...defaultFilter });

  const [isMounted, setIsMounted] = React.useState<boolean>(false);

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
    initialState: {
      pagination: {
        pageSize: filter.size ?? 10,
      },
    },

    state: {
      sorting,
      columnFilters,
    },
  });

  if (!isMounted) {
    return null;
  }

  return (
    <div className="p-4 bg-background shadow-md rounded-lg mt-4">
      <div className="flex items-center mb-2">
        <Input
          placeholder="Filterpar nom de l'entreprise"
          onChange={(event) => handleFilter(event.target.value)}
        />
      </div>
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div>
          <span className="text-sm text-muted-foreground">
            Showing {pagination?.offsetElements == 0 ? 1 : pagination?.offsetElements} -{" "}
            {(pagination?.numberOfElements ?? 0) +
              (pagination?.offsetElements ?? 0)}{" "}
            of {pagination?.totalElements} results
          </span>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
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
