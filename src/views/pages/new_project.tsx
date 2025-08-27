

import { Request } from "express";
import { loadTemplate } from "../../utils/templater";

export default function NewProject(req: Request) {
    return loadTemplate('templates/pages/new_project', {})
}