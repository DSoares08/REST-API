CREATE TABLE IF NOT EXISTS "api_keys" (
	"api_key" text PRIMARY KEY NOT NULL,
	"stripe_customer_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customers" (
	"stripe_customer_id" text PRIMARY KEY NOT NULL,
	"api_key" text NOT NULL,
	"active" boolean DEFAULT false,
	"item_id" text NOT NULL,
	"calls" integer DEFAULT 0
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_stripe_customer_id_customers_stripe_customer_id_fk" FOREIGN KEY ("stripe_customer_id") REFERENCES "public"."customers"("stripe_customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
