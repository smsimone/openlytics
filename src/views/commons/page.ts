
import { Request, Response } from "express";
import RenderComponent, { ComponentBuilder } from "./render_component";
import { loadTemplate } from "../../utils/templater";

export interface PageProps {
  /**
   * Meta title of the page
   * Default: "Openlytics"
   */
  title?: string
}

export class Page implements RenderComponent {
  constructor(public builder: ComponentBuilder, public props?: PageProps) { }

  private loadNavbar(): string {
    return loadTemplate('templates/components/navbar', {
      title: this.props?.title ?? "Openlytics"
    });
  }

  private loadSkeleton(): string {
    return loadTemplate('templates/components/skeleton', {});
  }

  async render(req: Request, res: Response) {
    const content = await this.builder(req, res);

    let fullPage = this.loadSkeleton()
      .replaceAll("{{navbar}}", this.loadNavbar())
      .replaceAll("{{body}}", content.toString())
      .replaceAll("{{title}}", this.props?.title ?? "Openlytics")
      .replaceAll('{{page_title}}', `<title>${this.props?.title ?? 'Openlytics'}</title>`)

    res.send(fullPage);
  }
}