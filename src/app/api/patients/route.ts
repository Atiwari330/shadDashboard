// API route for managing patients

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { patients } from '@/lib/db/schema';
import { sql, asc, desc, or, ilike, SQL, eq } from 'drizzle-orm'; // Added eq for potential future use

// Define allowed sortable columns to prevent arbitrary column sorting
const allowedSortByFields: Array<keyof typeof patients.$inferSelect> = [
  'name',
  'email',
  'status',
  'intakeDate',
  'createdAt',
  'lastInteractionDate',
  'nextAppointmentDate'
  // Add other sortable fields as needed
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pageParam = searchParams.get('page');
  const limitParam = searchParams.get('limit');
  const sortByParam = searchParams.get('sortBy');
  const sortOrderParam = searchParams.get('sortOrder');
  const searchParam = searchParams.get('search');

  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const limit = limitParam ? parseInt(limitParam, 10) : 10; // Default limit to 10
  const offset = (page - 1) * limit;

  try {
    let searchCondition: SQL | undefined = undefined;
    if (searchParam) {
      const searchQuery = `%${searchParam}%`;
      searchCondition = or(
        ilike(patients.name, searchQuery),
        ilike(patients.email, searchQuery)
        // Add other searchable fields here if needed
      );
    }

    const orderByClauses: SQL[] = [];
    if (
      sortByParam &&
      allowedSortByFields.includes(
        sortByParam as keyof typeof patients.$inferSelect
      )
    ) {
      const column =
        patients[sortByParam as keyof typeof patients.$inferSelect];
      if (sortOrderParam?.toLowerCase() === 'desc') {
        orderByClauses.push(desc(column));
      } else {
        orderByClauses.push(asc(column));
      }
    } else {
      orderByClauses.push(desc(patients.createdAt)); // Default sort order
    }

    // Build the main query for fetching paginated data
    const paginatedPatientsPromise = (
      searchCondition
        ? db.select().from(patients).where(searchCondition)
        : db.select().from(patients)
    )
      .orderBy(...orderByClauses)
      .limit(limit)
      .offset(offset);

    // Build the query for fetching the total count of items
    const totalCountPromise = searchCondition
      ? db
          .select({ count: sql<number>`count(*)::int` })
          .from(patients)
          .where(searchCondition)
      : db.select({ count: sql<number>`count(*)::int` }).from(patients);

    const [paginatedPatients, totalCountResult] = await Promise.all([
      paginatedPatientsPromise,
      totalCountPromise
    ]);

    const totalItems = totalCountResult[0].count;
    const totalPages = Math.ceil(totalItems / limit);

    return NextResponse.json({
      data: paginatedPatients,
      meta: {
        page,
        limit,
        totalItems,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { message: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}
