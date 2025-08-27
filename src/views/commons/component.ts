import { Request, Response } from "express";
import RenderComponent, { ComponentBuilder } from "./render_component";

export default class Component implements RenderComponent {
    constructor(public builder: ComponentBuilder) {
    }

    async render(req: Request, res: Response) {
        const content = await this.builder(req, res);
        res.send(content);
    }
}