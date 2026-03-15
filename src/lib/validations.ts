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
  currentStage: z.enum(["DEFINE", "SKILLS", "EXAMPLES", "ABSTRACTION", "DECK", "IDEAS", "PRIORITIZE", "PRD"]).optional(),
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

export const updateIdeaQuadrantSchema = z.object({
  quadrant: z.enum(["HIGH_IMPACT_LOW_EFFORT", "HIGH_IMPACT_HIGH_EFFORT", "LOW_IMPACT_LOW_EFFORT", "LOW_IMPACT_HIGH_EFFORT"]).nullable(),
});

export const selectIdeaSchema = z.object({
  ideaId: z.string().min(1),
});

export const updatePrdSchema = z.object({
  frame: z.string().optional(),
  appetite: z.string().optional(),
  solution: z.string().optional(),
  parts: z.string().optional(),
  rabbitHoles: z.string().optional(),
  noGos: z.string().optional(),
  breadboard: z.string().optional(),
  slices: z.string().optional(),
});
