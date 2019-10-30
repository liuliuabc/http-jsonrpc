import {RpcServer} from "base-easy-jsonrpc";
import HttpMethod from "./HttpMethod";
import {Client, PatternMethod, RpcServerConfig} from "base-easy-jsonrpc/dist/Model";
import HttpError from "./HttpError";
import {MethodTag} from "./Common";
import HttpRouter from "./HttpRouter";
import {HttpCallBack, HttpRpcMessage, MatchMethod, ParamType} from "./Model";

export default class HttpRpcServer extends RpcServer {
    private onHttpMap = new Map<HttpMethod, Map<PatternMethod, HttpCallBack>>();

    constructor(public config: RpcServerConfig = {}) {
        super(config);
    }

    private setCallback(httpMethod: HttpMethod, method: PatternMethod, cb: HttpCallBack) {
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

    private validateMatch(method: string, path: string) {
        const paths: ParamType = {};
        if (method.startsWith("/")) {
            method = method.substring(1);
        }
        if (path.startsWith("/")) {
            path = path.substring(1);
        }
        const splitsOrigin = method.split("/");
        const splitsTarget = path.split("/");
        if (splitsOrigin.length === splitsTarget.length) {
            for (let i = 0; i < splitsOrigin.length; i++) {
                const origin = splitsOrigin[i];
                const target = splitsTarget[i];
                if (origin.startsWith(":")) {
                    const pathName = origin.substring(1);
                    paths[pathName] = target;
                } else if (origin !== target) {
                    return;
                }
            }
            return paths;
        }
    }

    getNextHttpMatchMethod(path: string, lastMatchMethod?: MatchMethod):MatchMethod|undefined {
        const splits = path.split(MethodTag);
        const httpMethod=splits[0] as HttpMethod;
        const pathMethod=splits[1];
        const map = this.onHttpMap.get(httpMethod);
        if(!map){
            return;
        }
        const method = splits[1];
        let lastMethodPatternFind = lastMatchMethod ? false : true;
        for (const [key, cb] of map){
            if (lastMethodPatternFind) {
                if (typeof key === "string") {
                    const paths = this.validateMatch(key, method);
                    if (paths) {
                        return {method: key, cb, paths,httpMethod,pathMethod};
                    }
                } else {
                    const match = method.match(key);
                    if(match){
                        return {method: key, match, cb, paths: {},httpMethod,pathMethod};
                    }
                }
            } else if (lastMatchMethod && key === lastMatchMethod.method) {
                lastMethodPatternFind = true;
            }
        }
    }

    async onHttpClientMessage(client: Client, msg: any, lastMatchMethod?: MatchMethod) {
        this.info("onClientMessage", msg);
        if (typeof msg === "string") {
            try {
                msg= JSON.parse(msg) ;
            } catch (e) {
                this.error("parse msg error", e);
                return client.send({error: HttpError.BadRequest, jsonrpc: this.jsonrpc});
            }
        }
        let {id, jsonrpc, method, params={}} = msg as  HttpRpcMessage;
        const matchMethod=this.getNextHttpMatchMethod(method,lastMatchMethod);
        if (!matchMethod) {
            this.info("not find  matched http method for", method);
            return client.send({error: HttpError.NotFound, id, jsonrpc: this.jsonrpc});
        }
        this.info("find matched http method", matchMethod);
        if (jsonrpc !== this.jsonrpc) {
            return client.send({error: HttpError.BadRequest, id, jsonrpc: this.jsonrpc});
        } else if (id) { //call
            this.info("coming call method %s ,match methodPattern %o", method, matchMethod);
            let redirect = false;
            try {
                const router = new HttpRouter(this, client, msg, matchMethod,  () => redirect = true);
                // params.paths = matchMethod.paths;
                const result = await matchMethod.cb(Object.assign(  {
                    paths: matchMethod.paths,
                    match: matchMethod.match
                },params), router);
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

        } else {
            this.error("comming InvalidRequest id= %d", id);
            return client.send({error: HttpError.BadRequest, id, jsonrpc});
        }
    }

    onGet(patternMethod: PatternMethod, cb: HttpCallBack) {
        return this.setCallback(HttpMethod.GET, patternMethod, cb);
    }

    onPost(patternMethod: PatternMethod, cb: HttpCallBack) {
        return this.setCallback(HttpMethod.POST, patternMethod, cb);
    }

    onDelete(patternMethod: PatternMethod, cb: HttpCallBack) {
        return this.setCallback(HttpMethod.DELETE, patternMethod, cb);
    }

    onPut(patternMethod: PatternMethod, cb: HttpCallBack) {
        return this.setCallback(HttpMethod.PUT, patternMethod, cb);
    }

    onPatch(patternMethod: PatternMethod, cb: HttpCallBack) {
        return this.setCallback(HttpMethod.PATCH, patternMethod, cb);
    }

    onOptions(patternMethod: PatternMethod, cb: HttpCallBack) {
        return this.setCallback(HttpMethod.OPTIONS, patternMethod, cb);
    }

    onHead(patternMethod: PatternMethod, cb: HttpCallBack) {
        return this.setCallback(HttpMethod.HEAD, patternMethod, cb);
    }

    onTeace(patternMethod: PatternMethod, cb: HttpCallBack) {
        return this.setCallback(HttpMethod.TEACE, patternMethod, cb);
    }
}
