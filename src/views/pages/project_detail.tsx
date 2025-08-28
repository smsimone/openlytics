import { Request, Response } from "express";
import { loadTemplate, redirect, sendFile } from "../../utils/templater";
import db from "../../db";
import html from "../../utilities";

export default async function ProjectDetail(
  req: Request,
  res: Response
): Promise<string> {
  const projectId = parseInt(req.params.id);

  const project = await db.project.findFirst({
    where: { id: projectId },
    include: { ProjectConfiguration: true },
  });
  if (!project) {
    redirect(res, "/");
    return "<div>Redirecting...</div>";
  }

  //     return loadTemplate('templates/pages/project', {
  //         'id': projectId,
  //         'name': project.name,
  //         'secret': project.ProjectConfiguration?.secret,
  //         'apiKey': project.ProjectConfiguration?.apiKey,
  //     })
  const secret = project.ProjectConfiguration?.secret;
  const apiKey = project.ProjectConfiguration?.apiKey;

  return html`
    <div id="content">
      <script>
        let maxCharacters = 40;
        let secret =
          "${secret}".substring(0, maxCharacters) +
          ("${secret}".length > maxCharacters ? "..." : "");

        document.addEventListener("htmx:load", (event) => {
          // Initialize secret visibility on load
          const secretElement = document.getElementById("secret");
          if (secretElement) {
            secretElement.innerText = secret.replace(/./g, "*");
          }
        });

        function copySecret() {
          const btn = document.getElementById("copyButton");

          navigator.clipboard.writeText("${secret}").then(() => {
            const oldText = btn.textContent;
            btn.textContent = "Copied!";
            btn.disabled = true;
            btn.classList.add("btn-success");

            setTimeout(() => {
              btn.textContent = oldText;
              btn.disabled = false;
              btn.classList.remove("btn-success");
            }, 1000);
          });
        }

        function toggleSecretVisibility() {
          const secretElement = document.getElementById("secret");
          if (secretElement.innerText.includes("*")) {
            secretElement.innerText = secret;
          } else {
            secretElement.innerText = secret.replace(/./g, "*");
          }
        }
      </script>
      <style>
        .progress-bar.indeterminate {
          position: relative;
          animation: progress-indeterminate 5s infinite;
        }

        @keyframes progress-indeterminate {
          from {
            left: -25%;
            width: 25%;
          }

          to {
            left: 100%;
            width: 25%;
          }
        }
      </style>

      <div class="container">
        <div class="row">
          <!-- secrets card -->
          <div class="align-content-center mb-4">
            <div class="card shadow-lg rounded-4">
              <h5 class="card-header">Secrets</h5>
              <div class="card-body">
                <div class="card-text overflow-hidden">
                  <p class="text-truncate">
                    API Key: <span class="font-monospace">${apiKey}</span>
                  </p>
                  <p class="text-truncate">
                    Secret:
                    <span
                      class="font-monospace text-truncate overflow-scroll"
                      id="secret"
                      >*****</span
                    >
                    <button
                      class="btn btn-sm btn-outline-secondary"
                      hx-on:click="toggleSecretVisibility()"
                    >
                      Show/Hide
                    </button>
                    <button
                      id="copyButton"
                      class="btn btn-sm btn-outline-secondary"
                      onclick="copySecret()"
                    >
                      Copy
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <!-- events card -->
          <div class="mb-5">
            <script>
              let page = 0;
              let pageSize = 10;

              function incrementPage() {
                const current = page;
                page += 1;
                console.log("Incremented page to", page);
                return current;
              }

              function onSelectChange() {
                const value =
                  document.getElementById("elements_per_page").value;
                pageSize = Number(value);
              }
            </script>
            <div class="card overflow-hidden shadow-lg rounded-4">
              <h5 class="card-header d-flex justify-content-between">
                <p class="text-truncate" style="max-width: 30%">
                  Events for project
                  <span style="font-style: italic">${project.name}</span>
                </p>
                <div class="fs-6">
                  <!--  -->
                  <div>
                    <label for="elements_per_page" class="text-muted"
                      >Elements per page</label
                    >
                    <select
                      name="Elements per page"
                      id="elements_per_page"
                      class="form-select"
                      onchange="onSelectChange()"
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>
              </h5>
              <div class="card-body" style="max-height: 400px">
                <table class="table table-hover">
                  <thead
                    id="events_table"
                    hx-get="/api/project/${project.id}/events"
                    hx-vars="page:incrementPage(),pageSize:pageSize"
                    hx-trigger="load,change from:#elements_per_page"
                    hx-swap="innerHTML"
                    hx-target="#table_content"
                  >
                    <tr>
                      <th scope="col">User ID</th>
                      <th scope="col">Event Type</th>
                      <th scope="col">Created At</th>
                      <th scope="col">Custom fields</th>
                    </tr>
                  </thead>
                  <tbody id="table_content">
                    <!-- Event rows will be appended here -->
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="row"></div>
      </div>

      <div class="modal-footer">
        <button
          type="button"
          class="btn btn-danger"
          hx-delete="/api/project/${project.id}"
          hx-confirm="Are you sure you want to delete this project?"
          hx-trigger="click"
          hx-swap="none"
        >
          Delete
        </button>
      </div>
    </div>
  `;
}
