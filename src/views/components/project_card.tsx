import { Project } from "@prisma/client";
import html from "../../utilities";

export default function projectCard(project: Project) {
  return html`
    <a
      class="card mb-3 shadow-sm text-decoration-none"
      style="max-width: 540px; cursor: pointer; height: max-content"
      href="/project/${project.id}"
    >
      <div class="container">
        <div class="row d-flex flex-row align-items-center">
          <div
            class="align-items-center d-flex"
            style="height: 150px; width: 150px"
          >
            <img
              src="/public/project_icon.png"
              class="img-fluid rounded-start"
              alt="Project Icon"
            />
          </div>
          <div class="w-50 card-body">
            <h5 class="card-title text-truncate">${project.name}</h5>
            <div class="card-text text-muted">
              <small>
                Created on: ${new Date(project.createdAt).toLocaleDateString()}
              </small>
            </div>
          </div>
        </div>
      </div>
    </a>
  `;
}
