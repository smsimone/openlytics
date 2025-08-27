import { Request } from "express";
import { loadTemplate } from "../../utils/templater";

export default function Login(req: Request) {
    return loadTemplate('templates/pages/login', {})
}