# Feature: Patients Management Screen

This document outlines the user stories for implementing the new Patients Management Screen.

## Overall Definition of Done (DoD)

For each story to be considered "Done":
- Code implemented as per requirements.
- Unit tests written and passing (where applicable).
- Integration tests written and passing (where applicable, especially for API and Server Actions).
- Code reviewed and approved by at least one other team member.
- Functionality manually tested and meets acceptance criteria.
- No known critical bugs related to the story.
- Relevant documentation (code comments, README updates if any) updated.
- Story merged to the main development branch.

---

## Phase 0: Codebase Familiarization & Assumption Validation

### Epic: Initial Understanding & Setup Verification

- **Priority Rationale:** Foundational understanding is critical before development. (P1)
- **Dependencies:** None.

- **Stories:**
    - [ ] **US001: Review Project Structure & Key Files**
        - As an Engineer, I want to review the existing project structure, `package.json`, `next.config.ts`, main layout files (`src/app/dashboard/layout.tsx`), and existing component/feature patterns, so that I can understand how to integrate the new feature seamlessly.
        - **Acceptance Criteria:**
            - Given the project codebase, when the engineer reviews the specified files and directories, then they can articulate the current architecture for UI, navigation, and state management.
            - Given the project codebase, when the engineer reviews `package.json`, then they can list key existing dependencies and their versions.
    - [ ] **US002: Document Current Icon System**
        - As an Engineer, I want to document the current icon system (`src/components/icons.tsx` and usage of `@tabler/icons-react`), so that I can consistently apply icons for the new feature.
        - **Acceptance Criteria:**
            - Given `src/components/icons.tsx`, when the engineer reviews the file, then they can describe how icons are imported and mapped.
    - [ ] **US003: Verify Environment Setup Instructions**
        - As an Engineer, I want to review `env.example.txt` and any existing environment setup documentation, so that I can correctly configure my local environment for database and other services.
        - **Acceptance Criteria:**
            - Given `env.example.txt`, when the engineer reviews it, then they understand which environment variables are required for the project.

---

## Phase 1: Project Setup & Dependencies

### Epic: Environment and Tooling Configuration

- **Priority Rationale:** Essential prerequisites for development. (P1)
- **Dependencies:** US001, US003.

