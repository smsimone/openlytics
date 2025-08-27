type Views = "index" | "login" | "project" | "new_project";
type Components = "project_card"

export type ViewTemplates = `templates/pages/${Views}`;

export type ComponentTemplates =
    | `templates/components/${Components}`


export type AllTemplates = ViewTemplates | ComponentTemplates;

type SecureRoutes = "/" | `/project/${number}` | "/new_project";
export type UnsecureRoutes = "/login";

export type Routes = SecureRoutes | UnsecureRoutes;