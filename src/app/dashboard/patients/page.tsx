'use client'; // Required for onClick handlers and state

import { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AddPatientForm } from './components/add-patient-form';
import { EditPatientForm } from './components/edit-patient-form';
import { archivePatient } from './actions';
import { toast } from 'sonner';
import {
  PatientDataTable,
  type Patient
} from '@/features/patients/components/patient-data-table';
import { usePatientFiltersStore } from '@/features/patients/store/patient-filters-store';
import { type ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { format } from 'date-fns';
import Link from 'next/link';

// export const metadata: Metadata = {
//   title: 'Patients Management',
//   description: 'Manage patient records and information.',
// };

export default function PatientsPage() {
  const [isAddPatientDialogOpen, setIsAddPatientDialogOpen] = useState(false);
  const [isEditPatientDialogOpen, setIsEditPatientDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [patientToArchive, setPatientToArchive] = useState<Patient | null>(
    null
  );

  const [inputValue, setInputValue] = useState('');

  const searchTerm = usePatientFiltersStore((state) => state.searchTerm);
  const setSearchTermInStore = usePatientFiltersStore(
    (state) => state.setSearchTerm
  );
  const statusFilter = usePatientFiltersStore((state) => state.statusFilter);
  const setStatusFilterInStore = usePatientFiltersStore(
    (state) => state.setStatusFilter
  );

  const patientStatusOptions = [
    'Active',
    'Intake',
    'Pending',
    'On Hold',
    'Discharged',
    'Archived'
  ];

  const debouncedSetSearchInStore = useDebouncedCallback((value: string) => {
    setSearchTermInStore(value);
  }, 500);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    debouncedSetSearchInStore(newValue);
  };

  const clearSearch = () => {
    setInputValue('');
    setSearchTermInStore('');
  };

  useEffect(() => {
    if (searchTerm === '') {
      setInputValue('');
    }
  }, [searchTerm]);

  const handleRefresh = () => {
    console.log('Refresh button clicked');
    // SWR will handle revalidation based on key changes or manual mutate calls
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setIsEditPatientDialogOpen(true);
  };

  const handleArchiveConfirm = async () => {
    if (patientToArchive) {
      const formData = new FormData();
      formData.append('id', patientToArchive.id);
      const result = await archivePatient(
        { message: '', id: patientToArchive.id },
        formData
      );
      if (result.message.includes('success')) {
        toast.success(result.message);
      } else {
        toast.error(result.message, { description: result.issues?.join(', ') });
      }
      setPatientToArchive(null);
    }
  };

  const columns: ColumnDef<Patient>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='translate-y-[2px]'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-[2px]'
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Patient Name' />
      ),
      cell: ({ row }) => {
        const patient = row.original;
        return (
          <Link
            href={`/dashboard/patients/${patient.id}`}
            className='font-medium hover:underline'
          >
            {patient.name}
          </Link>
        );
      }
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Email' />
      ),
      cell: ({ row }) => {
        const email = row.original.email;
        return email ? (
          <a href={`mailto:${email}`} className='hover:underline'>
            {email}
          </a>
        ) : (
          <span className='text-muted-foreground'>N/A</span>
        );
      }
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' =
          'outline';
        if (status === 'Active') badgeVariant = 'default';
        else if (status === 'Archived') badgeVariant = 'secondary';
        return <Badge variant={badgeVariant}>{status}</Badge>;
      }
    },
    {
      accessorKey: 'intakeDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Intake Date' />
      ),
      cell: ({ row }) => {
        const intakeDate = row.original.intakeDate;
        try {
          return intakeDate ? (
            format(new Date(intakeDate), 'MMM d, yyyy')
          ) : (
            <span className='text-muted-foreground'>N/A</span>
          );
        } catch (e) {
          return <span className='text-muted-foreground'>Invalid Date</span>;
        }
      }
    },
    {
      id: 'actions',
      header: () => <div className='text-right'>Actions</div>,
      cell: ({ row }) => {
        const patient = row.original;
        return (
          <div className='flex items-center justify-end space-x-1 text-right'>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8'
                    onClick={() => console.log(`Add Task for ${patient.name}`)}
                  >
                    <Icons.playlistAdd className='h-4 w-4' />
                    <span className='sr-only'>Add Task</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Task</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8'
                    onClick={() => console.log(`Send Email to ${patient.name}`)}
                  >
                    <Icons.mail className='h-4 w-4' />
                    <span className='sr-only'>Send Email</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Send Email</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8'
                    onClick={() => console.log(`Call ${patient.name}`)}
                  >
                    <Icons.phone className='h-4 w-4' />
                    <span className='sr-only'>Make Call</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Make Call</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Open menu</span>
                  <Icons.ellipsis className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(patient.id)}
                >
                  Copy patient ID
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    console.log(`View details for patient: ${patient.name}`)
                  }
                >
                  View patient details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEditPatient(patient)}>
                  Edit patient
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='text-red-600 hover:!text-red-600 focus:!bg-red-100 focus:!text-red-600 dark:focus:!bg-red-900/50'
                  onSelect={() => setPatientToArchive(patient)}
                >
                  Archive patient
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false
    }
  ];

  return (
    <div className='flex h-full flex-1 flex-col space-y-6 p-4 md:p-8'>
      {/* Page Header Area */}
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Patients</h1>
          <p className='text-muted-foreground'>
            Manage patient records, view details, and perform actions.
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={handleRefresh}
            aria-label='Refresh patients list'
          >
            <Icons.refresh className='h-4 w-4' />
          </Button>
          <Dialog
            open={isAddPatientDialogOpen}
            onOpenChange={setIsAddPatientDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Icons.userPlus className='mr-2 h-4 w-4' /> Add New Patient
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Fill in the details below to add a new patient. Click save
                  when you're done.
                </DialogDescription>
              </DialogHeader>
              <AddPatientForm
                onSuccess={() => setIsAddPatientDialogOpen(false)}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='outline'>Cancel</Button>
                </DialogClose>
                <Button type='submit' form='add-patient-form'>
                  Save Patient
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {editingPatient && (
            <Dialog
              open={isEditPatientDialogOpen}
              onOpenChange={(open) => {
                setIsEditPatientDialogOpen(open);
                if (!open) setEditingPatient(null);
              }}
            >
              <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                  <DialogTitle>Edit Patient</DialogTitle>
                  <DialogDescription>
                    Update the patient's details below. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <EditPatientForm
                  patient={editingPatient}
                  onSuccess={() => {
                    setIsEditPatientDialogOpen(false);
                    setEditingPatient(null);
                  }}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant='outline'
                      onClick={() => {
                        setIsEditPatientDialogOpen(false);
                        setEditingPatient(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button
                    type='submit'
                    form={`edit-patient-form-${editingPatient.id}`}
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {patientToArchive && (
            <AlertDialog
              open={!!patientToArchive}
              onOpenChange={(open) => !open && setPatientToArchive(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to archive this patient?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will mark patient "{patientToArchive.name}" as
                    archived. This can usually be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setPatientToArchive(null)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleArchiveConfirm}
                    className='bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500'
                  >
                    Archive
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon' aria-label='More options'>
                <Icons.ellipsis className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() =>
                  console.log('Import Patients clicked (placeholder)')
                }
              >
                Import Patients
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  console.log('Export Patients clicked (placeholder)')
                }
              >
                Export Patients
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className='flex items-center justify-between rounded-md border p-4'>
        <div className='relative flex-1 md:grow-0'>
          <Icons.search className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
          <Input
            type='search'
            placeholder='Search by name or email...'
            value={inputValue}
            onChange={handleInputChange}
            className='bg-background w-full rounded-lg pl-8 md:w-[200px] lg:w-[336px]'
          />
          {inputValue && (
            <Button
              variant='ghost'
              size='icon'
              className='absolute top-1/2 right-1 h-7 w-7 -translate-y-1/2'
              onClick={clearSearch}
              aria-label='Clear search'
            >
              <Icons.close className='h-4 w-4' />
            </Button>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline' className='ml-4'>
              <Icons.filter className='mr-2 h-4 w-4' /> Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-4' align='start'>
            <div className='space-y-4'>
              <h4 className='leading-none font-medium'>Apply Filters</h4>
              <div className='grid gap-2'>
                <div className='grid grid-cols-3 items-center gap-4'>
                  <Label htmlFor='status-filter' className='col-span-1'>
                    Status
                  </Label>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilterInStore}
                  >
                    <SelectTrigger
                      id='status-filter'
                      className='col-span-2 h-8'
                    >
                      <SelectValue placeholder='Any Status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=''>Any Status</SelectItem>
                      {patientStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='flex justify-end space-x-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setStatusFilterInStore('')}
                >
                  Clear
                </Button>
                <Button
                  size='sm'
                  onClick={() =>
                    console.log(
                      'Apply filters button clicked. Status from store:',
                      statusFilter
                    )
                  }
                >
                  Apply
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className='flex-1 rounded-md border p-0'>
        <PatientDataTable
          columns={columns}
          searchTerm={searchTerm}
          statusFilter={statusFilter}
        />
      </div>

      <div className='rounded-md border p-4'>
        <p className='text-muted-foreground text-sm'>
          Pagination Footer Area (Placeholder - US540-US542)
        </p>
        <div className='mt-2 h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700'></div>
      </div>
    </div>
  );
}
