import { db } from '@/lib/db'; // Assuming db client is accessible like this
import { patients } from '@/lib/db/schema';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const patientStatuses = [
  'Active',
  'Intake',
  'Pending',
  'Archived',
  'On Hold',
  'Discharged'
];
const insuranceStatuses = ['Active', 'Inactive', 'Pending Approval', 'Denied'];

async function seedPatients(count: number = 20) {
  console.log('Starting to seed patients...');

  if (!process.env.DATABASE_URL) {
    console.error(
      'Error: DATABASE_URL is not set in .env.local. Make sure it is configured.'
    );
    process.exit(1);
  }

  const existingPatients = await db
    .select({ id: patients.id })
    .from(patients)
    .limit(count);
  if (existingPatients.length >= count) {
    console.log(
      `Already have ${existingPatients.length} or more patients. Seeding skipped.`
    );
    return;
  }

  const dataToInsert = [];

  for (let i = 0; i < count; i++) {
    const createdAt = faker.date.past({ years: 2 });
    const updatedAt = faker.date.between({ from: createdAt, to: new Date() });
    const intakeDate = faker.date.between({ from: createdAt, to: updatedAt });
    const lastInteraction = faker.datatype.boolean(0.7)
      ? faker.date.between({ from: intakeDate, to: new Date() })
      : null;
    const nextAppointment = faker.datatype.boolean(0.5)
      ? faker.date.future({ years: 1, refDate: updatedAt })
      : null;
    const dateOfBirth = faker.date.birthdate({ min: 18, max: 85, mode: 'age' });

    dataToInsert.push({
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number(),
      patientIdInternal: `P${faker.string.alphanumeric({ length: 8, casing: 'upper' })}`,
      assignedStaffId: faker.datatype.boolean(0.8)
        ? `S${faker.string.alphanumeric({ length: 6 })}`
        : null,
      status: faker.helpers.arrayElement(patientStatuses),
      lastInteractionDate: lastInteraction,
      nextAppointmentDate: nextAppointment,
      insuranceStatus: faker.helpers.arrayElement(insuranceStatuses),
      intakeDate: intakeDate,
      dateOfBirth: dateOfBirth,
      isArchived: false, // Start with non-archived patients
      createdAt: createdAt,
      updatedAt: updatedAt
    });
  }

  try {
    console.log(`Inserting ${dataToInsert.length} mock patients...`);
    await db.insert(patients).values(dataToInsert);
    console.log('Successfully seeded patients!');
  } catch (error) {
    console.error('Error seeding patients:', error);
  } finally {
    // Ensure the script exits, especially if the DB connection keeps it alive.
    // For 'postgres' (node-postgres), the client might not automatically close.
    // If using a connection pool from Drizzle, it might handle this better.
    // For a simple script, explicitly exiting might be necessary if it hangs.
    // However, `db.insert` should complete. If it hangs, the issue might be with the db client setup for scripts.
    // For now, let's assume the db client used by Drizzle (`postgres` package) will allow the script to exit.
    // If not, we might need to call `client.end()` if `client` was exported from `@/lib/db`.
    // Since `@/lib/db` exports `db` (the Drizzle instance), direct client control isn't straightforward here.
    // Let's rely on the script finishing naturally.
    console.log('Seeding process finished.');
    process.exit(0); // Force exit if it hangs
  }
}

const numberOfPatientsToSeed = 25; // Or get from command line args
seedPatients(numberOfPatientsToSeed);
