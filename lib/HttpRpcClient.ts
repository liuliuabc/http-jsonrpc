import HttpMethod from "./HttpMethod";
import {RpcClient} from "base-easy-jsonrpc";
import {RpcClientConfig, Server} from "base-easy-jsonrpc/dist/Model";
import {deepAssign} from "./util";
import {toHttpMethod} from "./Common";
import {ClientRequestBody} from "./Model";

export default class HttpRpcClient extends RpcClient {
    constructor(config: RpcClientConfig, server: Server,
                public baseBody: ClientRequestBody = {},
                public beforeRequestIntercept?: (body: ClientRequestBody) => ClientRequestBody) {
        super(config, server);
    }

    get<T>(body: ClientRequestBody): Promise<T>;
    get<T>(path: string, body?: ClientRequestBody): Promise<T>;
    get<T>(pathOrBody: string | ClientRequestBody, body: ClientRequestBody = (typeof pathOrBody === "string" ? {} : pathOrBody)): Promise<T> {
        if (typeof pathOrBody === "string") {
            body.path = pathOrBody;
        }
        body.method = HttpMethod.GET;
        return this.excute<T>(body);
    }

    post<T>(body: ClientRequestBody): Promise<T>;
    post<T>(path: string, body?: ClientRequestBody): Promise<T>;
    post<T>(pathOrBody: string | ClientRequestBody, body: ClientRequestBody = (typeof pathOrBody === "string" ? {} : pathOrBody)): Promise<T> {
        if (typeof pathOrBody === "string") {
            body.path = pathOrBody;
        }
        body.method = HttpMethod.POST;
        return this.excute<T>(body);
    }

    delete<T>(body: ClientRequestBody): Promise<T>;
    delete<T>(path: string, body?: ClientRequestBody): Promise<T>;
    delete<T>(pathOrBody: string | ClientRequestBody, body: ClientRequestBody = (typeof pathOrBody === "string" ? {} : pathOrBody)): Promise<T> {
        if (typeof pathOrBody === "string") {
            body.path = pathOrBody;
        }
        body.method = HttpMethod.DELETE;
        return this.excute<T>(body);
    }

    put<T>(body: ClientRequestBody): Promise<T>;
    put<T>(path: string, body?: ClientRequestBody): Promise<T>;
    put<T>(pathOrBody: string | ClientRequestBody, body: ClientRequestBody = (typeof pathOrBody === "string" ? {} : pathOrBody)): Promise<T> {
        if (typeof pathOrBody === "string") {
            body.path = pathOrBody;
        }
        body.method = HttpMethod.PUT;
        return this.excute<T>(body);
    }

    patch<T>(body: ClientRequestBody): Promise<T>;
    patch<T>(path: string, body?: ClientRequestBody): Promise<T>;
    patch<T>(pathOrBody: string | ClientRequestBody, body: ClientRequestBody = (typeof pathOrBody === "string" ? {} : pathOrBody)): Promise<T> {
        if (typeof pathOrBody === "string") {
            body.path = pathOrBody;
        }
        body.method = HttpMethod.PATCH;
        return this.excute<T>(body);
    }

    options<T>(body: ClientRequestBody): Promise<T>;
    options<T>(path: string, body?: ClientRequestBody): Promise<T>;
    options<T>(pathOrBody: string | ClientRequestBody, body: ClientRequestBody = (typeof pathOrBody === "string" ? {} : pathOrBody)): Promise<T> {
        if (typeof pathOrBody === "string") {
            body.path = pathOrBody;
        }
        body.method = HttpMethod.OPTIONS;
        return this.excute<T>(body);
    }

    head<T>(body: ClientRequestBody): Promise<T>;
    head<T>(path: string, body?: ClientRequestBody): Promise<T>;
    head<T>(pathOrBody: string | ClientRequestBody, body: ClientRequestBody = (typeof pathOrBody === "string" ? {} : pathOrBody)): Promise<T> {
        if (typeof pathOrBody === "string") {
            body.path = pathOrBody;
        }
        body.method = HttpMethod.HEAD;
        return this.excute<T>(body);
    }

    teace<T>(body: ClientRequestBody): Promise<T>;
    teace<T>(path: string, body?: ClientRequestBody): Promise<T>;
    teace<T>(pathOrBody: string | ClientRequestBody, body: ClientRequestBody = (typeof pathOrBody === "string" ? {} : pathOrBody)): Promise<T> {
        if (typeof pathOrBody === "string") {
            body.path = pathOrBody;
        }
        body.method = HttpMethod.TEACE;
        return this.excute<T>(body);
    }

    private mergePath(path: string, pathId?: string | number, query?: any) {
        const index = path.indexOf("?");
        let realPath=path;
        if (index > 0) {
            realPath = path.substring(0, index);
            const queryStr=path.substring(index+1);
            if(queryStr&&query){
               const pairs=queryStr.split("&");
               for(const pair of pairs){
                  const keyValue=pair.split("=");
                  const key=keyValue[0];
                  const value=keyValue[1];
                  query[key]=value;
               }
            }
        }
        if (pathId){
            if (realPath.endsWith("/")){
                return realPath + pathId;
            } else {
                return `${realPath}/${pathId}`
            }
        }
        return realPath;
    }

    async excute<T>(body: ClientRequestBody) {
        const assignBody: ClientRequestBody = deepAssign({}, this.baseBody, body);
        const {method, path, timeout, headers, body: rBody, query={}, pathId} = this.beforeRequestIntercept ? this.beforeRequestIntercept(assignBody) : assignBody;
        return this.call<T>(toHttpMethod(method as HttpMethod, this.mergePath(path!!, pathId, query)), {
            headers,
            body: rBody,
            query
        }, timeout);

    }
}
