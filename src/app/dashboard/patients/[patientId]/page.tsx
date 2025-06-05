import type { Metadata } from 'next';

// This metadata could be dynamic based on the patientId
export const metadata: Metadata = {
  title: 'Patient Details',
  description: 'View details for a specific patient.'
};

type PageProps = {
  params: Promise<{ patientId: string }>;
  // Include searchParams if needed later
  // searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PatientDetailPage(props: PageProps) {
  const params = await props.params;
  return (
    <div className='flex flex-col space-y-8 p-4 md:p-8'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Patient Detail Page
          </h2>
          <p className='text-muted-foreground'>
            Details for patient ID: {params.patientId}
          </p>
        </div>
      </div>
      {/* Further content for the patient detail page will be added here */}
      <p>More detailed patient information will be rendered here.</p>
    </div>
  );
}
