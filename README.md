#http-jsonrpc
##项目介绍
基于jsonrpc库封装的类restful http库
##使用范例
```
        const server = new HttpRpcServer();
        server.onDelete("user", ({pathId,query,body}, router) => {
            return true;
        });
        server.onGet("user", ({pathId,query,body}) => {
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
