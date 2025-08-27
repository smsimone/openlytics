import db from "./db";
import { Request, Response, Express } from "express";
import { loadTemplate, redirect, sendFile } from "./utils/templater";

export default function registerRoutes(app: Express) {
  app.get("/login", (req: Request, res: Response) => {
    console.log("Serving login page");
    sendFile(res, "templates/pages/login")
  });

  app.use(async (req: Request, res: Response, next) => {
    const usafeRoutes = ["/login"];

    if (usafeRoutes.includes(req.path) || req.path.startsWith("/api/")) {
      next();
      return;
    }
    const sessionId = req.cookies?.sessionId ?? null;
    console.log(
      `Requested ${req.method}: ${req.path} with session id: ${sessionId}`,
    );

    if (sessionId) {
      const session = await db.userSessions.findFirst({
        where: { sessionId: sessionId },
      });
      if (!session) {
        res
          .clearCookie("sessionId")
          .header("HX-Redirect", "/login")
          .redirect("/login");
        return;
      }

      next();
      return;
    }

    redirect(res, "/login", true);
  });

  app.get("/", (req: Request, res: Response) => {
    sendFile(res, "templates/pages/index")
  });

  app.get("/project/:id", async (req: Request, res: Response) => {
    const projectId = req.params.id;

    const project = await db.project.findFirst({
      where: { id: parseInt(projectId) },
      include: { ProjectConfiguration: true },
    });
    if (!project) {
      redirect(res, "/");
      return;
    }

    console.log(`Fetching project with ID: ${projectId}`);
    sendFile(res, "templates/pages/project", ".", {
      'id': projectId,
      'name': project.name,
      'secret': project.ProjectConfiguration?.secret,
      'apiKey': project.ProjectConfiguration?.apiKey,
    });
    console.log(`Served project page for project ID: ${projectId} -> ${project.name}`);
  });

  app.get("/new_project", (req: Request, res: Response) => {
    sendFile(res, "templates/pages/new_project")
  });
}
