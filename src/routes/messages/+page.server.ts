import { prisma } from '$lib/server/database';
import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { validateToken } from '$lib/server/auth';

const REPORT_COUNT_FOR_DELETE = 3;

export const actions: Actions = {
	sendMessage: async ({ cookies, request }) => {
		const user = await validateToken(cookies);

		if (!user) return fail(401, { unauthorized: true });

		const data = await request.formData();
		const content = data.get('content') as string;

		if (!content) return fail(422, { missingFields: true });

		await prisma.message.create({
			data: {
				content: content,
				user: {
					connect: user
				}
			}
		});

		throw redirect(302, '/messages');
	},
	reportMessage: async ({ cookies, request }) => {
		const user = await validateToken(cookies);

		if(!user) return fail(401, { unauthorized: true });

		const data = await request.formData();
		const messageId = parseInt(data.get('messageId') as string);

		if(!messageId) return fail(422, { missingFields: true });

		const message = await prisma.message.findUnique({
			where: {
				id: messageId
			}
		});
		
		// If the message doens't exist:
		if(!message)
			return;

		const reportFromUser = await prisma.report.findFirst({
			where: {
				message: {
					id: messageId
				},
				user: {
					id: user.id
				}
			}
		});

		if(reportFromUser) // They have already reported
			return;

		const reports = await prisma.report.findMany({
			where: {
				message: {
					id: messageId
				}
			}
		});

		// If all the reports including the new one is more than the rep-
		// -orts needed for deletion then delete the messsage
		if(reports.length+1 >= REPORT_COUNT_FOR_DELETE) {
			// All the reports will automatically commit suic-
			// -ide because onDelete: Cascade
			await prisma.message.delete({
				where: {
					id: messageId
				}
			});
		} else {
			await prisma.report.create({
				data: {
					user: {
						connect: {
							id: user.id
						}
					},
					message: {
						connect: {
							id: messageId
						}
					}
				}
			});
		}

		throw redirect(302, '/messages');
	},
	deleteMessage: async ({ cookies, request }) => {
		const user = await validateToken(cookies);

		if(!user) return fail(401, { unauthorized: true });

		const data = await request.formData();
		const messageId = parseInt(data.get('messageId') as string);

		if(!messageId)
			return fail(422, { missingFields: true });
		
		await prisma.message.delete({
			where: {
				id: messageId,
				user: user
			}
		});

		throw redirect(302, '/messages');
	}
};

export const load: PageServerLoad = async ({ cookies }) => {
	const user = await validateToken(cookies);

	if (!user) return { unauthorized: true };

	const messages = await prisma.message.findMany({
		include: {
			user: {
				select: {
					id: true,
					username: true,
					color: true,
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
};
