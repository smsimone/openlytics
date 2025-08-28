import html from "../../utilities";
import { Event } from "@prisma/client";

export default function EventRow(event: Event) {
  return html`
    <tr>
      <td>${event.userId}</td>
      <td>${event.eventType}</td>
      <td>${event.createdAt.toISOString()}</td>
      <td><code>${JSON.stringify(event.customFields, null, 2)}</code></td>
    </tr>
  `;
}
