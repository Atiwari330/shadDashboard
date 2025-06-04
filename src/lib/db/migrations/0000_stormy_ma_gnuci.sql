CREATE TABLE "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"patient_id_internal" text,
	"assigned_staff_id" text,
	"status" text NOT NULL,
	"last_interaction_date" timestamp,
	"next_appointment_date" timestamp,
	"insurance_status" text,
	"intake_date" timestamp NOT NULL,
	"date_of_birth" timestamp,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
