import { type Profile, type LegalQuestion, type Consultation, type DocumentTemplate, type UserDocument, type AnonymousReport, type ConsultationReview } from "@shared/schema";

const API_BASE = '/api';

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for session management
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async signup(userData: any): Promise<{ profile: Profile; message: string }> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email: string, password: string): Promise<{ profile: Profile; message: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(): Promise<{ message: string }> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser(): Promise<{ profile: Profile }> {
    return this.request('/auth/me');
  }

  // Profile methods
  async updateProfile(id: string, profileData: Partial<Profile>): Promise<Profile> {
    return this.request(`/profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getLawyers(): Promise<Profile[]> {
    return this.request('/lawyers');
  }

  // Legal Questions methods
  async createLegalQuestion(questionData: any): Promise<LegalQuestion> {
    return this.request('/legal-questions', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  }

  async getMyLegalQuestions(): Promise<LegalQuestion[]> {
    return this.request('/legal-questions/my');
  }

  async getPendingLegalQuestions(): Promise<LegalQuestion[]> {
    return this.request('/legal-questions/pending');
  }

  async updateLegalQuestion(id: string, questionData: any): Promise<LegalQuestion> {
    return this.request(`/legal-questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(questionData),
    });
  }

  // Consultations methods
  async createConsultation(consultationData: any): Promise<Consultation> {
    return this.request('/consultations', {
      method: 'POST',
      body: JSON.stringify(consultationData),
    });
  }

  async getMyConsultations(): Promise<Consultation[]> {
    return this.request('/consultations/my');
  }

  async updateConsultation(id: string, consultationData: any): Promise<Consultation> {
    return this.request(`/consultations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(consultationData),
    });
  }

  // Document Templates methods
  async getDocumentTemplates(): Promise<DocumentTemplate[]> {
    return this.request('/document-templates');
  }

  async createDocumentTemplate(templateData: any): Promise<DocumentTemplate> {
    return this.request('/document-templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }

  // User Documents methods
  async getMyUserDocuments(): Promise<UserDocument[]> {
    return this.request('/user-documents/my');
  }

  async createUserDocument(documentData: any): Promise<UserDocument> {
    return this.request('/user-documents', {
      method: 'POST',
      body: JSON.stringify(documentData),
    });
  }

  async updateUserDocument(id: string, documentData: any): Promise<UserDocument> {
    return this.request(`/user-documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(documentData),
    });
  }

  async deleteUserDocument(id: string): Promise<{ message: string }> {
    return this.request(`/user-documents/${id}`, {
      method: 'DELETE',
    });
  }

  // Anonymous Reports methods
  async createAnonymousReport(reportData: any): Promise<AnonymousReport> {
    return this.request('/anonymous-reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async getAnonymousReports(): Promise<AnonymousReport[]> {
    return this.request('/anonymous-reports');
  }

  async updateAnonymousReport(id: string, reportData: any): Promise<AnonymousReport> {
    return this.request(`/anonymous-reports/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reportData),
    });
  }

  // Consultation Reviews methods
  async createConsultationReview(reviewData: any): Promise<ConsultationReview> {
    return this.request('/consultation-reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async getReviewsByLawyer(lawyerId: string): Promise<ConsultationReview[]> {
    return this.request(`/consultation-reviews/lawyer/${lawyerId}`);
  }

  async getApprovedReviews(): Promise<ConsultationReview[]> {
    return this.request('/consultation-reviews/approved');
  }

  async updateConsultationReview(id: string, reviewData: any): Promise<ConsultationReview> {
    return this.request(`/consultation-reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }
}

export const apiClient = new ApiClient();
export type { Profile, LegalQuestion, Consultation, DocumentTemplate, UserDocument, AnonymousReport, ConsultationReview };