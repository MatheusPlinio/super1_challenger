import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const res = await fetch('/api/cart');

    if (!res.ok) {
        return { cart: [] };
    }

    const cart = await res.json();

    return { cart };
};