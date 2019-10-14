import HttpMethod from "./HttpMethod";
export type ParamType = {
    [key: string]: any
};

export interface RequestBody {
    query?: ParamType;
    headers?: ParamType;
    body?: ParamType;
    method?: HttpMethod;
    timeout?: number;
    pathId?: number | string;
    path?: string;
    debug?: boolean;
}
