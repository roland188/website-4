/**
 * 该文件作用是用来修改 dist/js 目录下的文件,修改所有中文 key 为 crc 加密后的字符
 */

const crc32 = require('crc/crc32')

const fs = require('fs')
const path = require('path')
const resolve = str => path.resolve(__dirname, str)

class KeyToCrc32 {
    // 文件夹路径
    // jsPath = '../../dist/build/h5/static/js'
    jsPath = '../unpackage/dist/build/h5/static/js'
    constructor () {
        this.begin()
    }

    begin() {
        const jsPath = resolve(this.jsPath)
        const arrPaths = fs.readdirSync(jsPath)
        for (const item of arrPaths) {
            if (path.extname(item) === '.js') {
                // 文件路径
                const filePath = path.join(jsPath, item)
                if (filePath.indexOf('elementUI') != -1 || filePath.indexOf('vueUI') != -1) {
                    return;
                }
                // 读取文件内容
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) return console.log(err)
                    
                    const replaceStr = (m, str) => m.replace(str, `k${crc32(str).toString(16)}`)
                    const replacedData =
                    data
                    // 匹配并打印 $t('活动已截止') 或 $t("活动已截止") 格式的字符串
                    .replace(/\$t1?\(['"]([^'"]+)['"],? ?({[^}]+})?\)/g, (match, str)  =>  replaceStr(match, str))

                    // 写入文件
                    fs.writeFile(filePath, replacedData, 'utf8', (err) => {
                        if (err) return console.log(err)
                        console.log(`文件 ${item} 内容已修改！`)
                    })
                })
            }
        }
    }
}

new KeyToCrc32()
