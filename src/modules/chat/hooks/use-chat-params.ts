import { useSearchParamsState } from "@/hooks/use-search-params-state"
import { z } from "zod"

const chatlistParams = z.object({
    chat: z.string(),
}).partial()

export const useChatParams = () => {
    return useSearchParamsState(chatlistParams, { defaultValues: {} })
}