import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProfileSchema, insertLegalQuestionSchema, insertConsultationSchema,
  insertDocumentTemplateSchema, insertUserDocumentSchema, insertAnonymousReportSchema,
  insertConsultationReviewSchema 
} from "@shared/schema";
import { z } from "zod";

// Session middleware setup
import session from "express-session";
import "./types"; // Import session extension

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware for authentication
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session?.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const validatedData = insertProfileSchema.parse(req.body);
      const existingProfile = await storage.getProfileByEmail(validatedData.email);
      
      if (existingProfile) {
        return res.status(400).json({ error: "User already exists" });
      }

      const profile = await storage.createProfile(validatedData);
      req.session.user! = { id: profile.id, email: profile.email, role: profile.role };
      
      res.json({ profile, message: "Account created successfully" });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // In a real app, you'd verify the password hash here
      const profile = await storage.getProfileByEmail(email);
      
      if (!profile) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.user! = { id: profile.id, email: profile.email, role: profile.role };
      res.json({ profile, message: "Login successful" });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const profile = await storage.getProfile(req.session.user!.id);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json({ profile });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: "Failed to get profile" });
    }
  });

  // Profile routes
  app.put("/api/profiles/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      if (id !== req.session.user!.id && req.session.user!.role !== 'lawyer') {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const validatedData = insertProfileSchema.partial().parse(req.body);
      const profile = await storage.updateProfile(id, validatedData);
      
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }

      res.json(profile);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  app.get("/api/lawyers", async (req, res) => {
    try {
      const lawyers = await storage.getLawyers();
      res.json(lawyers);
    } catch (error) {
      console.error('Get lawyers error:', error);
      res.status(500).json({ error: "Failed to get lawyers" });
    }
  });

  // Legal Questions routes
  app.post("/api/legal-questions", requireAuth, async (req, res) => {
    try {
      const validatedData = insertLegalQuestionSchema.parse({
        ...req.body,
        client_id: req.session.user!.id
      });
      
      const question = await storage.createLegalQuestion(validatedData);
      res.json(question);
    } catch (error) {
      console.error('Create legal question error:', error);
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  app.get("/api/legal-questions/my", requireAuth, async (req, res) => {
    try {
      const questions = await storage.getLegalQuestionsByClient(req.session.user!.id);
      res.json(questions);
    } catch (error) {
      console.error('Get client questions error:', error);
      res.status(500).json({ error: "Failed to get questions" });
    }
  });

  app.get("/api/legal-questions/pending", requireAuth, async (req, res) => {
    try {
      if (req.session.user!.role !== 'lawyer' && req.session.user!.role !== 'paralegal') {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const questions = await storage.getPendingLegalQuestions();
      res.json(questions);
    } catch (error) {
      console.error('Get pending questions error:', error);
      res.status(500).json({ error: "Failed to get pending questions" });
    }
  });

  app.put("/api/legal-questions/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      if (req.session.user!.role !== 'lawyer' && req.session.user!.role !== 'paralegal') {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const validatedData = insertLegalQuestionSchema.partial().parse({
        ...req.body,
        lawyer_id: req.session.user!.id
      });
      
      const question = await storage.updateLegalQuestion(id, validatedData);
      
      if (!question) {
        return res.status(404).json({ error: "Question not found" });
      }

      res.json(question);
    } catch (error) {
      console.error('Update legal question error:', error);
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  // Consultations routes
  app.post("/api/consultations", requireAuth, async (req, res) => {
    try {
      const validatedData = insertConsultationSchema.parse({
        ...req.body,
        client_id: req.session.user!.id
      });
      
      const consultation = await storage.createConsultation(validatedData);
      res.json(consultation);
    } catch (error) {
      console.error('Create consultation error:', error);
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  app.get("/api/consultations/my", requireAuth, async (req, res) => {
    try {
      let consultations;
      if (req.session.user!.role === 'client') {
        consultations = await storage.getConsultationsByClient(req.session.user!.id);
      } else {
        consultations = await storage.getConsultationsByLawyer(req.session.user!.id);
      }
      res.json(consultations);
    } catch (error) {
      console.error('Get consultations error:', error);
      res.status(500).json({ error: "Failed to get consultations" });
    }
  });

  app.put("/api/consultations/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertConsultationSchema.partial().parse(req.body);
      
      const consultation = await storage.updateConsultation(id, validatedData);
      
      if (!consultation) {
        return res.status(404).json({ error: "Consultation not found" });
      }

      res.json(consultation);
    } catch (error) {
      console.error('Update consultation error:', error);
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  // Document Templates routes
  app.get("/api/document-templates", async (req, res) => {
    try {
      const templates = await storage.getDocumentTemplates();
      res.json(templates);
    } catch (error) {
      console.error('Get document templates error:', error);
      res.status(500).json({ error: "Failed to get document templates" });
    }
  });

  app.post("/api/document-templates", requireAuth, async (req, res) => {
    try {
      if (req.session.user!.role !== 'lawyer' && req.session.user!.role !== 'paralegal') {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const validatedData = insertDocumentTemplateSchema.parse({
        ...req.body,
        created_by: req.session.user!.id
      });
      
      const template = await storage.createDocumentTemplate(validatedData);
      res.json(template);
    } catch (error) {
      console.error('Create document template error:', error);
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  // User Documents routes
  app.get("/api/user-documents/my", requireAuth, async (req, res) => {
    try {
      const documents = await storage.getUserDocuments(req.session.user!.id);
      res.json(documents);
    } catch (error) {
      console.error('Get user documents error:', error);
      res.status(500).json({ error: "Failed to get documents" });
    }
  });

  app.post("/api/user-documents", requireAuth, async (req, res) => {
    try {
      const validatedData = insertUserDocumentSchema.parse({
        ...req.body,
        user_id: req.session.user!.id
      });
      
      const document = await storage.createUserDocument(validatedData);
      res.json(document);
    } catch (error) {
      console.error('Create user document error:', error);
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  app.put("/api/user-documents/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertUserDocumentSchema.partial().parse(req.body);
      
      const document = await storage.updateUserDocument(id, validatedData);
      
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      res.json(document);
    } catch (error) {
      console.error('Update user document error:', error);
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  app.delete("/api/user-documents/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteUserDocument(id);
      
      if (!success) {
        return res.status(404).json({ error: "Document not found" });
      }

      res.json({ message: "Document deleted successfully" });
    } catch (error) {
      console.error('Delete user document error:', error);
      res.status(500).json({ error: "Failed to delete document" });
    }
  });

  // Anonymous Reports routes
  app.post("/api/anonymous-reports", async (req, res) => {
    try {
      const validatedData = insertAnonymousReportSchema.parse(req.body);
      const report = await storage.createAnonymousReport(validatedData);
      res.json(report);
    } catch (error) {
      console.error('Create anonymous report error:', error);
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  app.get("/api/anonymous-reports", requireAuth, async (req, res) => {
    try {
      if (req.session.user!.role !== 'lawyer' && req.session.user!.role !== 'paralegal') {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const reports = await storage.getAnonymousReports();
      res.json(reports);
    } catch (error) {
      console.error('Get anonymous reports error:', error);
      res.status(500).json({ error: "Failed to get reports" });
    }
  });

  app.put("/api/anonymous-reports/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      if (req.session.user!.role !== 'lawyer' && req.session.user!.role !== 'paralegal') {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const validatedData = insertAnonymousReportSchema.partial().parse(req.body);
      const report = await storage.updateAnonymousReport(id, validatedData);
      
      if (!report) {
        return res.status(404).json({ error: "Report not found" });
      }

      res.json(report);
    } catch (error) {
      console.error('Update anonymous report error:', error);
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  // Consultation Reviews routes
  app.post("/api/consultation-reviews", requireAuth, async (req, res) => {
    try {
      const validatedData = insertConsultationReviewSchema.parse({
        ...req.body,
        client_id: req.session.user!.id
      });
      
      const review = await storage.createConsultationReview(validatedData);
      res.json(review);
    } catch (error) {
      console.error('Create consultation review error:', error);
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  app.get("/api/consultation-reviews/lawyer/:lawyerId", async (req, res) => {
    try {
      const { lawyerId } = req.params;
      const reviews = await storage.getReviewsByLawyer(lawyerId);
      res.json(reviews);
    } catch (error) {
      console.error('Get lawyer reviews error:', error);
      res.status(500).json({ error: "Failed to get reviews" });
    }
  });

  app.get("/api/consultation-reviews/approved", async (req, res) => {
    try {
      const reviews = await storage.getApprovedReviews();
      res.json(reviews);
    } catch (error) {
      console.error('Get approved reviews error:', error);
      res.status(500).json({ error: "Failed to get reviews" });
    }
  });

  app.put("/api/consultation-reviews/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      if (req.session.user!.role !== 'lawyer' && req.session.user!.role !== 'paralegal') {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const validatedData = insertConsultationReviewSchema.partial().parse(req.body);
      const review = await storage.updateConsultationReview(id, validatedData);
      
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      res.json(review);
    } catch (error) {
      console.error('Update consultation review error:', error);
      res.status(400).json({ error: "Invalid input data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
