import { prisma } from "$lib/server/database";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { validateToken } from "$lib/server/auth";

export const actions: Actions = {
    sendMessage: async ({ cookies, request }) => {
        const user = await validateToken(cookies);

        if(!user)
            return fail(401, { unauthorized: true });

        const data = await request.formData();
        const content = data.get('content') as string;

        if(!content)
            return fail(422, { missingFields: true });

        await prisma.message.create({
            data: {
                content: content,
                user: {
                    connect: user
                }
            },
        });

        throw redirect(302, '/messages');
    }
}

export const load: PageServerLoad = async ({ cookies }) => {
    const user = await validateToken(cookies);

    if(!user)
        return { unauthorized: true };

    const messages = await prisma.message.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    color: true
                }
            }
        },
        orderBy: { id: 'desc' },
        take: 10
    });

    return {
        messages: messages,
        username: user.username
    };
}
