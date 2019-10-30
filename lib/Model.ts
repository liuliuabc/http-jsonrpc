import HttpMethod from "./HttpMethod";
import {PatternMethod} from "base-easy-jsonrpc/dist/Model";
import HttpRouter from "./HttpRouter";

export type ParamType = {
    [key: string]: any
};
export interface HttpRpcMessage {
    id: string;
    method: string;
    params?: ServerRequestBody;
    jsonrpc: string;
}
export interface ServerRequestBody {
    query?: ParamType;
    headers?: ParamType;
    body?: ParamType;
}
export interface ClientRequestBody extends ServerRequestBody{
    method?: HttpMethod;
    timeout?: number;
    pathId?: number | string;
    path?: string;
    debug?: boolean;
}
export interface ServerBody  extends ServerRequestBody{
    paths:ParamType;
    match?:RegExpMatchArray|null;
}
export interface MatchMethod{
    method: PatternMethod;
    cb: HttpCallBack;
    paths:ParamType;
    pathMethod:string;
    httpMethod:HttpMethod;
    match?:RegExpMatchArray|null;
}
export type HttpCallBack = (body: ServerBody, router: HttpRouter) => any;
