import { createUnionSchema } from "@/lib/zod/create-many-union";
import { type z } from "zod";

export const BloggerBillingTabSchema = createUnionSchema(['billings', 'history', 'requisites'] as const)
export type BloggerBillingTab = z.infer<typeof BloggerBillingTabSchema>;
