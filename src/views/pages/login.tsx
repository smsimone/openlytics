import { Request } from "express";
import { loadTemplate } from "../../utils/templater";
import html from "../../utilities";

export default function Login(req: Request) {
  return html`
    <form hx-post="/api/login" hx-target="#response" hx-swap="innerHTML">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required />
      <br />
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required />
      <br />
      <button type="submit">Login</button>
      <button
        type="button"
        hx-post="/api/register"
        hx-target="#response"
        hx-swap="innerHTML"
      >
        Register
      </button>
    </form>
    <div id="response"></div>
  `;
}
