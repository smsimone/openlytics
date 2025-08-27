import { Request, Response } from "express";

export type ComponentBuilder =
    | ((req: Request) => Promise<string>)
    | ((req: Request) => string)
    | ((req: Request, res: Response) => Promise<string>)
    | ((req: Request, res: Response) => string)

export default interface RenderComponent {
    builder: ComponentBuilder

    render(req: Request, res: Response): Promise<void> | void;
}