import { createUnionSchema } from "@/lib/zod/create-many-union";
import { z } from "zod";

export const categories = [
    'news',
    'sport',
    'cryptocurrency',
    'it',
    'gaming',
    'authors',
    'auto',
    'moto',
    'culinary',
    'business_and_startups',
    'marketing',
    'music',
    'creativity',
    'travel',
    'tourism',
    'economics',
    'booking_and_betting',
    'casino',
    'finance_and_investments',
    'blog',
    'entertainment',
    'humor',
    'sexology',
    'astrology_and_horoscope',
    'numerology_and_karma',
    'memes',
    'darknet',
    'topics',
    'artificial_intelligence',
    'womens',
    'beauty',
    'cosmetics',
    'self_care',
    'healthy_eating',
    'fashion',
    'interior',
    'real_estate',
    'construction',
    'lifehacks',
    'books',
    'movies_and_cartoons',
    'history',
    'mathematics',
    'politics',
    'education',
    'mens',
    'eighteenth_plus'
] as const;

export type Category = (typeof categories)[number]

export const bloggerCategoriesSchema = z
    .array(createUnionSchema(categories))
