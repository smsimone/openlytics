import { Express } from "express";
import { login, logout, register } from "./controller/auth";
import {
  createProject,
  deleteProject,
  getProjectList,
} from "./controller/project";
import { Routes } from "./api_routes";

const apiRoutes: Routes = {
  '/api/login': {
    POST: login
  },
  '/api/logout': {
    POST: logout
  },
  '/api/register': {
    POST: register
  },
  '/api/projects': {
    GET: getProjectList
  },
  '/api/project': {
    POST: createProject
  },
  '/api/project/:id': {
    DELETE: deleteProject,
    // PUT: updateProject, // Example for future expansion
    // DELETE: deleteProject, // Example for future expansion
  },
}

export default function registerApis(app: Express) {
  apiRoutes && Object.entries(apiRoutes).forEach(([route, methods]) => {
    Object.entries(methods).forEach(([method, handler]) => {
      switch (method) {
        case 'GET':
          app.get(route, (req, res) => handler(req, res));
          break;
        case 'POST':
          app.post(route, (req, res) => handler(req, res));
          break;
        case 'DELETE':
          app.delete(route, (req, res) => handler(req, res));
          break;
        case 'PUT':
          app.put(route, (req, res) => handler(req, res));
          break;
        default:
          break;
      }
    });
  });
}
