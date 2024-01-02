const fs = require('fs')
const XLSX = require('xlsx')

const path = require('path')
const resolve = str => path.resolve(__dirname, str)

class ExcelToJson {
  excelPath = './new88-h5.xlsx'
  outputPath = './json'
  constructor() {
    this.toJson()
  }
  getExcel() {
    const workbook = XLSX.readFile(resolve(this.excelPath))
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet)
    return data
  }
  getDefaultJson() {
    const jsons = {}
    const jsonDirs = fs.readdirSync(resolve(this.outputPath))
    for(const path of jsonDirs) {
      const json = require(resolve(`${this.outputPath}/${path}`))
      const key = path.split('.')[0]
      jsons[key] = json
    }
    return jsons
  }
  toJson() {
    console.log('begin excel to json =====')
    const data = this.getExcel()
    const jsons = this.getDefaultJson()
    data.forEach(o => {
      const { key: oKey } = o
      for (let [key, val] of Object.entries(o)) {
        if (key !== 'key') {
          val = val.replace(/\r/g, '') // 还原换行符的设置
          if (val && jsons[key] && jsons[key][oKey]) {
            jsons[key][oKey] = val
          }
        }
      }
    })
    console.log('export json =====', Object.keys(jsons))
    for (const [fileName, val] of Object.entries(jsons)) {
      const path = `${resolve(this.outputPath)}/${fileName}.json`
      fs.writeFileSync(path, JSON.stringify(val, null, 2), 'utf-8')
    }
    console.log('output dir path =====', resolve(this.outputPath))
    console.log('done ====')
  }
}

new ExcelToJson()