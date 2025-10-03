import { PUBLIC_BACKEND_URL } from '$env/static/public';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
    const res = await fetch(`${PUBLIC_BACKEND_URL}/api/cart`);

    if (!res.ok) {
        return { cart: [] };
    }

    const cart = await res.json();

    return { cart };
};