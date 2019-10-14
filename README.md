#http-jsonrpc
##项目介绍
基于jsonrpc库封装的类restful http库
##使用范例
```
        const server = new HttpRpcServer();
        server.onNotify("success", (params, router) => {
            router!!.redirect("error");
        });
        server.onNotify("error", () => {
            console.log("notify----error");
        });
        server.onCall("login", (params, router) => {
            router!!.redirect("loginError");
            //return true;
        });
        server.onCall("loginError", (params, router) => {
            return true;
        });
        server.onCall(/^login/, () => {
            return "login rexge";
        });


       const client = new RpcClient({timeout: 3000}, {
            send: (data) => {
                this.server.onClientMessage({
                    send: (data) => {
                        client.onServerMessage(data);
                    }
                }, data)
            }
        });
       const result = await client.call("login",{},1000);
       console.log(result);

       client.notify("success");


```
