import request from '@/utils/request.js'

export default {
    sendMessage(userId, message) {
        return request.post('/agent/send-message', null, {
            params: {
                user_id: userId,
                message: message
            }
        })
    }
}
