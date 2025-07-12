CREATE TABLE "angel_numbers" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"name" text NOT NULL,
	"meaning" text NOT NULL,
	"spiritual_meaning" text NOT NULL,
	"practical_guidance" text NOT NULL,
	"date_added" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "angel_numbers_number_unique" UNIQUE("number")
);
--> statement-breakpoint
CREATE TABLE "imported_cards" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"meanings" jsonb NOT NULL,
	"date_imported" timestamp DEFAULT now() NOT NULL,
	"image_url" text
);
--> statement-breakpoint
CREATE TABLE "journal_entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"cards" text[],
	"tags" text[] DEFAULT '{}' NOT NULL,
	"mood" text
);
--> statement-breakpoint
CREATE TABLE "learning_tracks" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"difficulty" text NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"required_cards" text[] NOT NULL,
	"achievements" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletters" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"week_start_date" date NOT NULL,
	"sent_at" timestamp DEFAULT now() NOT NULL,
	"recipient_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"track_id" integer NOT NULL,
	"score" integer NOT NULL,
	"total_questions" integer NOT NULL,
	"difficulty" text NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"cards" text[] NOT NULL,
	"incorrect_answers" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "readings" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"cards" text[] NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"spread_type" text,
	"mood" text
);
--> statement-breakpoint
CREATE TABLE "study_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"card_id" text NOT NULL,
	"last_reviewed" timestamp DEFAULT now() NOT NULL,
	"confidence_level" integer DEFAULT 0 NOT NULL,
	"next_review_due" timestamp NOT NULL,
	"correct_streak" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"track_id" integer NOT NULL,
	"completed_lessons" text[] DEFAULT '{}' NOT NULL,
	"achievements" text[] DEFAULT '{}' NOT NULL,
	"current_lesson" integer DEFAULT 1 NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"last_active" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"is_subscribed" boolean DEFAULT false NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"stripe_customer_id" text DEFAULT '',
	"stripe_subscription_id" text DEFAULT '',
	"newsletter_subscribed" boolean DEFAULT true NOT NULL,
	"unsubscribe_token" text,
	"has_used_free_trial" boolean DEFAULT false NOT NULL,
	"password_reset_token" text,
	"password_reset_expires" timestamp,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "voices" (
	"id" serial PRIMARY KEY NOT NULL,
	"voice_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" text DEFAULT 'cloned' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "voices_voice_id_unique" UNIQUE("voice_id")
);
