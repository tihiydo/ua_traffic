import { addDoc } from "@/firebase/utils";
import { z } from 'zod';
import { type MessageType } from "../types/message";

type SendMessageData = Omit<MessageType, 'id' | 'viewedBy' | 'createdAt' | 'updatedAt'>;

const emailSchema = z.string().email();
const phonePattern = /(?:\+380[\s.-]?)?\(?\d{2,3}\)?[\s.-]?\d{2,3}[\s.-]?\d{2}[\s.-]?\d{2}/g;
const phoneSchema = z.string().regex(phonePattern);

function containsEmail(content: string): boolean {
    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
    return emailRegex.test(content);
}

function containsPhone(content: string): boolean {
    return phonePattern.test(content);
}

function containsURL(content: string): boolean {
    const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
    return urlRegex.test(content);
}

export function validateMessage(data: SendMessageData) {
    const { content, sender: { role } } = data;
    if (role === "blogger" || role === "advertiser") {
        if (containsURL(content) || containsEmail(content) || containsPhone(content)) {
            return true;
        }
    }
    return false;
}

export function sendMessage(data: SendMessageData) {
    return addDoc('/messages', {
        ...data,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        viewedBy: [],
    } satisfies Omit<MessageType, 'id'>);
}
