import { pgTable, text, serial, integer, boolean, uuid, timestamp, decimal, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["client", "lawyer", "paralegal"]);
export const questionStatusEnum = pgEnum("question_status", ["pending", "answered", "closed"]);
export const consultationTypeEnum = pgEnum("consultation_type", ["video", "phone", "in_person"]);
export const consultationStatusEnum = pgEnum("consultation_status", ["pending", "confirmed", "completed", "cancelled"]);
export const reportStatusEnum = pgEnum("report_status", ["pending", "under_review", "resolved", "closed"]);
export const reportPriorityEnum = pgEnum("report_priority", ["low", "medium", "high", "urgent"]);

// Tables
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  full_name: text("full_name").notNull(),
  role: userRoleEnum("role").notNull().default("client"),
  phone: text("phone"),
  location: text("location"),
  specialization: text("specialization"),
  bar_number: text("bar_number"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const legalQuestions = pgTable("legal_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  client_id: uuid("client_id").references(() => profiles.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  status: questionStatusEnum("status").default("pending").notNull(),
  answer: text("answer"),
  lawyer_id: uuid("lawyer_id").references(() => profiles.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const consultations = pgTable("consultations", {
  id: uuid("id").primaryKey().defaultRandom(),
  client_id: uuid("client_id").references(() => profiles.id).notNull(),
  lawyer_id: uuid("lawyer_id").references(() => profiles.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  consultation_type: consultationTypeEnum("consultation_type").notNull(),
  scheduled_date: timestamp("scheduled_date").notNull(),
  duration_minutes: integer("duration_minutes").default(30).notNull(),
  status: consultationStatusEnum("status").default("pending").notNull(),
  meeting_link: text("meeting_link"),
  location: text("location"),
  price: decimal("price", { precision: 10, scale: 2 }).default("0").notNull(),
  notes: text("notes"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const documentTemplates = pgTable("document_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  file_path: text("file_path").notNull(),
  file_size: integer("file_size"),
  file_type: text("file_type"),
  download_count: integer("download_count").default(0).notNull(),
  is_active: boolean("is_active").default(true).notNull(),
  created_by: uuid("created_by").references(() => profiles.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const userDocuments = pgTable("user_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => profiles.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  file_path: text("file_path").notNull(),
  file_size: integer("file_size"),
  file_type: text("file_type"),
  is_private: boolean("is_private").default(true).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const anonymousReports = pgTable("anonymous_reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location"),
  incident_date: date("incident_date"),
  status: reportStatusEnum("status").default("pending").notNull(),
  priority: reportPriorityEnum("priority").default("medium").notNull(),
  assigned_to: uuid("assigned_to").references(() => profiles.id),
  admin_notes: text("admin_notes"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const consultationReviews = pgTable("consultation_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  consultation_id: uuid("consultation_id").references(() => consultations.id).notNull(),
  client_id: uuid("client_id").references(() => profiles.id).notNull(),
  lawyer_id: uuid("lawyer_id").references(() => profiles.id).notNull(),
  rating: integer("rating").notNull(),
  review_text: text("review_text"),
  is_approved: boolean("is_approved").default(false).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertLegalQuestionSchema = createInsertSchema(legalQuestions).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertConsultationSchema = createInsertSchema(consultations).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertDocumentTemplateSchema = createInsertSchema(documentTemplates).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertUserDocumentSchema = createInsertSchema(userDocuments).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertAnonymousReportSchema = createInsertSchema(anonymousReports).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const insertConsultationReviewSchema = createInsertSchema(consultationReviews).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

// Type exports
export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type LegalQuestion = typeof legalQuestions.$inferSelect;
export type InsertLegalQuestion = z.infer<typeof insertLegalQuestionSchema>;
export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = z.infer<typeof insertConsultationSchema>;
export type DocumentTemplate = typeof documentTemplates.$inferSelect;
export type InsertDocumentTemplate = z.infer<typeof insertDocumentTemplateSchema>;
export type UserDocument = typeof userDocuments.$inferSelect;
export type InsertUserDocument = z.infer<typeof insertUserDocumentSchema>;
export type AnonymousReport = typeof anonymousReports.$inferSelect;
export type InsertAnonymousReport = z.infer<typeof insertAnonymousReportSchema>;
export type ConsultationReview = typeof consultationReviews.$inferSelect;
export type InsertConsultationReview = z.infer<typeof insertConsultationReviewSchema>;

export type UserRole = 'client' | 'lawyer' | 'paralegal';

// Legacy compatibility (keeping old simple user schema for now)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