- **Stories:**
    - [ ] **US101: Install SWR Dependency**
        - As an Engineer, I want to install the `swr` library and add it to `package.json`, so that I can use it for client-side data fetching.
        - **Acceptance Criteria:**
            - Given the project, when `npm install swr` (or `pnpm add swr` / `yarn add swr`) is run, then `swr` is listed as a dependency in `package.json` and `node_modules`.
    - [ ] **US102: Install Drizzle ORM and PostgreSQL Driver Dependencies**
        - As an Engineer, I want to install `drizzle-orm` and `postgres` (Drizzle's PostgreSQL driver) and add them to `package.json`, so that I can interact with the Supabase database.
        - **Acceptance Criteria:**
            - Given the project, when the appropriate install commands are run, then `drizzle-orm` and `postgres` are listed as dependencies in `package.json` and `node_modules`.
    - [ ] **US103: Install Drizzle Kit (Dev Dependency)**
        - As an Engineer, I want to install `drizzle-kit` as a dev dependency, so that I can generate database migrations.
        - **Acceptance Criteria:**
            - Given the project, when the appropriate install command is run, then `drizzle-kit` is listed as a dev dependency in `package.json` and `node_modules`.
    - [ ] **US104: Update `.env.local` and `env.example.txt` for Database**
        - As an Engineer, I want to define `DATABASE_URL` in `.env.local` (for local use) and add a placeholder to `env.example.txt`, so that the application can connect to the Supabase database.
        - **Acceptance Criteria:**
            - Given the project, when `.env.local` is configured with a valid Supabase connection string (including session pooler option), then the application can potentially connect.
            - Given the project, `env.example.txt` contains an entry like `DATABASE_URL="postgresql://user:password@host:port/database?pgbouncer=true&connection_limit=1"`.

---

## Phase 2: Database Schema (Drizzle ORM & Supabase)

### Epic: Patient Data Model Definition

- **Priority Rationale:** Core data structure is fundamental. (P1)
- **Dependencies:** US102, US103, US104.

- **Stories:**
    - [ ] **US201: Create Drizzle Schema File for Patients**
        - As an Engineer, I want to create a new file (e.g., `src/lib/db/schema/patients.ts`) to define the `patients` table schema using Drizzle ORM, so that patient data can be structured and stored.
        - **Acceptance Criteria:**
            - Given the project structure, when the schema file is created, then it is ready for table definitions.
    - [ ] **US202: Define `patients` Table Core Fields in Schema**
        - As an Engineer, I want to define `id` (PK, UUID), `name` (text), `created_at` (timestamp), and `updated_at` (timestamp) fields for the `patients` table in `patients.ts`, so that basic patient information can be stored.
        - **Acceptance Criteria:**
            - Given `patients.ts`, when the fields are defined, then the Drizzle schema reflects these core attributes.
    - [ ] **US203: Define `patients` Table Contact Info Fields**
        - As an Engineer, I want to define `phone` (text, nullable) and `email` (text, nullable) fields for the `patients` table, so that patient contact information can be stored.
        - **Acceptance Criteria:**
            - Given `patients.ts`, when the fields are defined, then the Drizzle schema reflects these contact attributes.
    - [ ] **US204: Define `patients` Table Health Admin Fields**
        - As an Engineer, I want to define `patient_id_internal` (text, nullable), `assigned_staff_id` (text, for now), `status` (text), `last_interaction_date` (timestamp, nullable), `next_appointment_date` (timestamp, nullable), `insurance_status` (text), `intake_date` (date), and `date_of_birth` (date, nullable) for the `patients` table, so that specific health administration details can be stored.
        - **Acceptance Criteria:**
            - Given `patients.ts`, when the fields are defined, then the Drizzle schema reflects these administrative attributes.
    - [ ] **US205: (Optional) Define Basic `staff` Table Schema**
        - As an Engineer, I want to create a basic `staff` table schema (e.g., `src/lib/db/schema/staff.ts`) with `id` (PK) and `name` (text), so that `assigned_staff_id` in `patients` can eventually reference it.
        - **Acceptance Criteria:**
            - Given a new schema file, when the `staff` table is defined, then it includes `id` and `name`.
            - **Note:** This is optional and can be simplified to a text field in `patients` if a full `staff` table is too much for the initial scope.
    - [ ] **US206: Configure Drizzle Kit (`drizzle.config.ts`)**
        - As an Engineer, I want to create and configure `drizzle.config.ts` to point to the schema file(s) and define the output directory for migrations, so that `drizzle-kit` can generate migrations.
        - **Acceptance Criteria:**
            - Given the project root, when `drizzle.config.ts` is created and configured, then `drizzle-kit` commands can locate the schema.
    - [ ] **US207: Generate Initial Database Migration**
        - As an Engineer, I want to use `drizzle-kit generate:pg` to create the initial SQL migration file based on the defined schema(s), so that the database structure can be version-controlled and applied.
        - **Acceptance Criteria:**
            - Given the configured Drizzle schemas and `drizzle.config.ts`, when `drizzle-kit generate:pg` is run, then a new migration file is created in the specified output directory.
    - [ ] **US208: Set up Drizzle Client (`src/lib/db/index.ts`)**
        - As an Engineer, I want to create `src/lib/db/index.ts` to initialize and export the Drizzle client instance connected to Supabase (using `DATABASE_URL`), so that the application can execute database queries.
        - **Acceptance Criteria:**
            - Given `src/lib/db/index.ts` and a valid `DATABASE_URL`, when the client is initialized, then it can connect to the Supabase instance.
    - [ ] **US209: Apply Initial Migration to Supabase**
        - As an Engineer, I want to apply the generated migration to the Supabase development database (manually via Supabase SQL editor or using a migration tool/script if set up), so that the `patients` (and optionally `staff`) table is created.
        - **Acceptance Criteria:**
            - Given the Supabase instance and the generated migration SQL, when the migration is applied, then the tables and columns exist in the database as defined.

---

## Phase 3: Backend - API Routes & Server Actions

### Epic: Patient Data Access and Manipulation Logic

- **Priority Rationale:** Enables frontend to interact with data. (P1 for GET, P2 for mutations)
- **Dependencies:** Phase 2 (especially US208, US209).

- **Stories:**
    - [ ] **US301: Create API Route Structure for Patients (`src/app/api/patients/route.ts`)**
        - As an Engineer, I want to create the file structure for the patients API endpoint, so that I can implement data fetching logic.
        - **Acceptance Criteria:**
            - Given the Next.js app router structure, when `src/app/api/patients/route.ts` is created, then it's ready for HTTP handler implementations.
    - [ ] **US302: Implement Basic `GET /api/patients` Handler**
        - As an Engineer, I want to implement a `GET` handler in `route.ts` that fetches all patients from the `patients` table using Drizzle and returns them as JSON, so that the frontend can display patient data.
        - **Acceptance Criteria:**
            - Given patients exist in the database, when a GET request is made to `/api/patients`, then a JSON array of patients is returned with a 200 status.
            - Given no patients exist, when a GET request is made, then an empty array is returned.
    - [ ] **US303: Add Pagination to `GET /api/patients`**
        - As an Engineer, I want to modify the `GET` handler to accept `page` and `limit` query parameters and implement pagination using Drizzle, so that large datasets can be handled efficiently.
        - **Acceptance Criteria:**
            - Given patients exist, when `GET /api/patients?page=1&limit=10` is requested, then the first 10 patients are returned.
            - Given patients exist, when `GET /api/patients?page=2&limit=10` is requested, then patients 11-20 are returned.
    - [ ] **US304: Add Basic Sorting to `GET /api/patients`**
        - As an Engineer, I want to modify the `GET` handler to accept `sortBy` (e.g., `name`, `intake_date`) and `sortOrder` (`asc`, `desc`) query parameters and implement sorting using Drizzle, so that patient data can be viewed in different orders.
        - **Acceptance Criteria:**
            - Given patients exist, when `GET /api/patients?sortBy=name&sortOrder=asc` is requested, then patients are returned sorted by name alphabetically.
    - [ ] **US305: Add Basic Search Filter to `GET /api/patients`**
        - As an Engineer, I want to modify the `GET` handler to accept a `search` query parameter and filter patients by `name` or `email` (case-insensitive) using Drizzle, so that users can find specific patients.
        - **Acceptance Criteria:**
            - Given a patient named "John Doe", when `GET /api/patients?search=john` is requested, then John Doe's record is included in the results.
    - [ ] **US306: Create Server Actions File (`src/app/dashboard/patients/actions.ts`)**
        - As an Engineer, I want to create the `actions.ts` file, so that I can define server-side functions for patient data mutations.
        - **Acceptance Criteria:**
            - Given the project structure, when `src/app/dashboard/patients/actions.ts` is created, then it's ready for Server Action definitions.
    - [ ] **US307: Implement `addPatient` Server Action (Basic)**
        - As an Engineer, I want to implement an `addPatient` Server Action that accepts patient data (e.g., name, email), validates it using Zod (basic validation for required fields), and inserts a new record into the `patients` table using Drizzle, so that new patients can be created.
        - **Acceptance Criteria:**
            - Given valid patient data, when `addPatient` is called, then a new patient record is created in the database.
            - Given invalid patient data (e.g., missing name), when `addPatient` is called, then an error is returned/thrown.
    - [ ] **US308: Implement `editPatient` Server Action (Basic)**
        - As an Engineer, I want to implement an `editPatient` Server Action that accepts a `patientId` and updated data, validates the data with Zod, and updates the corresponding patient record using Drizzle, so that patient details can be modified.
        - **Acceptance Criteria:**
            - Given an existing patient and valid update data, when `editPatient` is called, then the patient's record is updated in the database.
    - [ ] **US309: Implement `archivePatient` Server Action (Basic Soft Delete)**
        - As an Engineer, I want to implement an `archivePatient` Server Action that accepts a `patientId` and marks the patient as archived (e.g., sets an `is_archived` boolean field to true, requires adding this field to schema US202/204), so that patients can be soft-deleted.
        - **Acceptance Criteria:**
            - Given an existing patient, when `archivePatient` is called, then the patient's `is_archived` status is set to true.
            - **Dependency:** Requires adding `is_archived` (boolean, default false) to `patients` schema and migrating.
    - [ ] **US310: Implement `updatePatientStatus` Server Action**
        - As an Engineer, I want to implement an `updatePatientStatus` Server Action that accepts `patientId` and `newStatus`, validates the status, and updates the patient's `status` field, so that a patient's status can be changed directly.
        - **Acceptance Criteria:**
            - Given an existing patient and a valid new status, when `updatePatientStatus` is called, then the patient's `status` is updated in the database.

---

## Phase 4: Frontend - Navigation & Page Structure

### Epic: Integrating Patients Page into the Application Shell

- **Priority Rationale:** Makes the new section accessible. (P1)
- **Dependencies:** None for basic structure, Phase 5 for content.

- **Stories:**
    - [ ] **US401: Add "Patients" to Sidebar Navigation**
        - As an Engineer, I want to update `src/constants/data.ts` to include a new `NavItem` for "Patients" with the URL `/dashboard/patients` and an appropriate Tabler icon (e.g., `IconUsers` or `IconUsersGroup` from `src/components/icons.tsx`), so that users can navigate to the patients page from the sidebar.
        - **Acceptance Criteria:**
            - Given the application is running, when the sidebar is viewed, then a "Patients" link with an icon is visible.
            - Given the "Patients" link is clicked, then the browser navigates to `/dashboard/patients`.
    - [ ] **US402: Create Patients Page Directory and Basic `page.tsx`**
        - As an Engineer, I want to create the directory `src/app/dashboard/patients/` and a basic `page.tsx` file within it that renders a simple heading like "Patients Page", so that the navigation link has a destination.
        - **Acceptance Criteria:**
            - Given navigation to `/dashboard/patients`, when the page loads, then the "Patients Page" heading is displayed.
    - [ ] **US403: Create Patient Detail Page Directory and Basic `page.tsx`**
        - As an Engineer, I want to create `src/app/dashboard/patients/[patientId]/page.tsx` with a basic placeholder (e.g., "Patient Detail Page for ID: {params.patientId}"), so that links from the patient table have a destination.
        - **Acceptance Criteria:**
            - Given navigation to `/dashboard/patients/some-id`, when the page loads, then "Patient Detail Page for ID: some-id" is displayed.
    - [ ] **US404: Implement Main Layout for `PatientsPage` (`page.tsx`)**
        - As an Engineer, I want to structure `src/app/dashboard/patients/page.tsx` with top-level `div`s for Header, Search/Filter Bar, Patient Data Table, and Pagination Footer using Tailwind CSS for basic layout and padding, so that components can be placed correctly.
        - **Acceptance Criteria:**
            - Given `/dashboard/patients` page, when inspected, then the DOM structure reflects distinct areas for header, filters, table, and pagination.

---

## Phase 5: Frontend - Components for Patients Page

### Epic: Building the User Interface Elements

- **Priority Rationale:** Core UI elements for user interaction. (P2)
- **Dependencies:** Phase 3 (for data), Phase 4 (for page structure).

#### Feature: Page Header

- **Stories:**
    - [ ] **US501: Implement Page Title and Refresh Button**
        - As an Engineer, I want to add an `<h1>Patients</h1>` title and a shadcn/ui `Button` with a Tabler `IconRefresh` to the header area of `PatientsPage`, so that the page is clearly identified and data can be refreshed.
        - **Acceptance Criteria:**
            - Given the Patients page, when the header is viewed, then the title "Patients" and a refresh icon button are visible.
            - **Note:** Refresh functionality will be hooked up later with SWR.
    - [ ] **US502: Implement "Add New Patient" Button & Dialog (Structure)**
        - As an Engineer, I want to add a shadcn/ui `Button` ("Add New Patient" with Tabler `IconUserPlus`) to the header that triggers a shadcn/ui `Dialog` for adding a new patient, so that users can initiate patient creation.
        - **Acceptance Criteria:**
            - Given the Patients page, when the "Add New Patient" button is clicked, then a dialog appears.
            - Dialog contains a title like "Add New Patient" and a close button.
    - [ ] **US503: Implement Form within "Add New Patient" Dialog (Basic Fields)**
        - As an Engineer, I want to build a form using `react-hook-form` and shadcn/ui `Input`/`Label` inside the "Add New Patient" dialog for essential fields (e.g., Name, Email, Phone, Intake Date, Status), so that users can input patient data.
        - **Acceptance Criteria:**
            - Given the "Add New Patient" dialog is open, then input fields for Name, Email, Phone, Intake Date, and Status are visible.
            - A "Save Patient" and "Cancel" button are present in the dialog.
    - [ ] **US504: Connect "Add New Patient" Dialog Form to `addPatient` Server Action**
        - As an Engineer, I want to connect the "Add New Patient" form submission to the `addPatient` Server Action, display `sonner` toast notifications on success/failure, and close the dialog on success, so that new patients can be saved.
        - **Acceptance Criteria:**
            - Given valid data in the "Add New Patient" form, when "Save Patient" is clicked, then the `addPatient` action is called, a success toast appears, and the dialog closes.
            - Data should refresh in the table (SWR revalidation).
    - [ ] **US505: Implement "Quick Add Patient" Button & Dialog (Optional, simplified version of US502-504)**
        - As an Engineer, I want to add an optional "Quick Add Patient" `Button` opening a `Dialog` with a simplified form (e.g., only Name and Email) that also uses the `addPatient` Server Action, so that users have a faster way to add minimal patient details.
        - **Acceptance Criteria:**
            - Similar to US502-504 but with fewer fields.
    - [ ] **US506: Implement Header "More Options" Dropdown (Structure)**
        - As an Engineer, I want to add a shadcn/ui `Button` (Tabler `IconDots` or `IconSettings`) in the header that triggers a shadcn/ui `DropdownMenu` with placeholder items "Import Patients" and "Export Patients", so that future global actions can be added.
        - **Acceptance Criteria:**
            - Given the Patients page, when the "More Options" icon button is clicked, then a dropdown menu appears with "Import Patients" and "Export Patients" items.

#### Feature: Search & Filter Bar

- **Stories:**
    - [ ] **US510: Implement Search Input Field**
        - As an Engineer, I want to add a shadcn/ui `Input` field with an inline Tabler `IconSearch` for free-text search in the "Search & Filter Bar" section, so that users can type search queries.
        - **Acceptance Criteria:**
            - Given the Patients page, then a search input field with a search icon is visible.
            - An 'x' icon (Tabler `IconX`) to clear the input should be present when text is entered.
    - [ ] **US511: Implement Debouncing for Search Input**
        - As an Engineer, I want to apply debouncing to the search input field, so that API calls are not made on every keystroke, improving performance.
        - **Acceptance Criteria:**
            - Given the search input, when the user types, then the search state (for SWR) updates only after a short delay (e.g., 300-500ms) of inactivity.
    - [ ] **US512: Implement "+ Filter" Button and Popover/Dialog (Structure)**
        - As an Engineer, I want to add a shadcn/ui `Button` ("Filter" with Tabler `IconFilter`) that opens a shadcn/ui `Popover` (or `Dialog`) for building filter queries, so that users can access advanced filtering options.
        - **Acceptance Criteria:**
            - Given the Patients page, when the "Filter" button is clicked, then a popover/dialog appears.
            - Popover/dialog contains a title like "Apply Filters" and a close/apply button.
            - **Note:** Actual filter building UI is a separate story (US513).
    - [ ] **US513: Implement Basic Filter Options in Popover (e.g., by Status)**
        - As an Engineer, I want to add a `Select` component within the filter popover to filter patients by `status` (e.g., "Active", "Intake"), so that users can apply a simple filter.
        - **Acceptance Criteria:**
            - Given the filter popover is open, then a dropdown to select patient status is available.
            - When a status is selected and applied, then the patient list (via SWR params) updates to show only patients with that status.

#### Feature: Patient Data Table

- **Stories:**
    - [ ] **US520: Create `PatientDataTable` Client Component Structure**
        - As an Engineer, I want to create a new client component (e.g., `src/features/patients/components/patient-data-table.tsx`) that will house the `@tanstack/react-table` and shadcn/ui `Table` implementation, so that table logic is encapsulated.
        - **Acceptance Criteria:**
            - Given the new component file, it is set up to receive data and column definitions.
    - [ ] **US521: Fetch Patient Data using SWR in `PatientDataTable`**
        - As an Engineer, I want to use the SWR hook in `PatientDataTable` to fetch data from the `/api/patients` endpoint, so that the table can be populated with patient records.
        - **Acceptance Criteria:**
            - Given the component mounts, when data is fetched successfully via SWR, then the patient data is available to the table.
            - Loading and error states from SWR should be handled (e.g., display skeleton/message).
    - [ ] **US522: Define Basic Table Columns (Name, Email, Status, Intake Date)**
        - As an Engineer, I want to define columns for `@tanstack/react-table` for "Patient Name", "Email", "Status" (using shadcn/ui `Badge`), and "Intake Date", so that these key details are displayed in the table.
        - **Acceptance Criteria:**
            - Given patient data is available, when the table renders, then columns for Name, Email, Status (with badge styling), and Intake Date are visible with correct data.
    - [ ] **US523: Make Patient Name a Link to Detail Page**
        - As an Engineer, I want the "Patient Name" cell in the table to be a Next.js `Link` that navigates to `app/dashboard/patients/[patientId]/page.tsx`, so that users can view detailed patient profiles.
        - **Acceptance Criteria:**
            - Given the table displays a patient, when their name is clicked, then the browser navigates to their detail page URL.
    - [ ] **US524: Implement Clickable Column Headers for Sorting**
        - As an Engineer, I want table headers (e.g., for "Patient Name", "Intake Date") to be clickable shadcn/ui `Button`s that trigger sorting (ascending/descending) of the data via SWR parameters, so that users can sort the patient list.
        - **Acceptance Criteria:**
            - Given a column header, when clicked, then the table data re-fetches and re-sorts according to that column.
            - An icon (Tabler `IconArrowUpDown`, `IconArrowUp`, `IconArrowDown`) indicates the current sort state.
    - [ ] **US525: Implement Row Actions Dropdown Menu (Structure)**
        - As an Engineer, I want to add a "More Actions" column with a shadcn/ui `Button` (Tabler `IconDots`) in each row that triggers a shadcn/ui `DropdownMenu`, so that users can perform actions on individual patients.
        - **Acceptance Criteria:**
            - Given the table displays patient rows, then each row has a "More Actions" button.
            - When clicked, a dropdown menu appears.
    - [ ] **US526: Add "Edit Patient Details" to Row Actions Dropdown**
        - As an Engineer, I want to add a "Edit Patient Details" `DropdownMenuItem` that opens a `Dialog` pre-filled with the selected patient's data (fetched or from row data) and connects to the `editPatient` Server Action, so that users can edit patients from the table.
        - **Acceptance Criteria:**
            - Given the row actions dropdown, when "Edit Patient Details" is clicked, then a dialog opens with the patient's current data in a form.
            - When the form is submitted, the `editPatient` action is called, and the table data refreshes.
    - [ ] **US527: Add "Archive Patient" to Row Actions Dropdown**
        - As an Engineer, I want to add an "Archive Patient" `DropdownMenuItem` that, after a shadcn/ui `AlertDialog` confirmation, calls the `archivePatient` Server Action, so that users can archive patients.
        - **Acceptance Criteria:**
            - Given the row actions dropdown, when "Archive Patient" is clicked, then a confirmation dialog appears.
            - If confirmed, the `archivePatient` action is called, and the patient is visually indicated as archived or removed from the main list (depending on API filter).
    - [ ] **US528: Add Placeholder Inline Quick Actions (Add Task, Send Email, Make Call)**
        - As an Engineer, I want to add placeholder icon `Button`s (e.g., Tabler `IconListPlus`, `IconMail`, `IconPhone`) for "Add Task", "Send Email", "Make Call" in each row, wrapped in `Tooltip`s, so that these common actions are quickly accessible (functionality to be basic modals for now).
        - **Acceptance Criteria:**
            - Given a patient row, then three icon buttons for quick actions are visible (e.g., on hover).
            - Each button has a tooltip. Clicking them opens a placeholder modal.
    - [ ] **US529: Implement Table Skeleton Loader**
        - As an Engineer, I want to display shadcn/ui `Skeleton` components that mimic the table structure while data is loading via SWR, so that users see a visual placeholder.
        - **Acceptance Criteria:**
            - Given the table is fetching data, when the page loads, then a skeleton representation of the table is shown.
    - [ ] **US530: Implement Table Empty States**
        - As an Engineer, I want to display a helpful message (e.g., "No patients found. Add one to get started!" or "No patients match your filters.") when the table has no data or when filters yield no results, so that the user understands the state.
        - **Acceptance Criteria:**
            - Given no patients exist in the system, when the page loads, then the "No patients found" message is displayed with a call to action.
            - Given filters are applied that result in no matches, then the "No patients match" message is displayed.

#### Feature: Pagination and Item Count Footer

- **Stories:**
    - [ ] **US540: Implement Item Count Display**
        - As an Engineer, I want to display text like "Showing 1-10 of 100 patients" below the table, dynamically updating based on SWR data and pagination state, so that users know their current view context.
        - **Acceptance Criteria:**
            - Given the table displays paginated data, then the item count text accurately reflects the current page and total items.
    - [ ] **US541: Implement "Items Per Page" Selector**
        - As an Engineer, I want to add a shadcn/ui `Select` component that allows users to choose the number of items per page (e.g., 10, 25, 50), which updates the SWR query, so that users can control data density.
        - **Acceptance Criteria:**
            - Given the pagination footer, then an "Items Per Page" select dropdown is visible.
            - When a new value is selected, then the table re-fetches data with the new limit.
    - [ ] **US542: Implement Pagination Controls (Next, Previous, Page Numbers)**
        - As an Engineer, I want to use the shadcn/ui `Pagination` component (or custom `Button`s) for "First," "Previous," "Next," "Last" page navigation and display page numbers, so that users can navigate through patient data.
        - **Acceptance Criteria:**
            - Given multiple pages of data, then pagination controls are visible and functional.
            - "Previous" is disabled on the first page; "Next" is disabled on the last page.

---

## Phase 6: State Management & Client-Side Logic

### Epic: Managing UI State and Interactions

- **Priority Rationale:** Enhances user experience and component coordination. (P2-P3)
- **Dependencies:** Phase 5 components.

- **Stories:**
    - [ ] **US601: Set up Zustand Store (or React Context) for Patient Filters**
        - As an Engineer, I want to initialize a Zustand store (or React Context) to manage shared state for search query and active filter criteria, so that different components can react to filter changes.
        - **Acceptance Criteria:**
            - Given the store/context is set up, then filter state can be set and read by components.
    - [ ] **US602: Connect Search Input and Filter UI to Zustand/Context**
        - As an Engineer, I want the Search Input and Filter UI components to update and read from the shared filter state in Zustand/Context, so that SWR can use this state to re-fetch data.
        - **Acceptance Criteria:**
            - Given a search term is typed or a filter is applied, then the shared state updates.
            - SWR hook in `PatientDataTable` re-fetches data based on changes to this shared state.
    - [ ] **US603: Implement Client-Side Form Validation with `react-hook-form` and Zod**
        - As an Engineer, I want to integrate `react-hook-form` with the Zod resolver for client-side validation in the "Add New Patient" and "Edit Patient" dialog forms, so that users get immediate feedback on input errors.
        - **Acceptance Criteria:**
            - Given an invalid input in a patient form (e.g., improperly formatted email), when the field loses focus or form is submitted, then an error message is displayed next to the field.
    - [ ] **US604: Implement Column Visibility Manager (Basic)**
        - As an Engineer, I want to add a `Button` (Tabler `IconColumns`) to the table header area that opens a `DropdownMenu` with checkboxes for each column, allowing users to show/hide columns, with state managed locally in `PatientDataTable` for now, so users can customize their table view.
        - **Acceptance Criteria:**
            - Given the table header, when the column visibility button is clicked, then a dropdown with column names and checkboxes appears.
            - When a checkbox is toggled, then the corresponding column is shown/hidden in the table.

---

## Phase 7: Styling & Responsiveness

### Epic: Visual Polish and Adaptability

- **Priority Rationale:** Ensures good user experience across devices. (P3)
- **Dependencies:** Phase 5 components.

- **Stories:**
    - [ ] **US701: Review and Refine Tailwind CSS for Overall Page Layout**
        - As an Engineer, I want to review all Tailwind CSS classes used for spacing, typography, and layout on the Patients page, ensuring consistency and adherence to design, so that the page is visually polished.
        - **Acceptance Criteria:**
            - Given the fully assembled Patients page, when reviewed, then the layout, spacing, and typography are consistent and meet the requirements.
    - [ ] **US702: Ensure Patient Data Table is Horizontally Scrollable on Small Screens**
        - As an Engineer, I want to ensure that if the Patient Data Table content exceeds the viewport width on smaller screens, it becomes horizontally scrollable, so that all data remains accessible.
        - **Acceptance Criteria:**
            - Given the Patients page is viewed on a small screen, when the table content is too wide, then a horizontal scrollbar appears for the table.

---

## Phase 8: Mock Data

### Epic: Populating Development Environment

- **Priority Rationale:** Essential for testing and development. (P1, can be done early)
- **Dependencies:** Phase 2 (Database Schema).

- **Stories:**
    - [ ] **US801: Create Script or Manually Add Mock Patient Data to Supabase**
        - As an Engineer, I want to populate the Supabase `patients` table with 15-20 mock records (using `@faker-js/faker` if a script is made, or manually) covering various statuses and data, so that the UI can be developed and tested with realistic data.
        - **Acceptance Criteria:**
            - Given the Supabase database, when queried, then at least 15 mock patient records are present in the `patients` table.

---

## Human Review Checkpoints

- **Stories:**
    - [ ] **HR001: Human Review - Initial Page Layout & Header Functionality**
        - As a Product Manager/Designer, I want to review the implemented Patients page header (title, refresh, add buttons, more options dropdown) and the overall page structure, so that I can provide feedback on usability and alignment with requirements before table development.
        - **Acceptance Criteria:**
            - Given the Patients page with header elements (US501-US506) implemented, when reviewed, then feedback on layout, button functionality (dialogs opening), and visual appeal is provided.
            - Development on table details (US520 onwards) pauses until feedback is addressed or acknowledged.
    - [ ] **HR002: Human Review - Core Table Functionality & Filters**
        - As a Product Manager/Designer, I want to review the Patient Data Table with basic data, sorting, searching, basic filtering, and row action dropdowns (edit/archive), so that I can validate core interactions and data presentation.
        - **Acceptance Criteria:**
            - Given the Patients page with core table (US520-US527, US510-US513) and pagination (US540-US542) implemented, when reviewed, then feedback on table usability, filter interaction, and action flows is provided.
            - Further refinement or work on less critical features pauses until feedback is addressed.

---

## Conceptual Roadmap Integration (Example Sprints)

This is a rough guide and can be adjusted based on team velocity and priorities.

**Sprint 1: Foundation & Backend Basics**
- All of Phase 0: Codebase Familiarization
- All of Phase 1: Project Setup & Dependencies
- All of Phase 2: Database Schema
- US301-US305 (API GET operations)
- US801 (Mock Data)
- US401-US402 (Sidebar Nav, Basic Page)

**Sprint 2: Core UI Structure & Patient Creation**
- US403-US404 (Detail Page Placeholder, Main Page Layout)
- US501-US504 (Page Header, Add New Patient Button/Dialog/Form/Action)
- US306-US307 (Server Actions file, `addPatient` action)
- US520-US522 (DataTable component, SWR fetch, Basic Columns)
- US529, US530 (Skeleton, Empty States)
- US540-US542 (Pagination, Item Count)
- HR001 (Human Review - Layout & Header)

**Sprint 3: Table Interactivity & Advanced Actions**
- US510-US513 (Search Input, Basic Filters)
- US523-US528 (Name Link, Sorting, Row Actions Menu, Edit/Archive, Placeholder Quick Actions)
- US308-US310 (Edit, Archive, UpdateStatus Server Actions)
- US601-US603 (State Mgt for Filters, Client Form Validation)
- HR002 (Human Review - Core Table & Filters)

**Sprint 4: Polish & Remaining Features**
- US505 (Quick Add Patient - if prioritized)
- US506 (Header More Options Dropdown)
- US604 (Column Visibility)
- All of Phase 7: Styling & Responsiveness
- Bug fixing and refinements based on Human Review feedback.

---
This list aims for one-story-point granularity. Actual story points might vary slightly based on team estimation.
