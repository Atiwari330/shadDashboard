'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea'; // For potential future use (e.g. notes)
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
import { format } from 'date-fns';
import { toast } from 'sonner'; // Import toast

import { addPatient, type AddPatientFormState } from '../actions'; // Path to server action

// Re-define a Zod schema specifically for client-side validation if it differs or for clarity
// This should ideally match or be compatible with the server-side AddPatientSchema in actions.ts
const ClientAddPatientSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z
    .string()
    .email({ message: 'Invalid email address.' })
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  status: z.string().min(1, { message: 'Status is required.' }),
  intakeDate: z.date({
    required_error: 'Intake date is required.',
    invalid_type_error: 'Intake date must be a valid date.'
  }),
  // Add other fields as needed, matching the server action schema
  patientIdInternal: z.string().optional(),
  assignedStaffId: z.string().optional(),
  insuranceStatus: z.string().optional(),
  dateOfBirth: z.date().optional().nullable(),
  lastInteractionDate: z.date().optional().nullable(),
  nextAppointmentDate: z.date().optional().nullable()
});

type ClientAddPatientFormData = z.infer<typeof ClientAddPatientSchema>;

const patientStatusOptions = [
  'Active',
  'Intake',
  'Pending',
  'On Hold',
  'Discharged'
]; // Example statuses

interface AddPatientFormProps {
  onSuccess?: () => void; // Callback when form submission is successful
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type='submit' disabled={pending}>
      {pending ? <Icons.spinner className='mr-2 h-4 w-4 animate-spin' /> : null}
      Save Patient
    </Button>
  );
}

export function AddPatientForm({ onSuccess }: AddPatientFormProps) {
  const initialState: AddPatientFormState = { message: '', issues: [] };
  const [formState, formAction] = useFormState(addPatient, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }, // client-side errors from react-hook-form
    reset
  } = useForm<ClientAddPatientFormData>({
    resolver: zodResolver(ClientAddPatientSchema),
    defaultValues: {
      // Set default values for controlled components like Select and Calendar
      name: '',
      email: '',
      phone: '',
      status: '',
      intakeDate: undefined, // Or new Date() if you want a default
      patientIdInternal: '',
      assignedStaffId: '',
      insuranceStatus: '',
      dateOfBirth: null,
      lastInteractionDate: null,
      nextAppointmentDate: null
    }
  });

  const intakeDateValue = watch('intakeDate'); // For Calendar component

  useEffect(() => {
    if (formState.message === 'Patient added successfully.') {
      reset(); // Reset form fields
      onSuccess?.(); // Call success callback (e.g., to close dialog)
    }
    // Potentially show toast notifications based on formState.message or formState.issues
    if (
      formState.message &&
      formState.message !== 'Patient added successfully.'
    ) {
      // Show error toast for server-side validation errors or other failures
      toast.error(formState.message, {
        description: formState.issues?.join(', ')
      });
    } else if (formState.message === 'Patient added successfully.') {
      toast.success(formState.message);
    }
  }, [formState, reset, onSuccess]);

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit(() => formRef.current?.requestSubmit())} // Use RHF for client validation, then submit via action
      className='space-y-4'
      id='add-patient-form' // For associating external submit button
    >
      {/* Name Field */}
      <div className='space-y-1'>
        <Label htmlFor='name'>Full Name</Label>
        <Input id='name' {...register('name')} />
        {errors.name && (
          <p className='text-sm text-red-500'>{errors.name.message}</p>
        )}
      </div>

      {/* Email Field */}
      <div className='space-y-1'>
        <Label htmlFor='email'>Email Address</Label>
        <Input id='email' type='email' {...register('email')} />
        {errors.email && (
          <p className='text-sm text-red-500'>{errors.email.message}</p>
        )}
      </div>

      {/* Phone Field */}
      <div className='space-y-1'>
        <Label htmlFor='phone'>Phone Number</Label>
        <Input id='phone' type='tel' {...register('phone')} />
        {errors.phone && (
          <p className='text-sm text-red-500'>{errors.phone.message}</p>
        )}
      </div>

      {/* Status Field */}
      <div className='space-y-1'>
        <Label htmlFor='status'>Status</Label>
        <Select
          onValueChange={(value) =>
            setValue('status', value, { shouldValidate: true })
          }
          defaultValue={watch('status')}
        >
          <SelectTrigger id='status'>
            <SelectValue placeholder='Select status' />
          </SelectTrigger>
          <SelectContent>
            {patientStatusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && (
          <p className='text-sm text-red-500'>{errors.status.message}</p>
        )}
      </div>

      {/* Intake Date Field */}
      <div className='space-y-1'>
        <Label htmlFor='intakeDate'>Intake Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id='intakeDate'
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

      {/* Server message display (can be removed if toasts are preferred for all messages) */}
      {/* {formState.message && !formState.issues && !formState.message.includes('success') && (
        <p className="text-sm text-red-500">
          {formState.message}
        </p>
      )}
      {formState.issues && formState.issues.length > 0 && (
         <div className="text-sm text-red-500">
           <p>Please correct the following errors:</p>
           <ul className="list-disc pl-5">
             {formState.issues.map((issue, index) => <li key={index}>{issue}</li>)}
           </ul>
         </div>
      )} */}

      {/* Submit button is now part of the DialogFooter in PatientsPage, associated by form ID */}
      {/* <SubmitButton /> */}
    </form>
  );
}
