import { db } from "./db";
import { 
  profiles, legalQuestions, consultations, documentTemplates, 
  userDocuments, anonymousReports, consultationReviews,
  type Profile, type InsertProfile, type LegalQuestion, type InsertLegalQuestion,
  type Consultation, type InsertConsultation, type DocumentTemplate, type InsertDocumentTemplate,
  type UserDocument, type InsertUserDocument, type AnonymousReport, type InsertAnonymousReport,
  type ConsultationReview, type InsertConsultationReview, users, type User, type InsertUser
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // Legacy user methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile methods
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  getLawyers(): Promise<Profile[]>;
  
  // Legal Questions methods
  createLegalQuestion(question: InsertLegalQuestion): Promise<LegalQuestion>;
  getLegalQuestionsByClient(clientId: string): Promise<LegalQuestion[]>;
  getPendingLegalQuestions(): Promise<LegalQuestion[]>;
  updateLegalQuestion(id: string, question: Partial<InsertLegalQuestion>): Promise<LegalQuestion | undefined>;
  
  // Consultations methods
  createConsultation(consultation: InsertConsultation): Promise<Consultation>;
  getConsultationsByClient(clientId: string): Promise<Consultation[]>;
  getConsultationsByLawyer(lawyerId: string): Promise<Consultation[]>;
  updateConsultation(id: string, consultation: Partial<InsertConsultation>): Promise<Consultation | undefined>;
  
  // Document Templates methods
  getDocumentTemplates(): Promise<DocumentTemplate[]>;
  createDocumentTemplate(template: InsertDocumentTemplate): Promise<DocumentTemplate>;
  updateDocumentTemplate(id: string, template: Partial<InsertDocumentTemplate>): Promise<DocumentTemplate | undefined>;
  
  // User Documents methods
  getUserDocuments(userId: string): Promise<UserDocument[]>;
  createUserDocument(document: InsertUserDocument): Promise<UserDocument>;
  updateUserDocument(id: string, document: Partial<InsertUserDocument>): Promise<UserDocument | undefined>;
  deleteUserDocument(id: string): Promise<boolean>;
  
  // Anonymous Reports methods
  createAnonymousReport(report: InsertAnonymousReport): Promise<AnonymousReport>;
  getAnonymousReports(): Promise<AnonymousReport[]>;
  updateAnonymousReport(id: string, report: Partial<InsertAnonymousReport>): Promise<AnonymousReport | undefined>;
  
  // Consultation Reviews methods
  createConsultationReview(review: InsertConsultationReview): Promise<ConsultationReview>;
  getReviewsByLawyer(lawyerId: string): Promise<ConsultationReview[]>;
  getApprovedReviews(): Promise<ConsultationReview[]>;
  updateConsultationReview(id: string, review: Partial<InsertConsultationReview>): Promise<ConsultationReview | undefined>;
}

export class DatabaseStorage implements IStorage {
  // Legacy user methods for backward compatibility
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Profile methods
  async getProfile(id: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
    return result[0];
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const result = await db.select().from(profiles).where(eq(profiles.email, email)).limit(1);
    return result[0];
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const result = await db.insert(profiles).values(profile).returning();
    return result[0];
  }

  async updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined> {
    const result = await db.update(profiles)
      .set({ ...profile, updated_at: new Date() })
      .where(eq(profiles.id, id))
      .returning();
    return result[0];
  }

  async getLawyers(): Promise<Profile[]> {
    return await db.select().from(profiles).where(eq(profiles.role, "lawyer"));
  }

  // Legal Questions methods
  async createLegalQuestion(question: InsertLegalQuestion): Promise<LegalQuestion> {
    const result = await db.insert(legalQuestions).values(question).returning();
    return result[0];
  }

  async getLegalQuestionsByClient(clientId: string): Promise<LegalQuestion[]> {
    return await db.select().from(legalQuestions)
      .where(eq(legalQuestions.client_id, clientId))
      .orderBy(desc(legalQuestions.created_at));
  }

  async getPendingLegalQuestions(): Promise<LegalQuestion[]> {
    return await db.select().from(legalQuestions)
      .where(eq(legalQuestions.status, "pending"))
      .orderBy(desc(legalQuestions.created_at));
  }

  async updateLegalQuestion(id: string, question: Partial<InsertLegalQuestion>): Promise<LegalQuestion | undefined> {
    const result = await db.update(legalQuestions)
      .set({ ...question, updated_at: new Date() })
      .where(eq(legalQuestions.id, id))
      .returning();
    return result[0];
  }

