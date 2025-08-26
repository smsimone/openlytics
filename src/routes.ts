import db from './db'
import { Request, Response, Express } from 'express';
import { loadTemplate } from './utils/templater';

export default function registerRoutes(app: Express) {

    app.get('/login', (req: Request, res: Response) => {
        console.log('Serving login page');
        res.sendFile('templates/pages/login.html', { root: '.' });
    });

    app.use(async (req: Request, res: Response, next) => {
        const usafeRoutes = ['/login']

        if (usafeRoutes.includes(req.path) || req.path.startsWith('/api/')) {
            next()
            return
        }
        const sessionId = req.cookies?.sessionId ?? null
        console.log(`Requested ${req.method}: ${req.path} with session id: ${sessionId}`)

        if (sessionId) {

            const session = await db.userSessions.findFirst({
                where: { sessionId: sessionId }
            })
            if (!session) {
                res
                    .clearCookie('sessionId')
                    .header('HX-Redirect', '/login')
                    .redirect('/login')
                return
            }

            next()
            return
        }

        res
            .clearCookie('sessionId')
            .header('HX-Redirect', '/login')
            .redirect('/login')
    })

    app.get('/', (req: Request, res: Response) => {
        res.sendFile('templates/pages/index.html', { root: '.' });
    });

    app.get('/project/:id', async (req: Request, res: Response) => {
        const projectId = req.params.id;

        const project = await db.project.findFirst({
            where: { id: parseInt(projectId) },
            include: { ProjectConfiguration: true }
        })
        if (!project) {
            res.header('HX-Redirect', '/').redirect('/');
            return;
        }

        console.log(`Fetching project with ID: ${projectId}`);
        res.send(loadTemplate('./templates/pages/project.html',
            {
                'id': projectId,
                'name': project.name,
                'secret': project.ProjectConfiguration?.secret,
                'apiKey': project.ProjectConfiguration?.apiKey
            }
        ));
    })

    app.get('/new_project', (req: Request, res: Response) => {
        res.sendFile('templates/pages/new_project.html', { root: '.' });
    });
}