# node-spider-blog

这是一个非常垃圾的爬虫，用来获取博客文章

## 目录结构

```shell
node-spider-blog
├─ .gitignore
├─ node_modules
├─ README.md
├─ index.js
├─ package-lock.json
├─ package.json
└─ routes
   └─ csdn.js
```

## 功能

- 目前只能获得CSDN文章
- 准备添加获取博客园文章模块

## 依赖

- express
- cheerio
- superagent
- eventproxy

## 运行

- 安装node.js
- 执行`npm i`
- 执行`node index.js`

## API文档

### 路由

`/csdn/id` id为csdn的用户id

### 格式

```
{
    status_code: 0,
    data:[
        {
            id: "123456",
            article_type: "原创",
            title: "标题",
            link: "文章连接",
            abstract: "文章概要",
            shared_time: "发布时间",
            read_count: "阅读数量",
            comment_count: "评论数量"
        },
        ...
    ]
}
```