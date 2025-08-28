import { Request, Response } from 'express';
import { loadTemplate } from '../../utils/templater';
import db from '../../db';

export async function getProjectEvents(req: Request, res: Response) {
    const projectId = parseInt(req.params.id);
    const { page, pageSize } = req.query;

    const events = await db.event.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' },
        skip: page ? (Number(page) * Number(pageSize)) : 0,
        take: pageSize ? Number(pageSize) : 10
    })

    if (!events || events.length === 0) {
        res.status(204).send('<div>No events found for this project.</div>');
        return;
    }

    res.send(events.map(ev => loadTemplate(
        'templates/components/event_row',
        {
            id: ev.id,
            eventType: ev.eventType,
            userId: ev.userId,
            createdAt: ev.createdAt.toISOString(),
            customFields: JSON.stringify(ev.customFields, null, 2)
        }
    )).join(''));
}   