import { TRPCError } from "@trpc/server";

export class BlockedError extends TRPCError {
    constructor() {
        super({ code: 'UNAUTHORIZED', message: 'blocked', cause: 'blocked' })
    }
}