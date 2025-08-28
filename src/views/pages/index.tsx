import { Request } from "express";
import html from "../../utilities";

export default function Index(req: Request) {
  return html`
    <div id="content">
      <div
        hx-get="/api/projects"
        hx-trigger="load"
        hx-swap="innerHTML"
        class="d-flex justify-content-center align-items-center"
        style="min-height: 200px"
      ></div>
    </div>
  `;
}
