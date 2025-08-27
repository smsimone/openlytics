import * as fs from "fs";
import { Response } from "express";
import { AllTemplates, ComponentTemplates, Routes, ViewTemplates } from "../templates";

export type TemplateParams = { [key: string]: string | number | null | undefined }

export function loadTemplate(
  path: string,
  params: TemplateParams = {},
  root: string = ".",
): string {
  const htmlPath = path.endsWith('.html') ? path : `${path}.html`;
  let content = fs.readFileSync(htmlPath, "utf-8");

  Object.keys(params).forEach((key) => {
    const placeholder = `{{${key}}}`;
    if (params[key])
      content = content.replaceAll(placeholder, params[key].toString());
  });

  return content;
}

export function sendFile(res: Response, path: AllTemplates, root: string = ".", params: TemplateParams = {}) {
  const htmlPath = path.endsWith('.html') ? path : `${path}.html`;

  if (Object.keys(params).length === 0) {
    res.sendFile(htmlPath, { root })
    return
  }

  const content = loadTemplate(htmlPath, params, root);
  res.send(content);
}

export function redirect(res: Response, page: Routes, invalidateSession: boolean = false) {
  if (invalidateSession) {
    res.clearCookie("sessionId");
  }
  res.header("HX-Redirect", page).send();
}