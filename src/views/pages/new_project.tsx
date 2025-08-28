import { Request } from "express";
import html from "../../utilities";

export default function NewProject(req: Request) {
  return html`
    <script>
      let nameMaxCount = 30;
      let descriptionMaxCount = 500;

      document.addEventListener("htmx:load", (_) => {
        document.getElementById("name").maxLength = nameMaxCount;
        document.getElementById("description").maxLength = descriptionMaxCount;
        document.getElementById("name-max-count").innerText = nameMaxCount;
        document.getElementById("description-max-count").innerText =
          descriptionMaxCount;
      });

      function updateNameCharCount() {
        const text = document.getElementById("name").value;
        document.getElementById("name-char-count").innerText = text.length;
      }

      function updateDescriptionCharCount() {
        const text = document.getElementById("description").value;
        document.getElementById("description-char-count").innerText =
          text.length;
      }
    </script>
    <div class="card m-auto p-4 shadow-lg" style="max-width: 600px">
      <div class="card-title">Create new project</div>
      <form hx-post="/api/project" hx-swap="none">
        <div class="card-body">
          <label for="name" class="mt-2">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            class="form-control"
            maxlength="30"
            oninput="updateNameCharCount()"
            required
          />
          <div class="d-flex justify-content-end">
            <small class="text-muted form-text">
              <span id="name-char-count">0</span>/<span
                id="name-max-count"
              ></span>
            </small>
          </div>
          <br />
          <label for="description" class="mt-2">Description</label>
          <textarea
            id="description"
            name="description"
            class="form-control"
            rows="4"
            placeholder="Enter a description of your project"
            oninput="updateDescriptionCharCount()"
          ></textarea>
          <div class="d-flex justify-content-end">
            <small class="text-muted form-text">
              <span id="description-char-count">0</span>/<span
                id="description-max-count"
              ></span>
            </small>
          </div>
        </div>
        <div class="text-end">
          <a href="/" class="btn btn-outline-danger me-2">Cancel</a>
          <button type="submit" class="btn btn-primary">Confirm</button>
        </div>
      </form>
    </div>
  `;
}
