import html from "../../utilities";

export default function Navbar(title: string) {
  return html`
    <nav class="navbar navbar-light bg-light shadow-lg rounded-3 p-2 mb-5">
      <a class="navbar-brand" href="/">${title}</a>
      <a href="/new_project" class="btn btn-primary">New project</a>
      <button
        type="button"
        id="logout-button"
        hx-post="/api/logout"
        hx-trigger="click"
        class="btn btn-danger"
        hx-confirm="Do you wish to quit?"
      >
        Logout
      </button>
    </nav>
  `;
}
