import { z } from "zod";

export const formFloatSchema = z.string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Введіть коректне число')

export const formIntSchema = z.string()
    .regex(/^\d+$/, 'Введіть коректне число')

export const formOptionalIntSchema = z.string()
    .regex(/^\d*?$/, 'Введіть коректне число')