import HttpRpcServer from "./HttpRpcServer";
import {Client} from "base-easy-jsonrpc/dist/Model";
import HttpMethod from "./HttpMethod";
import {toHttpMethod} from "./Common";
import {HttpRpcMessage, MatchMethod, ServerRequestBody} from "./Model";

export default class HttpRouter {
    constructor(public server: HttpRpcServer,
                public client: Client,
                public msg: HttpRpcMessage,
                public matchMethod: MatchMethod,
                public hasUsed?: () => void) {
    }
    redirect(path: string, httpMethod: HttpMethod = this.matchMethod.httpMethod, requestBody?: ServerRequestBody) {
        this.hasUsed && this.hasUsed();
        const params = requestBody ? requestBody : this.msg.params;
        const method = toHttpMethod(httpMethod, path);
        this.server.onHttpClientMessage(this.client,{method,params,jsonrpc:this.msg.jsonrpc,id:this.msg.id});
    }
    next(requestBody?: ServerRequestBody) {
        this.hasUsed && this.hasUsed();
        const params = Object.assign({}, this.msg.params);
        requestBody&&Object.assign(params,requestBody);
        this.server.onHttpClientMessage(this.client, {method:this.msg.method,params,jsonrpc:this.msg.jsonrpc,id:this.msg.id}, this.matchMethod);
    }
}
