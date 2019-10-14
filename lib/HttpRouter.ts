import HttpError from "./HttpError";
import HttpRpcServer from "./HttpRpcServer";
import {CallBack, Client, Message, PatternMethod} from "base-easy-jsonrpc/dist/Model";
import HttpMethod from "./HttpMethod";
import {toHttpMethod} from "./Common";
import {RequestBody} from "./Model";
export default class HttpRouter{
    constructor(public server: HttpRpcServer,
                public client: Client,
                public msg: Message,
                public methodPattern: PatternMethod,
                public httpCallMap:Map<HttpMethod,Map<PatternMethod, CallBack>> ,
                public httpMethod: HttpMethod,
                public hasUsed?: () => void) {
    }
    redirect(method: string, params: RequestBody=this.msg.params,httpMethod:HttpMethod=this.httpMethod) {
        this.hasUsed && this.hasUsed();
        this.msg.params = params;
        this.msg.method = toHttpMethod(httpMethod,method);
        this.server.onHttpClientMessage(this.client, this.msg);
    }
    next(params: any = this.msg.params){
        this.hasUsed && this.hasUsed();
        this.msg.params = params;
        const methodPattern = this.server.getNextMatchMethod(this.httpCallMap.get(this.httpMethod)!!, this.msg.method, this.methodPattern)
        if (methodPattern) {
            this.server.onHttpClientMessage(this.client, this.msg, methodPattern);
        } else {
            this.client.send({error: HttpError.NotFound, id: this.msg.id, jsonrpc: this.server.jsonrpc});
        }
    }
}
