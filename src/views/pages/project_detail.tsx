import { Request, Response } from "express";
import { loadTemplate, redirect, sendFile } from "../../utils/templater";
import db from "../../db";

export default async function ProjectDetail(req: Request, res: Response): Promise<string> {
    const projectId = parseInt(req.params.id);

    const project = await db.project.findFirst({
        where: { id: projectId },
        include: { ProjectConfiguration: true },
    });
    if (!project) {
        redirect(res, "/");
        return '<div>Redirecting...</div>';
    }

    return loadTemplate('templates/pages/project', {
        'id': projectId,
        'name': project.name,
        'secret': project.ProjectConfiguration?.secret,
        'apiKey': project.ProjectConfiguration?.apiKey,
    })
}