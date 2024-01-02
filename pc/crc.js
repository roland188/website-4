/**
 * 该文件作用是用来修改 dist/js 目录下的文件,修改所有中文 key 为 crc 加密后的字符
 */

// import { crc32 } from 'crc'
const { log } = require('console');
const crc32 = require('crc/crc32');
// const CryptoJS = require('crypto-js');

const fs = require('fs');
const path = require('path');

// 文件夹路径
const folderPath = path.join(__dirname, 'dist/js');

// 读取文件夹
fs.readdir(folderPath, function (err, files) {
    if (err) {
        return console.log(err);
    }

    // 遍历文件夹中的文件
    files.forEach(function (file) {
        // 只处理 JavaScript 文件
        if (path.extname(file) === '.js') {
            // 文件路径
            const filePath = path.join(folderPath, file);
            if (filePath.indexOf('elementUI') != -1 || filePath.indexOf('vueUI') != -1) {
                return;
            }
            console.log("修改文件", filePath);

            // 读取文件内容
            fs.readFile(filePath, 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }

                // 匹配并打印 $t('活动已截止') 或 $t("活动已截止") 格式的字符串
                const regex = /\$t\(['"]([^'"]+)['"],? ?({[^}]+})?\)/g;
                // let match;
                // while ((match = regex.exec(data)) !== null) {

                //     let hashKey = `k${crc32(match[1]).toString(16)}`;
                //     console.log(`匹配到的字符串=${match[1]}, hashKey=${hashKey}`);
                // }

                const replacedData = data.replace(regex, function (match, str, params) {
                    let hashKey = `k${crc32(str).toString(16)}`;
                    console.log(`匹配到的字符串=${str}, hashKey=${hashKey}`);
                    let newStr = match.replace(str, hashKey);
                    return newStr;
                });

                // 写入文件
                fs.writeFile(filePath, replacedData, 'utf8', function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log(`文件 ${file} 内容已修改！`);
                });
            });
        }
    });
});







