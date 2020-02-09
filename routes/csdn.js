const cheerio = require('cheerio');
const superagent = require('superagent');
const express = require('express');

const router = express.Router();

router.get('/csdn/:name', function (req, res) {
    let name = req.params.name;

    getPageNum(name, function (num) {
        for (let index = 1; index <= num; index++) {
            let targetUrl = `https://blog.csdn.net/${name}/article/list/${index}`;
            console.log(targetUrl);
            superagent.get(targetUrl).end(function (err, html) {
                if (err) {
                    console.log('抓取失败');
                }

                data.push(getArticle(html))

                res.status(200).json({
                    status: 0,
                    data: data
                });
            });
        }
    });
});

// 解析html字符串，获取文章信息
let getArticle = function (res) {
    let $ = cheerio.load(res.text);
    let data = [];

    $('.article-list .article-item-box').each(function (i, elem) {
        data.push({
            id: $(elem).attr('data-articleid'),
            article_type: $(elem).find('h4 a').children().text(),
            title: $(elem).find('h4 a').text().replace(/\s+/g, '').slice(2),
            link: $(elem).find('a').attr('href'),
            abstract: $(elem).find('.content a').text().replace(/\s+/g, ''),
            shared_time: $(elem).find('.info-box .date').text().replace(/\s+/, ''),
            read_count: $(elem).find('.info-box .read-num .num').first().text().replace(/\s+/, ''),
            comment_count: $(elem).find('.info-box .read-num .num').last().text().replace(/\s+/, '')
        });
    });

    return data;
}

// csdn的分页是js生成的，无法直接获得
// 从主页获取文章总数后计算分页
let getPageNum = function (name, callback) {
    let url = `https://me.csdn.net/${name}`;
    superagent.get(url).end(function (err, res) {
        if (err) {
            console.log('分页获取失败');
        }
        // console.log(res.text)
        let $ = cheerio.load(res.text);
        let num = parseInt($('.me_chanel_bar .tab_item .count').text());
        num = Math.ceil(num / 40);
        callback(num);
    });
}

module.exports = router;
