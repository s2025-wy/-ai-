"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      paths: [
        {
          name: "前端开发工程师",
          match: "92% 匹配",
          desc: "基于你的技能和兴趣，前端开发是最适合你的发展方向",
          color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          steps: ["初级前端", "中级前端", "高级前端", "技术专家"]
        },
        {
          name: "全栈开发工程师",
          match: "85% 匹配",
          desc: "扩展你的技术栈，成为具备全栈能力的开发者",
          color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          steps: ["前端基础", "后端学习", "全栈实践", "架构设计"]
        }
      ],
      stages: [
        {
          title: "入门阶段",
          time: "0-6个月",
          desc: "掌握基础技能，完成基础项目"
        },
        {
          title: "成长阶段",
          time: "6-18个月",
          desc: "深入学习核心技术，参与复杂项目"
        },
        {
          title: "成熟阶段",
          time: "18-36个月",
          desc: "具备独立解决问题能力，成为技术骨干"
        }
      ],
      skills: [
        { name: "Vue.js", progress: 85, color: "#667eea" },
        { name: "React", progress: 70, color: "#61dafb" },
        { name: "JavaScript", progress: 90, color: "#f7df1e" },
        { name: "TypeScript", progress: 75, color: "#3178c6" }
      ]
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.paths, (path, index, i0) => {
      return {
        a: common_vendor.t(path.name),
        b: common_vendor.t(path.match),
        c: path.color,
        d: common_vendor.t(path.desc),
        e: common_vendor.f(path.steps, (step, i, i1) => {
          return {
            a: common_vendor.t(step),
            b: i
          };
        }),
        f: index
      };
    }),
    b: common_vendor.f($data.stages, (stage, index, i0) => {
      return {
        a: common_vendor.t(stage.title),
        b: common_vendor.t(stage.time),
        c: common_vendor.t(stage.desc),
        d: index
      };
    }),
    c: common_vendor.f($data.skills, (skill, index, i0) => {
      return {
        a: common_vendor.t(skill.name),
        b: skill.progress + "%",
        c: skill.color,
        d: common_vendor.t(skill.progress),
        e: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f0b5c96f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/career-plan/career-plan.js.map
