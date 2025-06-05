'use client';

import { useFormState } from 'react-dom'; // useFormStatus is not used if SubmitButton is removed
import { useEffect, useRef } from 'react'; // Removed useState
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'; // Button is still used in PopoverTrigger
// import { Textarea } from '@/components/ui/textarea'; // For potential future use (e.g. notes) - Removed
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
import { toast } from 'sonner';

import { addPatient, type AddPatientFormState } from '../actions';

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
];

interface AddPatientFormProps {
  onSuccess?: () => void;
}

// SubmitButton was removed as the submit is handled by DialogFooter in PatientsPage
// function SubmitButton() {
//   const { pending } = useFormStatus();
//   return (
//     <Button type='submit' disabled={pending}>
//       {pending ? <Icons.spinner className='mr-2 h-4 w-4 animate-spin' /> : null}
//       Save Patient
//     </Button>
//   );
// }

export function AddPatientForm({ onSuccess }: AddPatientFormProps) {
  const initialState: AddPatientFormState = { message: '', issues: [] };
  const [formState, formAction] = useFormState(addPatient, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }, // Removed isSubmitting as it's not used
    reset
  } = useForm<ClientAddPatientFormData>({
    resolver: zodResolver(ClientAddPatientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      status: '',
      intakeDate: undefined,
      patientIdInternal: '',
      assignedStaffId: '',
      insuranceStatus: '',
      dateOfBirth: null,
      lastInteractionDate: null,
      nextAppointmentDate: null
    }
  });

  const intakeDateValue = watch('intakeDate');

  useEffect(() => {
    if (formState.message === 'Patient added successfully.') {
      reset();
      onSuccess?.();
    }
    if (
      formState.message &&
      formState.message !== 'Patient added successfully.'
    ) {
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
      onSubmit={handleSubmit(() => formRef.current?.requestSubmit())}
      className='space-y-4'
      id='add-patient-form'
    >
      <div className='space-y-1'>
        <Label htmlFor='name'>Full Name</Label>
        <Input id='name' {...register('name')} />
        {errors.name && (
          <p className='text-sm text-red-500'>{errors.name.message}</p>
        )}
      </div>

      <div className='space-y-1'>
        <Label htmlFor='email'>Email Address</Label>
        <Input id='email' type='email' {...register('email')} />
        {errors.email && (
          <p className='text-sm text-red-500'>{errors.email.message}</p>
        )}
      </div>

      <div className='space-y-1'>
        <Label htmlFor='phone'>Phone Number</Label>
        <Input id='phone' type='tel' {...register('phone')} />
        {errors.phone && (
          <p className='text-sm text-red-500'>{errors.phone.message}</p>
        )}
      </div>

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
    </form>
  );
}
