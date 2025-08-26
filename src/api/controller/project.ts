import db from '../../db'
import { Request, Response } from "express";
import crypto from "crypto";
import { loadTemplate } from "../../utils/templater";
import { Project } from '@prisma/client/edge';


function projectToCard(project: Project): string {
    return loadTemplate('./templates/components/project_card.html', {
        'name': project.name,
        'description': project.description ?? '',
        'lastEdited': project.updatedAt.toISOString(),
        'id': project.id
    })
}

export async function getProjectList(req: Request, resp: Response) {
    const sessionId = req.cookies.sessionId
    console.log('Fetching project list for sessionId:', sessionId);

    const projects = await db.project.findMany({
        where: {
            owner: {
                UserSessions: {
                    some: {
                        sessionId
                    }
                }
            }
        },
    })

    if (projects.length === 0) {
        resp.send(`
           <div class="alert alert-info">No projects found. Create a new project to get started!</div>
           <button
            hx-get="/redirect/new_project"
            hx-trigger="click"
            class="btn btn-primary">New project</button>
           `);
        return;
    }

    resp.send(`${projects.map(projectToCard).join('\n')}`);
}

export function getProject(req: Request, resp: Response) {
    const projectId = req.params.id;
    console.log(`Fetching project with ID: ${projectId}`);
    resp
        .header('HX-Redirect', `/project/${projectId}`)
        .send();
}

export async function createProject(req: Request<{ name: string, description: string }>, resp: Response) {
    const sessionId: string = req.cookies.sessionId;
    console.log('Creating project', req.body);
    const { name, description } = req.body
    if (!name || name.trim().length === 0) {
        resp.status(400).send('Project name is required');
        return;
    }

    const user = await db.authUser.findFirst({
        where: {
            UserSessions: {
                some: {
                    sessionId
                }
            }
        }
    })
    if (!user) {
        console.log('No user found for sessionId:', sessionId);
        resp
            .clearCookie('sessionId')
            .header('HX-Redirect', '/login')
            .send();
        return;
    }


    const project = await db.project.create({
        data: {
            name: name,
            description: description,
            owner: {
                connect: {
                    id: user!.id
                }
            }
        }
    })

    await db.projectConfiguration.create({
        data: {
            project: {
                connect: {
                    id: project.id
                }
            },
            apiKey: crypto.randomBytes(16).toString('hex'),
            secret: crypto.randomBytes(32).toString('hex')
        }
    })

    console.log('Creating new project for sessionId:', sessionId);
    resp
        .header('HX-Redirect', '/')
        .send();
}
