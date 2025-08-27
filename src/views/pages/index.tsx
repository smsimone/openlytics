
import { Request } from "express";
import { loadTemplate } from "../../utils/templater";

export default function Index(req: Request) {
    return loadTemplate('templates/pages/index', {})
}