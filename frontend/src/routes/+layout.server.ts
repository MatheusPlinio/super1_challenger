import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    return {
        authToken: locals.authToken ?? null,
        user: locals.user
    };
};