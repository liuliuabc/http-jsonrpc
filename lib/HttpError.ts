export interface IHttpError {
    status:number;
    message:string;
}
export default {
    Success: {status: 200, message: "请求成功"},
    NotFound: {status: 404, message: "找不到方法或资源"},
    Unauthorized: {status: 401, message: "用户未认证"},
    BadRequest: {status: 400, message: "请求错误"},
    InternalError: {status: 500, message: "内部服务器错误"}
};
