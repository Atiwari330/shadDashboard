import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';

export const patients = pgTable('patients', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  patientIdInternal: text('patient_id_internal'),
  assignedStaffId: text('assigned_staff_id'), // For now, will be text. Can be changed to UUID to reference staff table later.
  status: text('status').notNull(), // Assuming status is required
  lastInteractionDate: timestamp('last_interaction_date'),
  nextAppointmentDate: timestamp('next_appointment_date'),
  insuranceStatus: text('insurance_status'),
  intakeDate: timestamp('intake_date', { mode: 'date' }).notNull(), // Assuming intake_date is required
  dateOfBirth: timestamp('date_of_birth', { mode: 'date' }),
  isArchived: boolean('is_archived').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});
