import { Page } from "./commons/page";
import Index from "./pages";
import Login from "./pages/login";
import NewProject from "./pages/new_project";
import ProjectDetail from "./pages/project_detail";

const routes = {
    '/': new Page(Index),
    '/login': new Page(Login),
    '/project/:id': new Page(ProjectDetail),
    '/new_project': new Page(NewProject),
}

export default routes;