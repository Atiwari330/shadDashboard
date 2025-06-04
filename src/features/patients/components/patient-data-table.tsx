'use client';

import * as React from 'react';
import useSWR from 'swr';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export interface Patient {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  patientIdInternal: string | null;
  assignedStaffId: string | null;
  status: string;
  lastInteractionDate: string | null;
  nextAppointmentDate: string | null;
  insuranceStatus: string | null;
  intakeDate: string;
  dateOfBirth: string | null;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PatientsApiResponse {
  data: Patient[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface DataTableProps<TData extends Patient, TValue> {
  columns: ColumnDef<TData, TValue>[];
  searchTerm?: string;
  statusFilter?: string;
}

export function PatientDataTable<TData extends Patient, TValue>({
  columns,
  searchTerm,
  statusFilter
}: DataTableProps<TData, TValue>) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append('search', searchTerm);
  if (statusFilter) queryParams.append('status', statusFilter);
  queryParams.append('page', currentPage.toString());
  queryParams.append('limit', pageSize.toString());

  if (sorting.length > 0) {
    const sort = sorting[0];
    queryParams.append('sortBy', sort.id);
    queryParams.append('sortOrder', sort.desc ? 'desc' : 'asc');
  }

  const swrKey = `/api/patients?${queryParams.toString()}`;
  const {
    data: apiResponse,
    error,
    isLoading
  } = useSWR<PatientsApiResponse>(swrKey, fetcher, {
    keepPreviousData: true
  });

  const data = React.useMemo(() => apiResponse?.data ?? [], [apiResponse]);
  const meta = React.useMemo(() => apiResponse?.meta, [apiResponse]);

  const table = useReactTable({
    data: data as TData[],
    columns,
    pageCount: meta?.totalPages ?? -1,
    manualPagination: true,
    manualSorting: true,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: (meta?.page ?? 1) - 1,
        pageSize: pageSize
      }
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newPaginationState = updater({
          pageIndex: (meta?.page ?? 1) - 1,
          pageSize
        });
        setCurrentPage(newPaginationState.pageIndex + 1);
        setPageSize(newPaginationState.pageSize);
      } else {
        setCurrentPage(updater.pageIndex + 1);
        setPageSize(updater.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues()
  });

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  if (error)
    return (
      <div className='rounded-md border p-4 text-red-500'>
        Failed to load patient data. Error: {error.message}
      </div>
    );

  if (isLoading && !apiResponse) {
    const skeletonRowCount = pageSize || 5;
    return (
      <div className='space-y-4'>
        <div className='flex items-center py-4'>
          {/* Placeholder for potential global table filters or actions if not on main page */}
          {/* For now, the column visibility toggle is the main toolbar item */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='ml-auto'>
                <Icons.columns className='mr-2 h-4 w-4' />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className='overflow-x-auto rounded-md border'>
          {' '}
          {/* Added overflow-x-auto here */}
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column, index) => (
                  <TableHead key={`skeleton-header-${index}`}>
                    <Skeleton className='h-5 w-full' />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                <TableRow key={`skeleton-row-${rowIndex}`}>
                  {columns.map((column, cellIndex) => (
                    <TableCell key={`skeleton-cell-${rowIndex}-${cellIndex}`}>
                      <Skeleton className='h-5 w-full' />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center py-4'>
        {/* Placeholder for potential global table filters or actions if not on main page */}
        {/* For now, the column visibility toggle is the main toolbar item */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' className='ml-auto'>
              <Icons.columns className='mr-2 h-4 w-4' />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                // Try to get a more human-readable name for the column
                const headerDef = column.columnDef.header;
                let columnHeader = column.id;
                if (typeof headerDef === 'string') {
                  columnHeader = headerDef;
                } else if (typeof headerDef === 'function') {
                  // This is a bit of a hack; ideally, columnDef would have a 'title' prop
                  // For DataTableColumnHeader, it passes a 'title' prop to its children.
                  // We're trying to access something similar if possible.
                  // If the header is a component like DataTableColumnHeader, its 'title' prop might be accessible via column.columnDef.meta.title
                  // For now, we'll just use the ID if it's not a simple string.
                  // A more robust solution would be to add a 'title' or 'label' to each ColumnDef.
                  // Or, if header is a string, use that.
                  // For now, stick to column.id for simplicity if not a string.
                }

                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className='capitalize'
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {/* Display a more friendly name if available, otherwise column.id */}
                    {typeof column.columnDef.header === 'string'
                      ? column.columnDef.header
                      : column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
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
                  data-state={row.getIsSelected() && 'selected'}
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
                  className='h-24 text-center'
                >
                  {searchTerm || statusFilter
                    ? 'No patients match your filters.'
                    : 'No patients found. Add one to get started!'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between px-2 py-4'>
        <div className='text-muted-foreground flex-1 text-sm'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {meta?.totalItems ?? 0} row(s) selected.
        </div>
        <div className='flex items-center space-x-6 lg:space-x-8'>
          <div className='flex items-center space-x-2'>
            <p className='text-sm font-medium'>Rows per page</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => {
                setPageSize(Number(value));
              }}
            >
              <SelectTrigger className='h-8 w-[70px]'>
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side='top'>
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className='sr-only'>Go to first page</span>
              <Icons.chevronsLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className='sr-only'>Go to previous page</span>
              <Icons.chevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className='sr-only'>Go to next page</span>
              <Icons.chevronRight className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className='sr-only'>Go to last page</span>
              <Icons.chevronsRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
