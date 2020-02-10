/**
 * csdn.js
 * 获取某人csdn的原创文章
 */

 //#region 获取依赖
const cheerio = require('cheerio');
const superagent = require('superagent');
const express = require('express');
const eventproxy = require('eventproxy');
//#endregion

const router = express.Router();
const ep = new eventproxy();

router.get('/csdn/:name', function (req, res) {
    let name = req.params.name; // 用户账号

    getArticleNum(`https://blog.csdn.net/${name}`, function (num) {
        let articleData = []; // 保存所有文章数据
        let pages = []; // 保存要抓取的页面

        let pageNum = Math.ceil(num / 40); // 计算一共有多少页面

        for (let i = 1; i <= pageNum; i++) {
            pages.push(`https://blog.csdn.net/${name}/article/list/${i}?t=1`);
        }

        // 获取所有页面的文章信息
        pages.forEach(function (targetUrl) {
            superagent.get(targetUrl).end(function (err, html) {
                if (err) {
                    console.log(`err $err}`);
                }
                let $ = cheerio.load(html.text);

                let articlesHtml = $('.article-list .article-item-box'); // 当前页面的文章列表

                for (let i = 0; i < articlesHtml.length; i++) {
                    let article = analysisHtml(articlesHtml, i);
                    articleData.push(article);

                    ep.emit('blogArtc', article); // 管理异步操作
                }
            });
        });

        // 异步读取完后发送响应
        ep.after('blogArtc', num, function (data) {
            res.json({
                status_code: 0,
                data: data
            });
        });
    });
});

/**
 * 读取页面
 * @param {String} url 解析路径
 */
let getArticleNum = function (url, callback) {
    superagent.get(url).end(function (err, html) {
        if (err) {
            console.log(`err = ${err}`);
        }
        let $ = cheerio.load(html.text);
        let num = parseInt($('.data-info dl').first().attr('title'));

        callback(num);
    });
};

/**
 * 解析html字符串，获取文章信息
 * @param {String} html 包含文章的html
 */
let analysisHtml = function (html, index) {
    return {
        id: html.eq(index).attr('data-articleid'),
        article_type: html.eq(index).find('h4 a').children().text(),
        title: html.eq(index).find('h4 a').text().replace(/\s+/g, '').slice(2),
        link: html.eq(index).find('a').attr('href'),
        abstract: html.eq(index).find('.content a').text().replace(/\s+/g, ''),
        shared_time: html.eq(index).find('.info-box .date').text().replace(/\s+/, ''),
        read_count: html.eq(index).find('.info-box .read-num .num').first().text().replace(/\s+/, ''),
        comment_count: html.eq(index).find('.info-box .read-num .num').last().text().replace(/\s+/, '')
    };
};

module.exports = router;
