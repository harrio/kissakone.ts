declare module "express" {
  export function createServer(): any;
  export function cookieParser(): any;
  export function favicon(): any;
  export function bodyParser(): any;
  export function methodOverride(): any;
  export function errorHandler(): any;
  export function logger(name: string): any;
  export function logger(): any;
  export function static(path: string): any;
  export function session(secret: any): any;
}
