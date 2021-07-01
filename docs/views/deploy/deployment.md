---
title: 记一次手动部署的经历
date: 2021-07-01
categories:
 - deploy
tags:
 - deploy
---

### 一、租用域名

配置安全组, 放开所有需要访问的端口

### 二、租用服务器

1、进行实名认证
2、备案

### 三、建立远程连接
1、重置实例密码 实例 => 更多 => 密码/密钥 => 重置实例密码

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb615febbe3240ec9ddd3f9b936215b4~tplv-k3u1fbpfcp-watermark.image)

2、输入新密码并记住

3、安装finalShell工具来进行远程连接


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fec2c5d5490244779bdeca3b018f941a~tplv-k3u1fbpfcp-watermark.image)
点击这个后创建新的ssh连接

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bb369eb67fb4dec86ac26671605bcb7~tplv-k3u1fbpfcp-watermark.image)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb3443f94a2b4310ae69db24145e5826~tplv-k3u1fbpfcp-watermark.image)
点击你创建的连接实例即可连接上你的服务器


![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b29819308e74d5487c091e2a85c2a42~tplv-k3u1fbpfcp-watermark.image)

### 四、在服务器上搭建nodejs开发环境
a、yum 安装 git

```js
yum install git // 执行完成后可通过git -v查看版本以及是否下载成功
```
b、使用git将nvm源码克隆到本地的~/.nvm目录下，并检查最新版本。

```js
git clone https://github.com/cnpm/nvm.git ~/.nvm && cd ~/.nvm && git checkout `git describe --abbrev=0 --tags`
```
c、激活NVM。

```js
echo ". ~/.nvm/nvm.sh" >> /etc/profile
```

```js
source /etc/profile
```
d、下载node版本

```js
nvm install v14.12.0 // 下载版本14.12.0
```
e、查看下载的版本

```js
nvm list
```
f、选择要使用的node版本(多个版本下)

```js
nvm use v14.12.0
```
### 五、安装mongodb(选择与服务器操作系统对应版本的mongodb)
[官方下载地址](https://www.mongodb.com/try/download/community)

1、直接把你下载后的压缩包拖到finalShell中你要放置的文件夹下就可完成上传到服务器

2、 解压

a、使用命令进入到你放置的文件夹下（也可以直接填写解压文件所在的路径进行解压）

```js
 tar -zxvf mongodb-linux-x86_64-rhel70-5.0.0-rc2.tgz // 文件名
```
点击这个刷新即可看到解压后的文件，进行重命名为mongodb

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb42acecb8954fc5ade99718a9a74347~tplv-k3u1fbpfcp-watermark.image)

3、将命令路径抛出去

```js
 vim /etc/profile
```
在文件最后面添加
`export PATH=/usr/local/mongodb/bin:$PATH`
再执行一次`source /etc/profile`进行文件重载
即可在不需进入mongodb/bin文件下就可调用mongo、mongod等一系列命令

4、新建文件夹
在mongodb目录下新建一个文件夹命名为data
在data下新建两个文件夹，一个为db,一个为logs，分别用来存储数据库的数据和日志

5、配置文件mongodb.conf
执行`vim mongodb.conf`

插入

```js
# 端口号
port=27017
# 数据库文件位置
dbpath=/usr/local/mongodb/data/db
# 日志文件位置
logpath=/usr/local/mongodb/data/logs/mongodb.log
# 以追加日志的形式记录
logappend=true
# 过滤掉无用日志信息，如果需要调试则改成false
quiet=true
# 以后台方式运行
fork=true
# 最大同时连接数
maxConns=100
# 不启用验证权限
#noauth=true
# 启用用户账号权限
auth=true
# 开启日志，默认true
journal=true
# 提供外网访问，不对ip进行绑定
bind_ip=0.0.0.0
```
进行保存
6、执行`mongod -f /usr/local/mongodb/mongodb.conf`即可在后台启动数据库

7、mongodb进程

```js
 ps aux | grep mongod  // 查看mongod进程
 kill -9 21224 // 杀死进程
```

8、本地mongodb数据库数据导出与远程数据库导入数据
a、 导出

```js
mongoexport -d DB -c test -o D:/data/test.json --type=json
//-d 数据库名 -c 集合名 -o 导出路径，此处为将DB数据库下的test集合导出到D盘data文件夹，保存为test.json
// 需要输入用户名和密码的话
mongoexport -u username -p password -d database_name -c collection_name -o C:\Users\Desktop\collection_name.json --type=json
```
b、上传zip并进行服务器解压

安装压缩及解压工具
`yum install -y unzip zip
`

解压命令（unzip 路径/文件名）
`unzip /usr/local/mongodb/data/db/mongodb.json.zip
`

