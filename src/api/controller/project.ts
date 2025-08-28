import db from "../../db";
import { Request, Response } from "express";
import crypto from "crypto";
import { redirect, sendFile } from "../../utils/templater";
import projectCard from "../../views/components/project_card";

export async function getProjectList(req: Request, resp: Response) {
  const sessionId = req.cookies.sessionId;

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
    sendFile(resp, "templates/components/index_empty_state", ".", {});
    return;
  }

  // Determina la classe CSS basata sul numero di progetti
  let containerClass = "";
  let itemClass = "";

  if (projects.length === 1) {
    // Un elemento: centrato
    containerClass = "d-flex justify-content-center";
    itemClass = "";
  } else if (projects.length === 2) {
    // Due elementi: spazio tra di loro
    containerClass = "d-flex justify-content-between gap-3";
    itemClass = "";
  } else {
    // 3 o più: griglia 3x3
    containerClass = "row g-3";
    itemClass = "col-12 col-md-6 col-lg-4";
  }

  const projectsHtml = projects
    .map((project) => {
      if (projects.length >= 3) {
        return `<div class="${itemClass}">${projectCard(project)}</div>`;
      }
      return projectCard(project);
    })
    .join("\n");

  resp.send(`<div class="${containerClass}">${projectsHtml}</div>`);
}

export async function createProject(
  req: Request<{ name: string; description: string }>,
  resp: Response
) {
  const sessionId: string = req.cookies.sessionId;
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
    console.error("No user found for sessionId:", sessionId);
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

  redirect(resp, "/", false);
}

export async function deleteProject(req: Request, resp: Response) {
  const sessionId: string = req.cookies.sessionId;
  const projectId = parseInt(req.params.id);

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
    console.error("No user found for sessionId:", sessionId);
    redirect(resp, "/login", true);
    return;
  }

  const project = await db.project.findFirst({
    where: {
      id: projectId,
      ownerId: user.id,
    },
  });
  if (!project) {
    resp.status(404).send("Project not found");
    return;
  }

  await db.projectConfiguration.delete({
    where: { projectId: projectId },
  });
  await db.project.delete({
    where: { id: projectId },
  });

  redirect(resp, "/", false);
}
