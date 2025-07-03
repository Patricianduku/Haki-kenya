import { UserRole } from "@shared/schema";
import { Request } from "express";
import session from "express-session";

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      email: string;
      role: UserRole;
    };
  }
}

export interface AuthenticatedRequest extends Request {
  session: session.Session & Partial<session.SessionData> & {
    user: {
      id: string;
      email: string;
      role: UserRole;
    };
  };
}