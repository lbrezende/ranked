import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1, "Titulo e obrigatorio").max(200),
  domain: z.string().optional(),
  targetUser: z.string().optional(),
  problems: z.string().optional(),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  domain: z.string().optional(),
  targetUser: z.string().optional(),
  problems: z.string().optional(),
  currentStage: z.enum(["DEFINE", "SKILLS", "EXAMPLES", "ABSTRACTION", "DECK", "IDEAS"]).optional(),
  status: z.enum(["ACTIVE", "COMPLETED", "ARCHIVED"]).optional(),
});

export const createIdeaSchema = z.object({
  title: z.string().min(1, "Titulo e obrigatorio").max(200),
  description: z.string().optional(),
  aiSkills: z.string().optional(),
});

export const updateIdeaSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  aiSkills: z.string().optional(),
  votes: z.number().int().min(0).optional(),
});
