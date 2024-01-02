const fs = require('fs');
const path = require('path')
const XLSX = require('xlsx');

const resolve = str => path.resolve(__dirname, str)

class ToExcel {
  jsonPath = './json'
  outputPath = resolve('new88-h5.xlsx')
  sheetName = 'translate'
  constructor() {
    this.toExcel()
  }
  getJsonFile() {
    const jsons = fs.readdirSync(resolve(this.jsonPath)).reverse()
    const arr = []
    const data = {}
    const getFileName = fileName => fileName.split('.')[0]
    jsons.map((fileName) => {
      const name = getFileName(fileName)
      const filePath = `${this.jsonPath}/${fileName}`
      const file = fs.readFileSync(resolve(filePath)).toString('utf-8')
      const json = JSON.parse(file)
      data[name] = json
    })
    const first = data[getFileName(jsons[0])]
    for (const key in first) {
      const row = { key }
      jsons.forEach((fileName) => {
        const name = getFileName(fileName)
        const json = data[name]
        row[name] = json[key].replace(/\n/g, '\r\n') // 处理换行符，将'\n'替换为Excel可识别的'\r\n'
        // row[name] = json[key]
      })
      arr.push(row)
    }
    console.log('data from jsons =====', jsons, resolve(this.jsonPath))
    return arr
  }
  toExcel() {
    console.log('i18n json to excel begin =====')
    const worksheet = XLSX.utils.json_to_sheet(this.getJsonFile(), {
      raw: false,
      cellDates: true,
      cellStyles: true,
      bookVBA: true,
      dateNF: 'yyyy-mm-ddTHH:mm:ss.SSSZ', // 设置日期格式
    });
    const workbook = XLSX.utils.book_new()
    // 在Excel中自动换行的设置
    for (let cell in worksheet) {
      if (worksheet[cell].t === 's') {
        worksheet[cell].s = {
          wrapText: true,
          alignment: {
            wrapText: true,
          },
        }
      }
    }
    XLSX.utils.book_append_sheet(workbook, worksheet, this.sheetName)
    XLSX.writeFile(workbook, this.outputPath)
    console.log('output path ===== ', this.outputPath)
    console.log('done =====')
  }
}
new ToExcel()