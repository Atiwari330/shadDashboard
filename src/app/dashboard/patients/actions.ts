'use server';

// This file will contain Server Actions for patient data mutations.
// - addPatient (US307)
// - editPatient (US308)
// - archivePatient (US309)
// - updatePatientStatus (US310)

import { db } from '@/lib/db';
import { patients } from '@/lib/db/schema'; // Assuming Patient type might be exported from schema or defined elsewhere
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';

// Schema for adding a new patient
const AddPatientSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z
    .string()
    .email({ message: 'Invalid email address.' })
    .optional()
    .or(z.literal('')), // Optional but if provided, must be valid email
  phone: z.string().optional(),
  status: z.string().min(1, { message: 'Status is required.' }),
  intakeDate: z.coerce.date({
    errorMap: () => ({
      message: 'Intake date is required and must be a valid date.'
    })
  }), // Coerce string/number to Date
  // Add other fields from US204 as needed, making them optional or required based on business logic
  patientIdInternal: z.string().optional(),
  assignedStaffId: z.string().optional(),
  lastInteractionDate: z.coerce.date().optional().nullable(),
  nextAppointmentDate: z.coerce.date().optional().nullable(),
  insuranceStatus: z.string().optional(),
  dateOfBirth: z.coerce.date().optional().nullable()
});

export type AddPatientFormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function addPatient(
  prevState: AddPatientFormState,
  formData: FormData
): Promise<AddPatientFormState> {
  const rawData = Object.fromEntries(formData);
  const validatedFields = AddPatientSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const issues = validatedFields.error.issues.map((issue) => issue.message);
    return {
      message: 'Failed to add patient. Please check the fields.',
      issues,
      fields: rawData as Record<string, string> // Keep original data for form repopulation
    };
  }

  try {
    // Drizzle expects date objects for timestamp fields
    const dataToInsert = {
      ...validatedFields.data,
      // Ensure date fields are actual Date objects if not already coerced correctly by Zod
      // Zod's z.coerce.date should handle this, but double-check if issues arise
      intakeDate: new Date(validatedFields.data.intakeDate),
      lastInteractionDate: validatedFields.data.lastInteractionDate
        ? new Date(validatedFields.data.lastInteractionDate)
        : null,
      nextAppointmentDate: validatedFields.data.nextAppointmentDate
        ? new Date(validatedFields.data.nextAppointmentDate)
        : null,
      dateOfBirth: validatedFields.data.dateOfBirth
        ? new Date(validatedFields.data.dateOfBirth)
        : null
    };

    await db.insert(patients).values(dataToInsert);

    revalidatePath('/dashboard/patients'); // Revalidate the patients page to show the new patient

    return { message: 'Patient added successfully.' };
  } catch (error) {
    console.error('Failed to add patient:', error);
    return {
      message: 'An unexpected error occurred while adding the patient.',
      fields: rawData as Record<string, string>
    };
  }
}

// Schema for editing an existing patient
// It's similar to AddPatientSchema but might have different requirements (e.g., ID is essential)
// For now, we'll make most fields optional as we don't know which ones are being edited.
// A more robust solution might involve partial schemas or specific update DTOs.
const EditPatientSchema = AddPatientSchema.extend({
  id: z.string().uuid({ message: 'Invalid patient ID.' }),
  // Make fields optional for editing, as user might only update a subset
  name: z.string().min(1, { message: 'Name is required.' }).optional(),
  email: z
    .string()
    .email({ message: 'Invalid email address.' })
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  status: z.string().min(1, { message: 'Status is required.' }).optional(),
  intakeDate: z.coerce
    .date({
      errorMap: () => ({ message: 'Intake date must be a valid date.' })
    })
    .optional(),
  patientIdInternal: z.string().optional(),
  assignedStaffId: z.string().optional(),
  lastInteractionDate: z.coerce.date().optional().nullable(),
  nextAppointmentDate: z.coerce.date().optional().nullable(),
  insuranceStatus: z.string().optional(),
  dateOfBirth: z.coerce.date().optional().nullable()
});

