import { z } from "zod";
import { contact } from "@/app/lib/data";

const allowedProjectTypes = new Set(contact.projectTypes);
const allowedBudgetRanges = new Set(contact.budgetRanges);

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(160).transform((value) => value.toLowerCase()),
  projectType: z.string().refine((value) => allowedProjectTypes.has(value), "Choose a valid project type"),
  budgetRange: z.string().optional().transform((value) => value || null).refine((value) => value === null || allowedBudgetRanges.has(value), "Choose a valid budget range"),
  message: z.string().trim().min(20).max(2000),
  companyWebsite: z.string().max(0).optional().default(""),
});

export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;
