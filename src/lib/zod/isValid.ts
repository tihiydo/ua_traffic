import { type ZodSchema } from "zod";

export function isValid(schema: ZodSchema, value: any) {
    try {
        schema.parse(value);

        return true
    } catch (error) {
        return false
    }
}