import HttpMethod from "./HttpMethod";

export const MethodTag = "--http-method--";

export function parseHttpMethod(httpMethod: string) {
    httpMethod = httpMethod.split(MethodTag)[0];
    for (const key in HttpMethod) {
        if (key === httpMethod) {
            return httpMethod as HttpMethod;
        }
    }
}

export function toHttpMethod(httpMethod: HttpMethod, method: string) {
    return `${httpMethod}${MethodTag}${method}`;
}