export type EditPatientFormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function editPatient(
  prevState: EditPatientFormState,
  formData: FormData
): Promise<EditPatientFormState> {
  const rawData = Object.fromEntries(formData);
  const validatedFields = EditPatientSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const issues = validatedFields.error.issues.map((issue) => issue.message);
    return {
      message: 'Failed to update patient. Please check the fields.',
      issues,
      fields: rawData as Record<string, string>
    };
  }

  const { id, ...dataToUpdate } = validatedFields.data;

  // Filter out undefined values so Drizzle only updates provided fields
  const updates: Partial<typeof patients.$inferInsert> = {};
  for (const [key, value] of Object.entries(dataToUpdate)) {
    if (value !== undefined) {
      // Coerce date strings to Date objects if they are date fields
      if (
        [
          'intakeDate',
          'lastInteractionDate',
          'nextAppointmentDate',
          'dateOfBirth'
        ].includes(key) &&
        value !== null
      ) {
        (updates as any)[key] = new Date(value as string | number | Date);
      } else {
        (updates as any)[key] = value;
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    return { message: 'No changes provided to update.' };
  }

  // Add updatedAt manually
  updates.updatedAt = new Date();

  try {
    const result = await db
      .update(patients)
      .set(updates)
      .where(eq(patients.id, id))
      .returning();

    if (result.length === 0) {
      return { message: 'Failed to update patient. Patient not found.' };
    }

    revalidatePath('/dashboard/patients'); // Revalidate list view
    revalidatePath(`/dashboard/patients/${id}`); // Revalidate detail view if it exists

    return { message: 'Patient updated successfully.' };
  } catch (error) {
    console.error('Failed to update patient:', error);
    return {
      message: 'An unexpected error occurred while updating the patient.',
      fields: rawData as Record<string, string>
    };
  }
}

const ArchivePatientSchema = z.object({
  id: z.string().uuid({ message: 'Invalid patient ID.' })
});

export type ArchivePatientFormState = {
  message: string;
  issues?: string[];
  id?: string;
};

export async function archivePatient(
  prevState: ArchivePatientFormState,
  formData: FormData
): Promise<ArchivePatientFormState> {
  const rawData = Object.fromEntries(formData);
  const validatedFields = ArchivePatientSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: 'Failed to archive patient. Invalid patient ID.',
      issues: validatedFields.error.issues.map((issue) => issue.message),
      id: rawData.id as string | undefined
    };
  }

  const { id } = validatedFields.data;

  try {
    const result = await db
      .update(patients)
      .set({ isArchived: true, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();

    if (result.length === 0) {
      return { message: 'Failed to archive patient. Patient not found.', id };
    }

    revalidatePath('/dashboard/patients'); // Revalidate list view
    revalidatePath(`/dashboard/patients/${id}`); // Revalidate detail view

    return { message: 'Patient archived successfully.' };
  } catch (error) {
    console.error('Failed to archive patient:', error);
    return {
      message: 'An unexpected error occurred while archiving the patient.',
      id
    };
  }
}

const UpdatePatientStatusSchema = z.object({
  id: z.string().uuid({ message: 'Invalid patient ID.' }),
  status: z.string().min(1, { message: 'Status cannot be empty.' })
  // Potentially add a list of allowed statuses here for stricter validation
  // e.g., z.enum(['Active', 'Inactive', 'Intake', 'Discharged'])
});

export type UpdatePatientStatusFormState = {
  message: string;
  issues?: string[];
  id?: string;
  status?: string;
};

export async function updatePatientStatus(
  prevState: UpdatePatientStatusFormState,
  formData: FormData
): Promise<UpdatePatientStatusFormState> {
  const rawData = Object.fromEntries(formData);
  const validatedFields = UpdatePatientStatusSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: 'Failed to update patient status. Invalid data.',
      issues: validatedFields.error.issues.map((issue) => issue.message),
      id: rawData.id as string | undefined,
      status: rawData.status as string | undefined
    };
  }

  const { id, status } = validatedFields.data;

  try {
    const result = await db
      .update(patients)
      .set({ status: status, updatedAt: new Date() })
      .where(eq(patients.id, id))
      .returning();

    if (result.length === 0) {
      return {
        message: 'Failed to update status. Patient not found.',
        id,
        status
      };
    }

    revalidatePath('/dashboard/patients'); // Revalidate list view
    revalidatePath(`/dashboard/patients/${id}`); // Revalidate detail view

    return { message: 'Patient status updated successfully.' };
  } catch (error) {
    console.error('Failed to update patient status:', error);
    return {
      message: 'An unexpected error occurred while updating patient status.',
      id,
      status
    };
  }
}

// Placeholder function can be removed or kept for other tests
export async function placeholderServerAction() {
  console.log('Placeholder server action called');
  return { message: 'Placeholder action executed' };
}
