import db from "./db";
import { Request, Response, Express } from "express";
import { redirect } from "./utils/templater";
import routes from "./views/routes";

export default function registerRoutes(app: Express) {
  Object.entries(routes).forEach(([path, page]) => {
    app.get(path, page.render.bind(page));
  });


  app.use(async (req: Request, res: Response, next) => {
    const usafeRoutes = ["/login"];

    if (usafeRoutes.includes(req.path) || req.path.startsWith("/api/")) {
      next();
      return;
    }
    const sessionId = req.cookies?.sessionId ?? null;

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
}
