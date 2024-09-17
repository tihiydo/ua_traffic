import { useLocalStorage } from "@/hooks/use-local-storage";

const SIGN_UP_SESSION_PATH = "sign-up-session";
type SignUpCredentials = Partial<{
  email: string;
  password?: string;
  lastSendDate: number | null; // milliseconds
}>;

export function useSignUpSession() 
{
    return useLocalStorage<SignUpCredentials>(SIGN_UP_SESSION_PATH)
}
