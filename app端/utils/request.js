const BASE_URL = 'http://localhost:8000'

// 请求拦截器
function requestInterceptor(options) {
    const token = uni.getStorageSync('token')
    
    // 对登录和注册请求不添加token
    const url = options.url || ''
    const isAuthRequest = url.includes('/auth/login') || url.includes('/auth/register')
    
    options.header = options.header || {}
    
    if (token && !isAuthRequest) {
        options.header.Authorization = `Bearer ${token}`
    }
    
    options.header['Content-Type'] = 'application/json'
    
    return options
}

// 响应拦截器
function responseInterceptor(response, options) {
    const { statusCode, data } = response
    const url = options.url || ''
    const isLoginRequest = url.includes('/auth/login')
    
    if (statusCode >= 200 && statusCode < 300) {
        return data
    }
    
    // 处理错误
    if (statusCode === 401 && !isLoginRequest) {
        uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none'
        })
        uni.removeStorageSync('token')
        uni.removeStorageSync('user')
        setTimeout(() => {
            uni.reLaunch({
                url: '/pages/login/login'
            })
        }, 1500)
    } else if (statusCode === 403) {
        uni.showToast({
            title: '没有权限执行此操作',
            icon: 'none'
        })
    } else if (statusCode === 404) {
        uni.showToast({
            title: '请求的资源不存在',
            icon: 'none'
        })
    } else if (statusCode === 500) {
        uni.showToast({
            title: '服务器内部错误',
            icon: 'none'
        })
    }
    
    return Promise.reject(response)
}

// 封装uni.request
function request(options) {
    return new Promise((resolve, reject) => {
        const finalOptions = requestInterceptor({
            ...options,
            url: BASE_URL + options.url
        })
        
        uni.request({
            ...finalOptions,
            success: (res) => {
                try {
                    const result = responseInterceptor(res, finalOptions)
                    resolve(result)
                } catch (err) {
                    reject(err)
                }
            },
            fail: (err) => {
                uni.showToast({
                    title: '网络错误，请检查后端服务是否启动',
                    icon: 'none'
                })
                reject(err)
            }
        })
    })
}

export default {
    get(url, data = {}, options = {}) {
        return request({
            url,
            method: 'GET',
            data,
            ...options
        })
    },
    
    post(url, data = {}, options = {}) {
        return request({
            url,
            method: 'POST',
            data,
            ...options
        })
    },
    
    put(url, data = {}, options = {}) {
        return request({
            url,
            method: 'PUT',
            data,
            ...options
        })
    },
    
    delete(url, data = {}, options = {}) {
        return request({
            url,
            method: 'DELETE',
            data,
            ...options
        })
    },
    
    upload(url, filePath, formData = {}, options = {}) {
        return new Promise((resolve, reject) => {
            const token = uni.getStorageSync('token')
            
            uni.uploadFile({
                url: BASE_URL + url,
                filePath,
                name: 'file',
                formData,
                header: {
                    'Authorization': token ? `Bearer ${token}` : ''
                },
                success: (res) => {
                    try {
                        const data = JSON.parse(res.data)
                        resolve(data)
                    } catch (err) {
                        resolve(res.data)
                    }
                },
                fail: reject
            })
        })
    }
}
