import request from '@/utils/request.js'

export default {
    // 获取学生画像
    getProfile() {
        return request.get('/student/profile')
    },
    
    // 更新学生画像
    updateProfile(data) {
        return request.put('/student/profile', data)
    },
    
    // 上传简历
    uploadResume(filePath) {
        return request.upload('/student/resume', filePath)
    },
    
    // 获取能力雷达图
    getAbilityRadar() {
        return request.get('/student/ability-radar')
    }
}
