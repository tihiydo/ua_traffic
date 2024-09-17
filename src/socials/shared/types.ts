import { PostPriceSchema } from '@/database/blogger/prices';
import { z } from 'zod';

export type BloggerPrices = Record<string, z.infer<typeof PostPriceSchema> | undefined>