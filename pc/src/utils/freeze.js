import api from './api.js';
import http from './http.js';
import common from './common.js';
export default {
    freeze() {
        let memberId = common.getUser() ? common.getUser().user_id : ''
        return http.get(api.getCenterWallet, memberId).then(res => {
            if (res.data.status === 0) {
                return false
            } else if (res.data.status === 1) {
                return true
            }
        })
    }
}