  // Consultations methods
  async createConsultation(consultation: InsertConsultation): Promise<Consultation> {
    const result = await db.insert(consultations).values(consultation).returning();
    return result[0];
  }

  async getConsultationsByClient(clientId: string): Promise<Consultation[]> {
    return await db.select().from(consultations)
      .where(eq(consultations.client_id, clientId))
      .orderBy(desc(consultations.created_at));
  }

  async getConsultationsByLawyer(lawyerId: string): Promise<Consultation[]> {
    return await db.select().from(consultations)
      .where(eq(consultations.lawyer_id, lawyerId))
      .orderBy(desc(consultations.scheduled_date));
  }

  async updateConsultation(id: string, consultation: Partial<InsertConsultation>): Promise<Consultation | undefined> {
    const result = await db.update(consultations)
      .set({ ...consultation, updated_at: new Date() })
      .where(eq(consultations.id, id))
      .returning();
    return result[0];
  }

  // Document Templates methods
  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    return await db.select().from(documentTemplates)
      .where(eq(documentTemplates.is_active, true))
      .orderBy(desc(documentTemplates.created_at));
  }

  async createDocumentTemplate(template: InsertDocumentTemplate): Promise<DocumentTemplate> {
    const result = await db.insert(documentTemplates).values(template).returning();
    return result[0];
  }

  async updateDocumentTemplate(id: string, template: Partial<InsertDocumentTemplate>): Promise<DocumentTemplate | undefined> {
    const result = await db.update(documentTemplates)
      .set({ ...template, updated_at: new Date() })
      .where(eq(documentTemplates.id, id))
      .returning();
    return result[0];
  }

  // User Documents methods
  async getUserDocuments(userId: string): Promise<UserDocument[]> {
    return await db.select().from(userDocuments)
      .where(eq(userDocuments.user_id, userId))
      .orderBy(desc(userDocuments.created_at));
  }

  async createUserDocument(document: InsertUserDocument): Promise<UserDocument> {
    const result = await db.insert(userDocuments).values(document).returning();
    return result[0];
  }

  async updateUserDocument(id: string, document: Partial<InsertUserDocument>): Promise<UserDocument | undefined> {
    const result = await db.update(userDocuments)
      .set({ ...document, updated_at: new Date() })
      .where(eq(userDocuments.id, id))
      .returning();
    return result[0];
  }

  async deleteUserDocument(id: string): Promise<boolean> {
    const result = await db.delete(userDocuments).where(eq(userDocuments.id, id)).returning();
    return result.length > 0;
  }

  // Anonymous Reports methods
  async createAnonymousReport(report: InsertAnonymousReport): Promise<AnonymousReport> {
    const result = await db.insert(anonymousReports).values(report).returning();
    return result[0];
  }

  async getAnonymousReports(): Promise<AnonymousReport[]> {
    return await db.select().from(anonymousReports)
      .orderBy(desc(anonymousReports.created_at));
  }

  async updateAnonymousReport(id: string, report: Partial<InsertAnonymousReport>): Promise<AnonymousReport | undefined> {
    const result = await db.update(anonymousReports)
      .set({ ...report, updated_at: new Date() })
      .where(eq(anonymousReports.id, id))
      .returning();
    return result[0];
  }

  // Consultation Reviews methods
  async createConsultationReview(review: InsertConsultationReview): Promise<ConsultationReview> {
    const result = await db.insert(consultationReviews).values(review).returning();
    return result[0];
  }

  async getReviewsByLawyer(lawyerId: string): Promise<ConsultationReview[]> {
    return await db.select().from(consultationReviews)
      .where(and(eq(consultationReviews.lawyer_id, lawyerId), eq(consultationReviews.is_approved, true)))
      .orderBy(desc(consultationReviews.created_at));
  }

  async getApprovedReviews(): Promise<ConsultationReview[]> {
    return await db.select().from(consultationReviews)
      .where(eq(consultationReviews.is_approved, true))
      .orderBy(desc(consultationReviews.created_at));
  }

  async updateConsultationReview(id: string, review: Partial<InsertConsultationReview>): Promise<ConsultationReview | undefined> {
    const result = await db.update(consultationReviews)
      .set({ ...review, updated_at: new Date() })
      .where(eq(consultationReviews.id, id))
      .returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
