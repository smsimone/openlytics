import { Request, Response } from 'express';
import db from '../../db';

export async function getProjectEvents(req: Request, res: Response) {
    const projectId = parseInt(req.params.id);

    const events = await db.event.findMany({ where: { projectId } })

    if (!events || events.length === 0) {
        res.status(204).send('<div>No events found for this project.</div>');
        return;
    }

    res.send(events.map(event => `
        <div>
            <div>${event.eventType}</div>
            <div>${event.createdAt}</div>
            </div>
            `
    ).join(''));
}   