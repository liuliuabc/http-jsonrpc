import HttpMethod from "./HttpMethod";
import {RpcClient} from "base-easy-jsonrpc";
import {RpcClientConfig, Server} from "base-easy-jsonrpc/dist/Model";
import {deepAssign} from "./util";
import {toHttpMethod} from "./Common";
import {RequestBody} from "./Model";

export default class HttpRpcClient extends RpcClient {
    constructor(config: RpcClientConfig, server: Server,
                public baseBody: RequestBody = {},
                public beforeRequestIntercept?: (body: RequestBody) => RequestBody) {
        super(config, server);
    }

    get<T>(body: RequestBody): Promise<T>;
    get<T>(path: string, body?: RequestBody): Promise<T>;
    get<T>(pathOrBody: string | RequestBody, body: RequestBody = (typeof pathOrBody === "string" ? {} : pathOrBody)): Promise<T> {
        if (typeof pathOrBody === "string") {
            body.path = pathOrBody;
        }
        body.method = HttpMethod.GET;
        return this.excute<T>(body);
    }

    post<T>(body: RequestBody): Promise<T>;
    post<T>(path: string, body?: RequestBody): Promise<T>;
    post<T>(pathOrBody: string | RequestBody, body: RequestBody = (typeof pathOrBody === "string" ? {} : pathOrBody)): Promise<T> {
        if (typeof pathOrBody === "string") {
            body.path = pathOrBody;
        }
        body.method = HttpMethod.POST;
        return this.excute<T>(body);
    }

    delete<T>(body: RequestBody): Promise<T>;
    delete<T>(path: string, body?: RequestBody): Promise<T>;
    delete<T>(pathOrBody: string | RequestBody, body: RequestBody = (typeof pathOrBody === "string" ? {} : pathOrBody)): Promise<T> {
        if (typeof pathOrBody === "string") {
            body.path = pathOrBody;
        }
        body.method = HttpMethod.DELETE;
        return this.excute<T>(body);
    }

    put<T>(body: RequestBody): Promise<T>;
    put<T>(path: string, body?: RequestBody): Promise<T>;
    put<T>(pathOrBody: string | RequestBody, body: RequestBody = (typeof pathOrBody === "string" ? {} : pathOrBody)): Promise<T> {
        if (typeof pathOrBody === "string") {
            body.path = pathOrBody;
        }
        body.method = HttpMethod.PUT;
        return this.excute<T>(body);
    }

    patch<T>(body: RequestBody): Promise<T>;
    patch<T>(path: string, body?: RequestBody): Promise<T>;
    patch<T>(pathOrBody: string | RequestBody, body: RequestBody = (typeof pathOrBody === "string" ? {} : pathOrBody)): Promise<T> {
        if (typeof pathOrBody === "string") {
            body.path = pathOrBody;
        }
        body.method = HttpMethod.PATCH;
        return this.excute<T>(body);
    }


    options<T>(body: RequestBody): Promise<T>;
    options<T>(path: string, body?: RequestBody): Promise<T>;
    options<T>(pathOrBody: string | RequestBody, body: RequestBody = (typeof pathOrBody === "string" ? {} : pathOrBody)): Promise<T> {
        if (typeof pathOrBody === "string") {
            body.path = pathOrBody;
        }
        body.method = HttpMethod.OPTIONS;
        return this.excute<T>(body);
    }

    head<T>(body: RequestBody): Promise<T>;
    head<T>(path: string, body?: RequestBody): Promise<T>;
    head<T>(pathOrBody: string | RequestBody, body: RequestBody = (typeof pathOrBody === "string" ? {} : pathOrBody)): Promise<T> {
        if (typeof pathOrBody === "string") {
            body.path = pathOrBody;
        }
        body.method = HttpMethod.HEAD;
        return this.excute<T>(body);
    }

    teace<T>(body: RequestBody): Promise<T>;
    teace<T>(path: string, body?: RequestBody): Promise<T>;
    teace<T>(pathOrBody: string | RequestBody, body: RequestBody = (typeof pathOrBody === "string" ? {} : pathOrBody)): Promise<T> {
        if (typeof pathOrBody === "string") {
            body.path = pathOrBody;
        }
        body.method = HttpMethod.TEACE;
        return this.excute<T>(body);
    }

    async excute<T>(body: RequestBody) {
        const assignBody = deepAssign({}, this.baseBody, body);
        const {method, path, timeout, headers, body: rBody, query, pathId} = this.beforeRequestIntercept ? this.beforeRequestIntercept(assignBody) : assignBody;
        return this.call<T>(toHttpMethod(method, path), {
            headers,
            body: rBody,
            query,
            pathId
        }, timeout);

    }
}
