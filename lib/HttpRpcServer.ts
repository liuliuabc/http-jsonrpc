import {RpcServer} from "base-easy-jsonrpc";
import HttpMethod from "./HttpMethod";
import {CallBack, Client, PatternMethod, RpcServerConfig} from "base-easy-jsonrpc/dist/Model";
import HttpError from "./HttpError";
import {parseHttpMethod} from "./Common";
import HttpRouter from "./HttpRouter";

export default class HttpRpcServer extends RpcServer {
    private onHttpMap = new Map<HttpMethod, Map<PatternMethod, CallBack>>();

    constructor(public config: RpcServerConfig = {}) {
        super(config);
    }
    private setCallback(httpMethod: HttpMethod, method: PatternMethod, cb: CallBack) {
        const map = this.onHttpMap.get(httpMethod);
        if (map) {
            map.set(method, cb);
        } else {
            const map = new Map();
            map.set(method, cb);
            this.onHttpMap.set(httpMethod, map);
        }
        return this;
    }
    async onHttpClientMessage(client: Client, msg: any, methodPattern?: PatternMethod) {
        this.info("onClientMessage", msg);
        if (typeof msg === "string") {
            try {
                msg = JSON.parse(msg);
            } catch (e) {
                this.error("parse msg error", e);
                return client.send({error: HttpError.BadRequest, jsonrpc: this.jsonrpc});
            }
        }
        const {id, jsonrpc, method, params} = msg;
        const httpMethod = parseHttpMethod(method);
        if (!httpMethod) {
            return super.onClientMessage(client, msg);
        }
        const onCallMap=this.onHttpMap.get(httpMethod);
        if(!onCallMap){
            return client.send({error: HttpError.NotFound, id, jsonrpc: this.jsonrpc});
        }
        if (!methodPattern) {
            methodPattern = this.getNextMatchMethod(onCallMap, method);
            if (!methodPattern) {
                this.info("not find  matched http method for", method);
                return client.send({error: HttpError.NotFound, id, jsonrpc: this.jsonrpc});
            } else {
                methodPattern = methodPattern!!;
            }
        }
        this.info("find matched http method", methodPattern);
        if (jsonrpc !== this.jsonrpc) {
            return client.send({error: HttpError.BadRequest, id, jsonrpc: this.jsonrpc});
        } else if (id) { //call
            this.info("coming call method %s ,match methodPattern %o", method, methodPattern);
            const cb = onCallMap.get(methodPattern);
            if (!cb) {
                this.info("not find  matched method for", method);
                return client.send({error: HttpError.NotFound, id, jsonrpc: this.jsonrpc});
            } else {
                let redirect = false;
                try {
                    const router = new HttpRouter(this, client, msg, methodPattern,this.onHttpMap,httpMethod ,() => redirect = true);
                    const result = await cb(params, router);
                    if (!redirect) {
                        this.info("send success data  ", result);
                        return client.send({result, id, jsonrpc: this.jsonrpc});
                    }
                } catch (e) {
                    if (redirect) {
                        this.error("catch error after redirect ,you should handle this error", e);
                        throw e;//错误抛出去让上层处理；
                    }
                    const error = Object.assign({}, HttpError.InternalError);
                    if (e) {
                        if (typeof e !== "object") {
                            error.message = e;
                        } else {
                            error.message = e.message;
                            if (e.status !== undefined) {
                                error.status = e.status;
                            }
                        }
                    }
                    this.info("send error data  ", error);
                    return client.send({error, id, jsonrpc: this.jsonrpc});
                }
            }
        } else {
            this.error("comming InvalidRequest id= %d", id);
            return client.send({error: HttpError.BadRequest, id, jsonrpc});
        }
    }

    onGet(patternMethod: PatternMethod, cb: CallBack) {
        return this.setCallback(HttpMethod.GET, patternMethod, cb);
    }

    onPost(patternMethod: PatternMethod, cb: CallBack) {
        return this.setCallback(HttpMethod.POST, patternMethod, cb);
    }

    onDelete(patternMethod: PatternMethod, cb: CallBack) {
        return this.setCallback(HttpMethod.DELETE, patternMethod, cb);
    }

    onPut(patternMethod: PatternMethod, cb: CallBack) {
        return this.setCallback(HttpMethod.PUT, patternMethod, cb);
    }

    onPatch(patternMethod: PatternMethod, cb: CallBack) {
        return this.setCallback(HttpMethod.PATCH, patternMethod, cb);
    }

    onOptions(patternMethod: PatternMethod, cb: CallBack) {
        return this.setCallback(HttpMethod.OPTIONS, patternMethod, cb);
    }

    onHead(patternMethod: PatternMethod, cb: CallBack) {
        return this.setCallback(HttpMethod.HEAD, patternMethod, cb);
    }

    onTeace(patternMethod: PatternMethod, cb: CallBack) {
        return this.setCallback(HttpMethod.TEACE, patternMethod, cb);
    }
}
