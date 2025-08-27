import { login } from './controller/auth';

export type RouteMethods = {
    POST?: Function
    GET?: Function
    DELETE?: Function
    PUT?: Function
}

export type Endpoint = `/api/${string}`

export type Routes = { [key: Endpoint]: RouteMethods }
