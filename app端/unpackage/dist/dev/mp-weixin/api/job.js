"use strict";
const utils_request = require("../utils/request.js");
const jobApi = {
  // 获取岗位列表
  getJobList(params = {}) {
    return utils_request.request.get("/jobs", params);
  },
  // 获取岗位详情
  getJobDetail(id) {
    return utils_request.request.get(`/jobs/${id}`);
  },
  // 申请岗位
  applyJob(jobId) {
    return utils_request.request.post(`/jobs/${jobId}/apply`);
  },
  // 收藏岗位
  favoriteJob(jobId) {
    return utils_request.request.post(`/jobs/${jobId}/favorite`);
  },
  // 获取知识图谱
  getJobGraph(jobId) {
    return utils_request.request.get(`/jobs/${jobId}/graph`);
  }
};
exports.jobApi = jobApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/job.js.map
