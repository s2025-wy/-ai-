import request from '@/utils/request.js'

export default {
    // 获取岗位列表
    getJobList(params = {}) {
        return request.get('/jobs', params)
    },
    
    // 获取岗位详情
    getJobDetail(id) {
        return request.get(`/jobs/${id}`)
    },
    
    // 申请岗位
    applyJob(jobId) {
        return request.post(`/jobs/${jobId}/apply`)
    },
    
    // 收藏岗位
    favoriteJob(jobId) {
        return request.post(`/jobs/${jobId}/favorite`)
    },
    
    // 获取知识图谱
    getJobGraph(jobId) {
        return request.get(`/jobs/${jobId}/graph`)
    }
}
