import { z } from "zod";

export const AgeCategorySchema = z.enum(['13-17', '18-24', '25-34', '35-44', '45+']);
export type AgeCategory = z.infer<typeof AgeCategorySchema>;

export const BloggerAdditionalInfoSchema = z.object({
	womenPercentage: z.number().min(0).max(100).optional().nullable(),
	menPercentage: z.number().min(0).max(100).optional().nullable(),
	ageCategory: AgeCategorySchema.optional().nullable(),
	cpm: z.number().nonnegative().optional().nullable(),
	cpv: z.number().nonnegative().optional().nullable(),
	channelAge: z.number().nonnegative().optional().nullable(),
	rating: z.number().optional().nullable(),
});

export type BloggerAdditionalInfo = z.infer<typeof BloggerAdditionalInfoSchema>;