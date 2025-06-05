'use client';

import { useFormState } from 'react-dom';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns'; // Added parseISO for string dates from server

import { editPatient, type EditPatientFormState } from '../actions'; // Path to server action
import type { Patient } from '@/features/patients/components/patient-data-table'; // For patient data type

// Zod schema for client-side validation of the edit form.
// Should align with EditPatientSchema in actions.ts
const ClientEditPatientSchema = z.object({
  id: z.string().uuid(), // ID is crucial for editing
  name: z.string().min(1, { message: 'Name is required.' }).optional(),
  email: z
    .string()
    .email({ message: 'Invalid email address.' })
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  status: z.string().min(1, { message: 'Status is required.' }).optional(),
  intakeDate: z
    .date({ invalid_type_error: 'Intake date must be a valid date.' })
    .optional(),
  patientIdInternal: z.string().optional(),
  assignedStaffId: z.string().optional(),
  insuranceStatus: z.string().optional(),
  dateOfBirth: z.date().optional().nullable(),
  lastInteractionDate: z.date().optional().nullable(),
  nextAppointmentDate: z.date().optional().nullable()
});

type ClientEditPatientFormData = z.infer<typeof ClientEditPatientSchema>;

const patientStatusOptions = [
  'Active',
  'Intake',
  'Pending',
  'On Hold',
  'Discharged',
  'Archived'
];

interface EditPatientFormProps {
  patient: Patient; // Patient data to pre-fill the form
  onSuccess?: () => void;
}