c、 安装mongodb工具([官网下载](https://www.mongodb.com/try/download/database-tools))
选择这个

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf4521d7d1704bbc9624fbecbde9792c~tplv-k3u1fbpfcp-watermark.image)

下载对应版本后上传服务器解压
`tar -zxvf mongodb-database-tools-amazon-x86_64-100.3.1.tgz
`
把解压后bin目录下的文件全剪切至mongodb/bin目录下，即可使用mongoimport、mongoexport...
d、 导入

```js

mongoimport -d database_name -c collection_name --jsonArray /usr/local/mongodb/mongodb.json/collection_name.json
```
导入完成后可以使用mongo命令进行查看


### 六、node项目连接数据库

连接数据库的代码
```js
// 引入模块
const mongoose = require('mongoose');
// 连接
mongoose.connect('mongodb://localhost/database_name',{ // 默认就好, database_name写自己库的名字
    useNewUrlParser:true,
    useUnifiedTopology:true
})
// 监听数据库连接是否成功
const conn = mongoose.connection;
conn.on('open',function(){
    console.log('数据库连接成功');
})
conn.on('error',function(){
    console.log('数据库连接失败');
})
```
1、压缩node项目 => 上传服务器 => 解压

2、安装依赖

`npm i`

3、安装pm2管理后台

`npm i pm2 -g`

4、pm2 start 你要运行的server文件

执行后即可自动连接数据库

### 七、 安装 nginx

1、添加安装源
`vim /etc/yum.repos.d/nginx.repo
`
写入

```js
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
[nginx-mainline]
name=nginx mainline repo
baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
```
2、 安装nginx

`yum -y install nginx`

3、 编辑nginx配置文件


```js
vim /etc/nginx/nginx.conf
```

插入


```js
 server { 
         # 配置 http
        listen       80;
        listen       [::]:80;
        server_name  persion.cn;
        root         /usr/share/nginx/html;
        #rewrite ^/(.*)$ https://persion.cn:443/$1 permanent; # 有整数后重定向到https安全协议下
        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        error_page 404 /404.html;
        location = /404.html {
        }
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
        }
        location /api { # 匹配转发
            proxy_pass http://127.0.0.1:3030;
            proxy_set_header Host      $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

      }
    # Settings for a TLS enabled server.
    # 配置https
    # 生成证书后最好用https
    server {
       listen       443 ssl;
       listen       [::]:443 ssl;
       server_name  persion.cn;
       root         /usr/share/nginx/html;
       ssl_certificate "/etc/pki/nginx/server.crt"; # 证书文件路径
       ssl_certificate_key "/etc/pki/nginx/server.key"; # 证书密钥路径
       ssl_session_cache shared:SSL:1m;
       ssl_session_timeout  10m;
       ssl_ciphers HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers on;
       # Load configuration files for the default server block.
       include /etc/nginx/default.d/*.conf;
       error_page 404 /404.html;
         location = /40x.html {
       }

       error_page 500 502 503 504 /50x.html;
       location = /50x.html {
       }
     }
# 可以配置多个server,适用于多个域名（也可以是二级域名）
```



一些涉及的linux命令操作

```js
ln -s from_name to_name // 建立软连接
mv from_name to_path // 移动某个文件到某个路径下
pm2 start fork_id // 启动pm2停止的任务
pm2 start path_name // 执行js文件
pm2 stop fork_id // 停止任务
pm2 delete fork_id // 删除任务
pm2 list // 查看任务列表
systemctl stop nginx // 停止nginx服务
systemctl start nginx // 开启nginx服务
systemctl status nginx // 查看nginx服务状态
systemctl reload nginx // 重启nginx服务
nginx -s reload // 重启nginx服务
nginx -t // 查看nginx的配置文件以及状态
nvm --version // 查看nvm的版本
ps -ef | grep xxx // 查看某个进程的pid
netstat -anp | grep pid // 查看某个pid占用的端口号
netstat -ntlp // 列出所有端口占用

```

### 八、 申请ssl证书（阿里云服务器搜索即可，点击免费证书，即可申请）
申请 => 下载 => 上传服务器 => 解压 => 写入配置文件即可

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/941a86dd9d434e3bb4b7fdbcf1ea2523~tplv-k3u1fbpfcp-watermark.image)

### 九、 部署项目
本地新建一个空的node环境的项目，对要上线的项目执行npm run build 即可，把原项目的public删除
，把dist剪切过去， 更改app.js中的静态服务入口，即把`app.use(express.static(path.join(__dirname, 'public')));`, public改为dist即可

vue 项目中的踩坑点
hash模式更改为history之后访问会发生读取js文件错误，只需更改vue.config.js中的publicPath = '/',
把相对路径改为绝对路径
    在nginx配置文件server的location匹配中加入
    
    ` try_files $uri $uri/ /index.html; # 处理vue项目中history刷新发生404问题` 

