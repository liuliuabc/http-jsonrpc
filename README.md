#http-jsonrpc
##项目介绍
基于jsonrpc库封装的类restful http库
##使用范例
```
        const server = new HttpRpcServer();
        server.onGet(/.*/, ({query,body,headers}) => {
            if(headers["token"]!="123"){
               throw HttpError.Unauthorized;
            }else{
               router.next();
            }
        });
        server.onDelete("user/:age/:name", ({query,body,headers,paths}, router) => {
               const {age,name}=paths;
               return name;
        });
        server.onDelete("user", ({query,body,headers}, router) => {
            return true;
        });
        server.onGet("user", ({query,body}) => {
            return true;
        });
 
       const client = new HttpRpcClient({timeout: 3000}, {
            send: (data) => {
                this.server.onHttpClientMessage({
                    send: (data) => {
                        client.onServerMessage(data);
                    }
                }, data)
            }
        });
       const result = await client.delete("user/1");
       console.log(result);

```
