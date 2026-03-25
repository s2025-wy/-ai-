import request from '@/utils/request.js'

export default {
    // 获取验证码
    getCaptcha() {
        return uni.request({
            url: 'http://localhost:8000/auth/captcha',
            method: 'GET',
            responseType: 'arraybuffer'
        })
    },
    
    // 登录
    login(username, password, captcha, captchaId) {
        return request.post('/auth/login', {
            username,
            password,
            captcha,
            captchaId
        })
    },
    
    // 注册
    register(userData) {
        return request.post('/auth/register', userData)
    },
    
    // 退出登录
    logout() {
        return request.post('/auth/logout')
    },
    
    // 获取当前用户信息
    getCurrentUser() {
        return request.get('/auth/me')
    }
}
