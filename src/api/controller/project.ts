import db from "../../db";
import { Request, Response } from "express";
import crypto from "crypto";
import { loadTemplate, redirect } from "../../utils/templater";
import { Project } from "@prisma/client/edge";

function projectToCard(project: Project): string {
  return loadTemplate("./templates/components/project_card.html", {
    name: project.name,
    description: project.description ?? "",
    lastEdited: project.updatedAt.toISOString(),
    id: project.id,
  });
}

export async function getProjectList(req: Request, resp: Response) {
  const sessionId = req.cookies.sessionId;
  console.log("Fetching project list for sessionId:", sessionId);

  const projects = await db.project.findMany({
    where: {
      owner: {
        UserSessions: {
          some: {
            sessionId,
          },
        },
      },
    },
  });

  if (projects.length === 0) {
    resp.send(`
           <div class="alert alert-info">No projects found. Create a new project to get started!</div>
           <a
            href="/new_project"
            class="btn btn-primary">New project</a>
           `);
    return;
  }

  resp.send(`${projects.map(projectToCard).join("\n")}`);
}

export async function createProject(
  req: Request<{ name: string; description: string }>,
  resp: Response,
) {
  const sessionId: string = req.cookies.sessionId;
  console.log("Creating project", req.body);
  const { name, description } = req.body;
  if (!name || name.trim().length === 0) {
    resp.status(400).send("Project name is required");
    return;
  }

  const user = await db.authUser.findFirst({
    where: {
      UserSessions: {
        some: {
          sessionId,
        },
      },
    },
  });
  if (!user) {
    console.log("No user found for sessionId:", sessionId);
    redirect(resp, "/login", true);
    return;
  }

  const project = await db.project.create({
    data: {
      name: name,
      description: description,
      owner: {
        connect: {
          id: user!.id,
        },
      },
    },
  });

  await db.projectConfiguration.create({
    data: {
      project: {
        connect: {
          id: project.id,
        },
      },
      apiKey: crypto.randomBytes(16).toString("hex"),
      secret: crypto.randomBytes(32).toString("hex"),
    },
  });

  console.log("Creating new project for sessionId:", sessionId);
  redirect(resp, "/", false);
}
