let i18n = { $t: (str) => str }
try {
    i18n = require('../../../i18n')
} catch(e) {}

export default i18n