import db from "../../db";
import { Request, Response } from "express";
import crypto from "crypto";
import { redirect } from "../../utils/templater";

export async function login(
  req: Request<{ username: string; password: string }>,
  res: Response,
) {
  const { username, password } = req.body;
  const user = await db.authUser.findFirst({
    where: { username, password },
  });
  if (!user) {
    console.log(`Failed login attempt for user: ${username}`);
    return res.status(401).send("Invalid username or password");
  }

  const sessionId = crypto.randomUUID();

  await db.userSessions.create({
    data: {
      sessionId,
      userId: user.id,
    },
  });

  console.log(`Logging in user: ${username} with sessionId: ${sessionId}`);
  res.cookie("sessionId", sessionId).header("HX-Redirect", "/").send();
}

export async function logout(req: Request, res: Response) {
  console.log("Logging out user");

  const sessionId = req.cookies.sessionId;
  await db.userSessions.deleteMany({
    where: { sessionId },
  });

  redirect(res, "/login", true);
}

export async function register(
  req: Request<{ username: string; password: string }>,
  res: Response,
) {
  const created = await db.authUser.create({
    data: {
      username: req.body.username,
      password: req.body.password,
    },
  });

  console.log(
    `Registered new user: ${created.username} with id: ${created.id}`,
  );
  const sessionId = crypto.randomUUID();
  await db.userSessions.create({
    data: {
      sessionId,
      userId: created.id,
    },
  });

  console.log(
    `Logging in new user: ${created.username} with sessionId: ${sessionId}`,
  );

  res.cookie("sessionId", sessionId).header("HX-Redirect", "/").send();
}
