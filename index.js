/**
 * index.js
 * 程序入口
 */

 //#region 获取依赖
const express = require('express');
const csdn = require('./routes/csdn.js')
//#endregion

const app = express();

app.use(csdn);

app.listen(3000, function() {
    console.log('running in http://127.0.0.1:3000');
});
