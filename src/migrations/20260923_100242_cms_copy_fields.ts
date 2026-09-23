import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "settings_nav_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT '' NOT NULL,
  	"href" varchar DEFAULT '' NOT NULL
  );
  
  CREATE TABLE "settings_service_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT '' NOT NULL,
  	"href" varchar DEFAULT '' NOT NULL
  );
  
  CREATE TABLE "settings_footer_service_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT '' NOT NULL,
  	"href" varchar DEFAULT '' NOT NULL
  );
  
  CREATE TABLE "settings_policy_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT '' NOT NULL,
  	"href" varchar DEFAULT '' NOT NULL
  );
  
  ALTER TABLE "landing" ALTER COLUMN "hero_learn_more_label" SET DEFAULT 'Explore our expertise';
  ALTER TABLE "landing_services_items" ADD COLUMN "icon_id" integer;
  ALTER TABLE "landing" ADD COLUMN "hero_welcome_label" varchar DEFAULT 'Welcome to IT Usaha Engineering' NOT NULL;
  ALTER TABLE "landing" ADD COLUMN "hero_commission_label" varchar DEFAULT 'COMMISSION' NOT NULL;
  ALTER TABLE "landing" ADD COLUMN "who_we_are_eyebrow" varchar DEFAULT 'Built on expertise. Driven by trust.' NOT NULL;
  ALTER TABLE "landing" ADD COLUMN "who_we_are_model_caption_title" varchar DEFAULT 'DATA CENTRE' NOT NULL;
  ALTER TABLE "landing" ADD COLUMN "who_we_are_model_caption_subtitle" varchar DEFAULT 'Structure / Systems' NOT NULL;
  ALTER TABLE "landing" ADD COLUMN "facts_eyebrow" varchar DEFAULT 'A track record that delivers' NOT NULL;
  ALTER TABLE "landing" ADD COLUMN "services_eyebrow" varchar DEFAULT 'Expertise, connected.' NOT NULL;
  ALTER TABLE "landing" ADD COLUMN "services_placeholder_label" varchar DEFAULT 'Service imagery coming soon' NOT NULL;
  ALTER TABLE "landing" ADD COLUMN "why_us_eyebrow" varchar DEFAULT 'Confidence at every stage' NOT NULL;
  ALTER TABLE "landing" ADD COLUMN "certs_eyebrow" varchar DEFAULT 'Quality without compromise' NOT NULL;
  ALTER TABLE "landing" ADD COLUMN "certs_slide_eyebrow" varchar DEFAULT 'Industry standards' NOT NULL;
  ALTER TABLE "landing" ADD COLUMN "certs_placeholder_label" varchar DEFAULT 'Certificate image coming soon' NOT NULL;
  ALTER TABLE "landing" ADD COLUMN "clients_eyebrow" varchar DEFAULT 'Partnerships built to last' NOT NULL;
  ALTER TABLE "landing" ADD COLUMN "clients_placeholder_label" varchar DEFAULT 'Client logo coming soon' NOT NULL;
  ALTER TABLE "landing" ADD COLUMN "projects_eyebrow" varchar DEFAULT 'Precision, put into practice' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "site_name" varchar DEFAULT 'IT Usaha Engineering' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "legal_name" varchar DEFAULT 'IT Usaha Engineering Sdn. Bhd. (432550-U)' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "logo_id" integer;
  ALTER TABLE "settings" ADD COLUMN "wordmark_top" varchar DEFAULT 'IT USAHA' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "wordmark_bottom" varchar DEFAULT 'ENGINEERING' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "seo_title" varchar DEFAULT 'IT Usaha Engineering' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "seo_description" varchar DEFAULT 'IT Usaha Engineering Sdn. Bhd. — your trusted partner in Data Centre and Mechanical & Electrical (M&E) infrastructure across Malaysia.' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "og_image_id" integer;
  ALTER TABLE "settings" ADD COLUMN "services_menu_label" varchar DEFAULT 'Our Services' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "contact_cta_label" varchar DEFAULT 'Contact Us' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "contact_cta_href" varchar DEFAULT '/contact-us' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "footer_tagline" varchar DEFAULT 'Engineering trust.
  Since 1997.' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "footer_nav_heading" varchar DEFAULT 'Navigation Link' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "footer_services_heading" varchar DEFAULT 'Our Services' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "footer_policies_heading" varchar DEFAULT 'Company Policies' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "footer_contact_heading" varchar DEFAULT 'Get in Touch' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "copyright" varchar DEFAULT 'Copyright © {year} IT Usaha Engineering Sdn. Bhd. (432550-U) | All rights reserved.' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "disclaimer" varchar DEFAULT 'Disclaimer: Some images on this website are sourced from Freepik, Unsplash & Flaticon. We strive to adhere to mentioned resource''s terms of use and provide proper attribution. If there are any concerns about the usage of these images, please contact us directly. We appreciate the contributions of mentioned resources.' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "legal_eyebrow" varchar DEFAULT 'Company policies' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "legal_on_this_page" varchar DEFAULT 'On this page' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "legal_contact_line" varchar DEFAULT 'Questions about these pages?' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "hero_banner_kicker" varchar DEFAULT 'ITU' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "hero_banner_wordmark" varchar DEFAULT 'IT USAHA ENGINEERING' NOT NULL;
  ALTER TABLE "settings" ADD COLUMN "carousel_empty_label" varchar DEFAULT 'Content will be added soon.' NOT NULL;
  ALTER TABLE "about_us" ADD COLUMN "hero_eyebrow" varchar DEFAULT 'About IT Usaha' NOT NULL;
  ALTER TABLE "about_us" ADD COLUMN "banner_label" varchar DEFAULT 'About Us' NOT NULL;
  ALTER TABLE "about_us" ADD COLUMN "vision_eyebrow" varchar DEFAULT '01 / Vision' NOT NULL;
  ALTER TABLE "about_us" ADD COLUMN "vision_heading" varchar DEFAULT 'Our Vision' NOT NULL;
  ALTER TABLE "about_us" ADD COLUMN "mission_eyebrow" varchar DEFAULT '02 / Mission' NOT NULL;
  ALTER TABLE "about_us" ADD COLUMN "mission_heading" varchar DEFAULT 'Our Mission' NOT NULL;
  ALTER TABLE "about_us" ADD COLUMN "leadership_eyebrow" varchar DEFAULT 'People' NOT NULL;
  ALTER TABLE "about_us" ADD COLUMN "milestones_eyebrow" varchar DEFAULT 'Our journey' NOT NULL;
  ALTER TABLE "contact_us" ADD COLUMN "hero_eyebrow" varchar DEFAULT 'Get in touch' NOT NULL;
  ALTER TABLE "contact_us" ADD COLUMN "banner_label" varchar DEFAULT 'Contact Us' NOT NULL;
  ALTER TABLE "contact_us" ADD COLUMN "office_eyebrow" varchar DEFAULT 'Our office' NOT NULL;
  ALTER TABLE "contact_us" ADD COLUMN "form_eyebrow" varchar DEFAULT 'Start a conversation' NOT NULL;
  ALTER TABLE "contact_us" ADD COLUMN "form_name_label" varchar DEFAULT 'Name' NOT NULL;
  ALTER TABLE "contact_us" ADD COLUMN "form_email_label" varchar DEFAULT 'Email Address' NOT NULL;
  ALTER TABLE "contact_us" ADD COLUMN "form_phone_label" varchar DEFAULT 'Contact No.' NOT NULL;
  ALTER TABLE "contact_us" ADD COLUMN "form_company_name_label" varchar DEFAULT 'Company Name' NOT NULL;
  ALTER TABLE "contact_us" ADD COLUMN "form_company_address_label" varchar DEFAULT 'Company Address' NOT NULL;
  ALTER TABLE "contact_us" ADD COLUMN "form_message_label" varchar DEFAULT 'Message' NOT NULL;
  ALTER TABLE "contact_us" ADD COLUMN "form_privacy_line" varchar DEFAULT 'Your details are handled according to our' NOT NULL;
  ALTER TABLE "contact_us" ADD COLUMN "form_success_message" varchar DEFAULT 'Thank you. Your enquiry has been received.' NOT NULL;
  ALTER TABLE "contact_us" ADD COLUMN "form_error_fallback" varchar DEFAULT 'Your message could not be sent. Please try again.' NOT NULL;
  ALTER TABLE "contact_us" ADD COLUMN "form_submit_label" varchar DEFAULT 'Submit Now' NOT NULL;
  ALTER TABLE "contact_us" ADD COLUMN "form_submitting_label" varchar DEFAULT 'Submitting…' NOT NULL;
  ALTER TABLE "events_page" ADD COLUMN "eyebrow" varchar DEFAULT 'Events' NOT NULL;
  ALTER TABLE "events_page" ADD COLUMN "banner_label" varchar DEFAULT 'Events' NOT NULL;
  ALTER TABLE "events_page" ADD COLUMN "empty_title" varchar DEFAULT 'More events in this category are on the way' NOT NULL;
  ALTER TABLE "events_page" ADD COLUMN "empty_meta" varchar DEFAULT 'Coming soon' NOT NULL;
  ALTER TABLE "events_page" ADD COLUMN "view_label" varchar DEFAULT 'View Event' NOT NULL;
  ALTER TABLE "projects_page" ADD COLUMN "eyebrow" varchar DEFAULT 'Projects' NOT NULL;
  ALTER TABLE "projects_page" ADD COLUMN "banner_label" varchar DEFAULT 'Projects' NOT NULL;
  ALTER TABLE "projects_page" ADD COLUMN "empty_title" varchar DEFAULT 'More projects in this status are on the way' NOT NULL;
  ALTER TABLE "projects_page" ADD COLUMN "empty_meta" varchar DEFAULT 'Coming soon' NOT NULL;
  ALTER TABLE "projects_page" ADD COLUMN "details_label" varchar DEFAULT 'Project Details' NOT NULL;
  ALTER TABLE "projects_page" ADD COLUMN "completed_label" varchar DEFAULT 'Completed' NOT NULL;
  ALTER TABLE "projects_page" ADD COLUMN "ongoing_label" varchar DEFAULT 'Ongoing' NOT NULL;
  ALTER TABLE "projects_page" ADD COLUMN "client_label" varchar DEFAULT 'Client' NOT NULL;
  ALTER TABLE "projects_page" ADD COLUMN "consultant_label" varchar DEFAULT 'Data Center Consultant' NOT NULL;
  ALTER TABLE "projects_page" ADD COLUMN "consultants_label" varchar DEFAULT 'Data Center Consultants' NOT NULL;
  ALTER TABLE "projects_page" ADD COLUMN "scope_label" varchar DEFAULT 'Scope of Works' NOT NULL;
  ALTER TABLE "projects_page" ADD COLUMN "commencement_label" varchar DEFAULT 'Commencement Date' NOT NULL;
  ALTER TABLE "projects_page" ADD COLUMN "completion_label" varchar DEFAULT 'Completion Date' NOT NULL;
  ALTER TABLE "projects_page" ADD COLUMN "present_label" varchar DEFAULT 'Present' NOT NULL;
  ALTER TABLE "projects_page" ADD COLUMN "detail_cta_heading" varchar DEFAULT 'Have a project in mind? We’re here to help you plan, build, and maintain it with confidence' NOT NULL;
  ALTER TABLE "projects_page" ADD COLUMN "detail_cta_cta_label" varchar DEFAULT 'Contact Us' NOT NULL;
  ALTER TABLE "projects_page" ADD COLUMN "detail_cta_cta_href" varchar DEFAULT '/contact-us' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "eyebrow" varchar DEFAULT 'Career' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "banner_label" varchar DEFAULT 'Career' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "positions_heading" varchar DEFAULT 'Available Positions' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_name_label" varchar DEFAULT 'Name' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_email_label" varchar DEFAULT 'Email Address' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_phone_label" varchar DEFAULT 'Contact No.' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_vacancy_label" varchar DEFAULT 'Position Applying For' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_select_placeholder" varchar DEFAULT 'Select a position' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_introduction_label" varchar DEFAULT 'Brief Introduction' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_resume_label" varchar DEFAULT 'Upload Résumé (PDF, up to 5MB)' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_closed_label" varchar DEFAULT 'Closed' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_apply_button_label" varchar DEFAULT 'Apply for this position' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_no_openings_message" varchar DEFAULT 'There are no open positions right now. Please check back soon.' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_privacy_line" varchar DEFAULT 'Your details are handled according to our' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_success_message" varchar DEFAULT 'Thank you. Your application has been received.' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_error_fallback" varchar DEFAULT 'Your application could not be sent. Please try again.' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_submit_label" varchar DEFAULT 'Submit Now' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_submitting_label" varchar DEFAULT 'Submitting…' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_name_required" varchar DEFAULT 'Enter your name.' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_email_invalid" varchar DEFAULT 'Enter a valid email address.' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_phone_required" varchar DEFAULT 'Enter a contact number.' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_vacancy_required" varchar DEFAULT 'Select a position.' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_introduction_required" varchar DEFAULT 'Tell us a little about yourself.' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_resume_required" varchar DEFAULT 'Attach your résumé.' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_resume_must_be_pdf" varchar DEFAULT 'Résumé must be a PDF.' NOT NULL;
  ALTER TABLE "career_page" ADD COLUMN "form_resume_too_large" varchar DEFAULT 'Résumé must be under 5MB.' NOT NULL;
  ALTER TABLE "service_data_centre" ADD COLUMN "eyebrow" varchar DEFAULT 'Our Services' NOT NULL;
  ALTER TABLE "service_data_centre" ADD COLUMN "banner_label" varchar DEFAULT 'Data Centre & Critical System' NOT NULL;
  ALTER TABLE "service_data_centre" ADD COLUMN "equipment_placeholder_caption" varchar DEFAULT 'Equipment details coming soon' NOT NULL;
  ALTER TABLE "service_high_tension" ADD COLUMN "eyebrow" varchar DEFAULT 'Our Services' NOT NULL;
  ALTER TABLE "service_high_tension" ADD COLUMN "banner_label" varchar DEFAULT 'High Tension & Electrical Services' NOT NULL;
  ALTER TABLE "service_project_management" ADD COLUMN "eyebrow" varchar DEFAULT 'Our Services' NOT NULL;
  ALTER TABLE "service_project_management" ADD COLUMN "banner_label" varchar DEFAULT 'Project Management' NOT NULL;
  ALTER TABLE "service_project_management" ADD COLUMN "why_heading" varchar DEFAULT 'Why Choose Us?' NOT NULL;
  ALTER TABLE "service_facilities_management" ADD COLUMN "eyebrow" varchar DEFAULT 'Our Services' NOT NULL;
  ALTER TABLE "service_facilities_management" ADD COLUMN "banner_label" varchar DEFAULT 'Facilities Management' NOT NULL;
  ALTER TABLE "service_dfma" ADD COLUMN "eyebrow" varchar DEFAULT 'Our Services' NOT NULL;
  ALTER TABLE "service_dfma" ADD COLUMN "banner_label" varchar DEFAULT 'DFMA' NOT NULL;
  ALTER TABLE "service_dfma" ADD COLUMN "why_heading" varchar DEFAULT 'Why Choose Us?' NOT NULL;
  ALTER TABLE "settings_nav_links" ADD CONSTRAINT "settings_nav_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_service_links" ADD CONSTRAINT "settings_service_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_footer_service_links" ADD CONSTRAINT "settings_footer_service_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "settings_policy_links" ADD CONSTRAINT "settings_policy_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "settings_nav_links_order_idx" ON "settings_nav_links" USING btree ("_order");
  CREATE INDEX "settings_nav_links_parent_id_idx" ON "settings_nav_links" USING btree ("_parent_id");
  CREATE INDEX "settings_service_links_order_idx" ON "settings_service_links" USING btree ("_order");
  CREATE INDEX "settings_service_links_parent_id_idx" ON "settings_service_links" USING btree ("_parent_id");
  CREATE INDEX "settings_footer_service_links_order_idx" ON "settings_footer_service_links" USING btree ("_order");
  CREATE INDEX "settings_footer_service_links_parent_id_idx" ON "settings_footer_service_links" USING btree ("_parent_id");
  CREATE INDEX "settings_policy_links_order_idx" ON "settings_policy_links" USING btree ("_order");
  CREATE INDEX "settings_policy_links_parent_id_idx" ON "settings_policy_links" USING btree ("_parent_id");
  ALTER TABLE "landing_services_items" ADD CONSTRAINT "landing_services_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "settings" ADD CONSTRAINT "settings_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "landing_services_items_icon_idx" ON "landing_services_items" USING btree ("icon_id");
  CREATE INDEX "settings_logo_idx" ON "settings" USING btree ("logo_id");
  CREATE INDEX "settings_og_image_idx" ON "settings" USING btree ("og_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "settings_nav_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_service_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_footer_service_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "settings_policy_links" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "settings_nav_links" CASCADE;
  DROP TABLE "settings_service_links" CASCADE;
  DROP TABLE "settings_footer_service_links" CASCADE;
  DROP TABLE "settings_policy_links" CASCADE;
  ALTER TABLE "landing_services_items" DROP CONSTRAINT "landing_services_items_icon_id_media_id_fk";
  
  ALTER TABLE "settings" DROP CONSTRAINT "settings_logo_id_media_id_fk";
  
  ALTER TABLE "settings" DROP CONSTRAINT "settings_og_image_id_media_id_fk";
  
  DROP INDEX "landing_services_items_icon_idx";
  DROP INDEX "settings_logo_idx";
  DROP INDEX "settings_og_image_idx";
  ALTER TABLE "landing" ALTER COLUMN "hero_learn_more_label" SET DEFAULT 'Continue';
  ALTER TABLE "landing_services_items" DROP COLUMN "icon_id";
  ALTER TABLE "landing" DROP COLUMN "hero_welcome_label";
  ALTER TABLE "landing" DROP COLUMN "hero_commission_label";
  ALTER TABLE "landing" DROP COLUMN "who_we_are_eyebrow";
  ALTER TABLE "landing" DROP COLUMN "who_we_are_model_caption_title";
  ALTER TABLE "landing" DROP COLUMN "who_we_are_model_caption_subtitle";
  ALTER TABLE "landing" DROP COLUMN "facts_eyebrow";
  ALTER TABLE "landing" DROP COLUMN "services_eyebrow";
  ALTER TABLE "landing" DROP COLUMN "services_placeholder_label";
  ALTER TABLE "landing" DROP COLUMN "why_us_eyebrow";
  ALTER TABLE "landing" DROP COLUMN "certs_eyebrow";
  ALTER TABLE "landing" DROP COLUMN "certs_slide_eyebrow";
  ALTER TABLE "landing" DROP COLUMN "certs_placeholder_label";
  ALTER TABLE "landing" DROP COLUMN "clients_eyebrow";
  ALTER TABLE "landing" DROP COLUMN "clients_placeholder_label";
  ALTER TABLE "landing" DROP COLUMN "projects_eyebrow";
  ALTER TABLE "settings" DROP COLUMN "site_name";
  ALTER TABLE "settings" DROP COLUMN "legal_name";
  ALTER TABLE "settings" DROP COLUMN "logo_id";
  ALTER TABLE "settings" DROP COLUMN "wordmark_top";
  ALTER TABLE "settings" DROP COLUMN "wordmark_bottom";
  ALTER TABLE "settings" DROP COLUMN "seo_title";
  ALTER TABLE "settings" DROP COLUMN "seo_description";
  ALTER TABLE "settings" DROP COLUMN "og_image_id";
  ALTER TABLE "settings" DROP COLUMN "services_menu_label";
  ALTER TABLE "settings" DROP COLUMN "contact_cta_label";
  ALTER TABLE "settings" DROP COLUMN "contact_cta_href";
  ALTER TABLE "settings" DROP COLUMN "footer_tagline";
  ALTER TABLE "settings" DROP COLUMN "footer_nav_heading";
  ALTER TABLE "settings" DROP COLUMN "footer_services_heading";
  ALTER TABLE "settings" DROP COLUMN "footer_policies_heading";
  ALTER TABLE "settings" DROP COLUMN "footer_contact_heading";
  ALTER TABLE "settings" DROP COLUMN "copyright";
  ALTER TABLE "settings" DROP COLUMN "disclaimer";
  ALTER TABLE "settings" DROP COLUMN "legal_eyebrow";
  ALTER TABLE "settings" DROP COLUMN "legal_on_this_page";
  ALTER TABLE "settings" DROP COLUMN "legal_contact_line";
  ALTER TABLE "settings" DROP COLUMN "hero_banner_kicker";
  ALTER TABLE "settings" DROP COLUMN "hero_banner_wordmark";
  ALTER TABLE "settings" DROP COLUMN "carousel_empty_label";
  ALTER TABLE "about_us" DROP COLUMN "hero_eyebrow";
  ALTER TABLE "about_us" DROP COLUMN "banner_label";
  ALTER TABLE "about_us" DROP COLUMN "vision_eyebrow";
  ALTER TABLE "about_us" DROP COLUMN "vision_heading";
  ALTER TABLE "about_us" DROP COLUMN "mission_eyebrow";
  ALTER TABLE "about_us" DROP COLUMN "mission_heading";
  ALTER TABLE "about_us" DROP COLUMN "leadership_eyebrow";
  ALTER TABLE "about_us" DROP COLUMN "milestones_eyebrow";
  ALTER TABLE "contact_us" DROP COLUMN "hero_eyebrow";
  ALTER TABLE "contact_us" DROP COLUMN "banner_label";
  ALTER TABLE "contact_us" DROP COLUMN "office_eyebrow";
  ALTER TABLE "contact_us" DROP COLUMN "form_eyebrow";
  ALTER TABLE "contact_us" DROP COLUMN "form_name_label";
  ALTER TABLE "contact_us" DROP COLUMN "form_email_label";
  ALTER TABLE "contact_us" DROP COLUMN "form_phone_label";
  ALTER TABLE "contact_us" DROP COLUMN "form_company_name_label";
  ALTER TABLE "contact_us" DROP COLUMN "form_company_address_label";
  ALTER TABLE "contact_us" DROP COLUMN "form_message_label";
  ALTER TABLE "contact_us" DROP COLUMN "form_privacy_line";
  ALTER TABLE "contact_us" DROP COLUMN "form_success_message";
  ALTER TABLE "contact_us" DROP COLUMN "form_error_fallback";
  ALTER TABLE "contact_us" DROP COLUMN "form_submit_label";
  ALTER TABLE "contact_us" DROP COLUMN "form_submitting_label";
  ALTER TABLE "events_page" DROP COLUMN "eyebrow";
  ALTER TABLE "events_page" DROP COLUMN "banner_label";
  ALTER TABLE "events_page" DROP COLUMN "empty_title";
  ALTER TABLE "events_page" DROP COLUMN "empty_meta";
  ALTER TABLE "events_page" DROP COLUMN "view_label";
  ALTER TABLE "projects_page" DROP COLUMN "eyebrow";
  ALTER TABLE "projects_page" DROP COLUMN "banner_label";
  ALTER TABLE "projects_page" DROP COLUMN "empty_title";
  ALTER TABLE "projects_page" DROP COLUMN "empty_meta";
  ALTER TABLE "projects_page" DROP COLUMN "details_label";
  ALTER TABLE "projects_page" DROP COLUMN "completed_label";
  ALTER TABLE "projects_page" DROP COLUMN "ongoing_label";
  ALTER TABLE "projects_page" DROP COLUMN "client_label";
  ALTER TABLE "projects_page" DROP COLUMN "consultant_label";
  ALTER TABLE "projects_page" DROP COLUMN "consultants_label";
  ALTER TABLE "projects_page" DROP COLUMN "scope_label";
  ALTER TABLE "projects_page" DROP COLUMN "commencement_label";
  ALTER TABLE "projects_page" DROP COLUMN "completion_label";
  ALTER TABLE "projects_page" DROP COLUMN "present_label";
  ALTER TABLE "projects_page" DROP COLUMN "detail_cta_heading";
  ALTER TABLE "projects_page" DROP COLUMN "detail_cta_cta_label";
  ALTER TABLE "projects_page" DROP COLUMN "detail_cta_cta_href";
  ALTER TABLE "career_page" DROP COLUMN "eyebrow";
  ALTER TABLE "career_page" DROP COLUMN "banner_label";
  ALTER TABLE "career_page" DROP COLUMN "positions_heading";
  ALTER TABLE "career_page" DROP COLUMN "form_name_label";
  ALTER TABLE "career_page" DROP COLUMN "form_email_label";
  ALTER TABLE "career_page" DROP COLUMN "form_phone_label";
  ALTER TABLE "career_page" DROP COLUMN "form_vacancy_label";
  ALTER TABLE "career_page" DROP COLUMN "form_select_placeholder";
  ALTER TABLE "career_page" DROP COLUMN "form_introduction_label";
  ALTER TABLE "career_page" DROP COLUMN "form_resume_label";
  ALTER TABLE "career_page" DROP COLUMN "form_closed_label";
  ALTER TABLE "career_page" DROP COLUMN "form_apply_button_label";
  ALTER TABLE "career_page" DROP COLUMN "form_no_openings_message";
  ALTER TABLE "career_page" DROP COLUMN "form_privacy_line";
  ALTER TABLE "career_page" DROP COLUMN "form_success_message";
  ALTER TABLE "career_page" DROP COLUMN "form_error_fallback";
  ALTER TABLE "career_page" DROP COLUMN "form_submit_label";
  ALTER TABLE "career_page" DROP COLUMN "form_submitting_label";
  ALTER TABLE "career_page" DROP COLUMN "form_name_required";
  ALTER TABLE "career_page" DROP COLUMN "form_email_invalid";
  ALTER TABLE "career_page" DROP COLUMN "form_phone_required";
  ALTER TABLE "career_page" DROP COLUMN "form_vacancy_required";
  ALTER TABLE "career_page" DROP COLUMN "form_introduction_required";
  ALTER TABLE "career_page" DROP COLUMN "form_resume_required";
  ALTER TABLE "career_page" DROP COLUMN "form_resume_must_be_pdf";
  ALTER TABLE "career_page" DROP COLUMN "form_resume_too_large";
  ALTER TABLE "service_data_centre" DROP COLUMN "eyebrow";
  ALTER TABLE "service_data_centre" DROP COLUMN "banner_label";
  ALTER TABLE "service_data_centre" DROP COLUMN "equipment_placeholder_caption";
  ALTER TABLE "service_high_tension" DROP COLUMN "eyebrow";
  ALTER TABLE "service_high_tension" DROP COLUMN "banner_label";
  ALTER TABLE "service_project_management" DROP COLUMN "eyebrow";
  ALTER TABLE "service_project_management" DROP COLUMN "banner_label";
  ALTER TABLE "service_project_management" DROP COLUMN "why_heading";
  ALTER TABLE "service_facilities_management" DROP COLUMN "eyebrow";
  ALTER TABLE "service_facilities_management" DROP COLUMN "banner_label";
  ALTER TABLE "service_dfma" DROP COLUMN "eyebrow";
  ALTER TABLE "service_dfma" DROP COLUMN "banner_label";
  ALTER TABLE "service_dfma" DROP COLUMN "why_heading";`)
}
