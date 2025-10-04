import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    return {
        authToken: locals.authToken || null,
        user: locals.user || null
    };
};