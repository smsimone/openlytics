import { Request, Response } from "express";
import RenderComponent, { ComponentBuilder } from "./render_component";
import { loadTemplate } from "../../utils/templater";
import Navbar from "../components/navbar";
import Skeleton from "../components/skeleton";

export interface PageProps {
  /**
   * Meta title of the page
   * Default: "Openlytics"
   */
  title?: string;
}

export class Page implements RenderComponent {
  constructor(public builder: ComponentBuilder, public props?: PageProps) {}

  async render(req: Request, res: Response) {
    const content = await this.builder(req, res);

    let fullPage = Skeleton()
      .replaceAll("{{navbar}}", Navbar(this.props?.title ?? "Openlytics"))
      .replaceAll("{{body}}", content.toString())
      .replaceAll("{{title}}", this.props?.title ?? "Openlytics")
      .replaceAll(
        "{{page_title}}",
        `<title>${this.props?.title ?? "Openlytics"}</title>`
      );

    res.send(fullPage);
  }
}