export function EditPatientForm({ patient, onSuccess }: EditPatientFormProps) {
  const initialState: EditPatientFormState = { message: '', issues: [] };
  const [formState, formAction] = useFormState(editPatient, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  // Helper to parse date strings or return null/undefined
  const parseDateString = (
    dateStr: string | null | undefined
  ): Date | null | undefined => {
    if (!dateStr) return null;
    try {
      const parsed = parseISO(dateStr);
      return isNaN(parsed.getTime()) ? null : parsed;
    } catch {
      return null;
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
    // reset // Removed unused reset
  } = useForm<ClientEditPatientFormData>({
    resolver: zodResolver(ClientEditPatientSchema),
    defaultValues: {
      id: patient.id,
      name: patient.name ?? '',
      email: patient.email ?? '',
      phone: patient.phone ?? '',
      status: patient.status ?? '',
      intakeDate: parseDateString(patient.intakeDate) ?? undefined, // Ensure undefined if parseDateString returns null
      patientIdInternal: patient.patientIdInternal ?? '',
      assignedStaffId: patient.assignedStaffId ?? '',
      insuranceStatus: patient.insuranceStatus ?? '',
      dateOfBirth: patient.dateOfBirth
        ? parseDateString(patient.dateOfBirth)
        : null,
      lastInteractionDate: patient.lastInteractionDate
        ? parseDateString(patient.lastInteractionDate)
        : null,
      nextAppointmentDate: patient.nextAppointmentDate
        ? parseDateString(patient.nextAppointmentDate)
        : null
    }
  });

  const intakeDateValue = watch('intakeDate');

  useEffect(() => {
    if (formState.message === 'Patient updated successfully.') {
      // Don't reset form here as user might want to see the saved values or make further edits.
      // Dialog closure will be handled by onSuccess.
      toast.success(formState.message);
      onSuccess?.();
    } else if (formState.message && formState.message !== '') {
      toast.error(formState.message, {
        description: formState.issues?.join(', ')
      });
    }
  }, [formState, onSuccess]);

  // Function to handle form submission using react-hook-form's handleSubmit
  // This ensures client-side validation runs before the server action is invoked.
  const processForm: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault(); // Prevent default form submission
    handleSubmit(() => {
      // Create FormData and manually append fields
      // This is because server actions expect FormData or a simple object from Object.fromEntries(formData)
      // For dates, ensure they are in a format the server action's Zod schema expects (e.g., ISO string)
      const formData = new FormData(formRef.current!);

      // Convert RHF's date objects back to string for FormData if server action expects strings
      // Or ensure server action's Zod schema uses z.coerce.date for these fields
      // The current server action `editPatient` uses `z.coerce.date` for optional dates.
      // For `intakeDate` (optional in EditPatientSchema), if it's a Date object, it needs to be formatted.
      const rhfValues = watch(); // Get all values from react-hook-form
      if (rhfValues.intakeDate instanceof Date)
        formData.set('intakeDate', rhfValues.intakeDate.toISOString());
      if (rhfValues.dateOfBirth instanceof Date)
        formData.set('dateOfBirth', rhfValues.dateOfBirth.toISOString());
      if (rhfValues.lastInteractionDate instanceof Date)
        formData.set(
          'lastInteractionDate',
          rhfValues.lastInteractionDate.toISOString()
        );
      if (rhfValues.nextAppointmentDate instanceof Date)
        formData.set(
          'nextAppointmentDate',
          rhfValues.nextAppointmentDate.toISOString()
        );

      formAction(formData);
    })(event);
  };

  return (
    <form
      ref={formRef}
      action={formAction} // Still provide action for non-JS scenarios or direct submit
      onSubmit={processForm} // Use RHF for client validation then trigger action
      className='space-y-4'
      id={`edit-patient-form-${patient.id}`}
    >
      <Input type='hidden' {...register('id')} defaultValue={patient.id} />

      <div className='space-y-1'>
        <Label htmlFor={`name-${patient.id}`}>Full Name</Label>
        <Input id={`name-${patient.id}`} {...register('name')} />
        {errors.name && (
          <p className='text-sm text-red-500'>{errors.name.message}</p>
        )}
      </div>

      <div className='space-y-1'>
        <Label htmlFor={`email-${patient.id}`}>Email Address</Label>
        <Input id={`email-${patient.id}`} type='email' {...register('email')} />
        {errors.email && (
          <p className='text-sm text-red-500'>{errors.email.message}</p>
        )}
      </div>

      <div className='space-y-1'>
        <Label htmlFor={`phone-${patient.id}`}>Phone Number</Label>
        <Input id={`phone-${patient.id}`} type='tel' {...register('phone')} />
        {errors.phone && (
          <p className='text-sm text-red-500'>{errors.phone.message}</p>
        )}
      </div>

      <div className='space-y-1'>
        <Label htmlFor={`status-${patient.id}`}>Status</Label>
        <Select
          defaultValue={patient.status}
          onValueChange={(value) =>
            setValue('status', value, { shouldValidate: true })
          }
        >
          <SelectTrigger id={`status-${patient.id}`}>
            <SelectValue placeholder='Select status' />
          </SelectTrigger>
          <SelectContent>
            {patientStatusOptions.map((statusOpt) => (
              <SelectItem key={statusOpt} value={statusOpt}>
                {statusOpt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && (
          <p className='text-sm text-red-500'>{errors.status.message}</p>
        )}
      </div>

      <div className='space-y-1'>
        <Label htmlFor={`intakeDate-${patient.id}`}>Intake Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={`intakeDate-${patient.id}`}
              variant='outline'
              className={cn(
                'w-full justify-start text-left font-normal',
                !intakeDateValue && 'text-muted-foreground'
              )}
            >
              <Icons.calendar className='mr-2 h-4 w-4' />
              {intakeDateValue ? (
                format(intakeDateValue, 'PPP')
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0'>
            <Calendar
              mode='single'
              selected={intakeDateValue}
              onSelect={(date) =>
                setValue('intakeDate', date as Date, { shouldValidate: true })
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.intakeDate && (
          <p className='text-sm text-red-500'>{errors.intakeDate.message}</p>
        )}
      </div>

      {/* Placeholder for other fields like patientIdInternal, assignedStaffId etc. */}
      {/* These can be added similarly if they need to be editable */}
    </form>
  );
}
