import { Express } from "express";
import { login, logout, register } from "./controller/auth";
import {
  createProject,
  getProjectList,
} from "./controller/project";

export default function registerApis(app: Express) {
  app.post("/api/login", login);
  app.post("/api/logout", logout);
  app.post("/api/register", register);
  app.get("/api/projects", getProjectList);
  app.post("/api/project", createProject);
}
