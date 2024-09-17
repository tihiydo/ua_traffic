import { Blogger } from '@/database/blogger';
import { type PostPriceSchema } from '@/database/blogger/prices';
import { type z } from 'zod';

export function getDiscountedPrice(PostPrice: z.infer<typeof PostPriceSchema>) {
    if(PostPrice.discount?.type === 'percentage') {
        return PostPrice.amount - PostPrice.amount * PostPrice.discount.value / 100;
    }
    if(PostPrice.discount?.type === 'static') {
        return PostPrice.amount - PostPrice.discount.value;
    }
    return PostPrice.amount;
}

export function bloggerhasDiscount(blogger: Blogger) {
	return Object.values(blogger.prices).some(price => price.discount);
}

export function hasDiscount(PostPrice: z.infer<typeof PostPriceSchema>) {
    return !!PostPrice.discount;
}