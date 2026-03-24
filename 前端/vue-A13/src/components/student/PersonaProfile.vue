<template>
  <div class="persona-profile">
    <h3 class="profile-title">个人画像</h3>
    
    <!-- 基本信息 -->
    <div class="profile-section">
      <h4 class="section-title">
        <span class="section-icon">👤</span>
        基本信息
      </h4>
      <div class="info-grid">
        <div class="info-card">
          <span class="info-label">姓名</span>
          <span class="info-value">{{ basicInfo.name || '待完善' }}</span>
        </div>
        <div class="info-card">
          <span class="info-label">性别</span>
          <span class="info-value">{{ basicInfo.gender || '待完善' }}</span>
        </div>
        <div class="info-card">
          <span class="info-label">年龄</span>
          <span class="info-value">{{ basicInfo.age || '待完善' }}</span>
        </div>
        <div class="info-card">
          <span class="info-label">邮箱</span>
          <span class="info-value">{{ basicInfo.email || '待完善' }}</span>
        </div>
        <div class="info-card">
          <span class="info-label">电话</span>
          <span class="info-value">{{ basicInfo.phone || '待完善' }}</span>
        </div>
        <div class="info-card">
          <span class="info-label">所在城市</span>
          <span class="info-value">{{ basicInfo.city || '待完善' }}</span>
        </div>
      </div>
    </div>

    <!-- 教育背景 -->
    <div class="profile-section">
      <h4 class="section-title">
        <span class="section-icon">🎓</span>
        教育背景
      </h4>
      <div class="timeline">
        <div v-for="(edu, index) in educationList" :key="index" class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <span class="school-name">{{ edu.school || '待完善' }}</span>
              <span class="edu-period">{{ edu.period || '' }}</span>
            </div>
            <div class="timeline-body">
              <span class="degree">{{ edu.degree || '' }}</span>
              <span class="major">{{ edu.major || '' }}</span>
            </div>
          </div>
        </div>
        <div v-if="educationList.length === 0" class="empty-state">
          暂无教育背景信息
        </div>
      </div>
    </div>

    <!-- 工作经历 -->
    <div class="profile-section">
      <h4 class="section-title">
        <span class="section-icon">💼</span>
        工作经历
      </h4>
      <div class="timeline">
        <div v-for="(work, index) in workExperienceList" :key="index" class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <span class="company-name">{{ work.company || '待完善' }}</span>
              <span class="work-period">{{ work.period || '' }}</span>
            </div>
            <div class="timeline-body">
              <span class="position">{{ work.position || '' }}</span>
            </div>
            <div class="work-description" v-if="work.description">
              {{ work.description }}
            </div>
          </div>
        </div>
        <div v-if="workExperienceList.length === 0" class="empty-state">
          暂无工作经历信息
        </div>
      </div>
    </div>

    <!-- 专业技能 -->
    <div class="profile-section">
      <h4 class="section-title">
        <span class="section-icon">⚡</span>
        专业技能
      </h4>
      <div class="skills-container">
        <div v-for="(skill, index) in skillsList" :key="index" class="skill-tag">
          <span class="skill-name">{{ skill.name || skill }}</span>
          <div class="skill-level-bar">
            <div class="skill-level-fill" :style="{ width: (skill.level || 80) + '%' }"></div>
          </div>
        </div>
        <div v-if="skillsList.length === 0" class="empty-state">
          暂无技能信息
        </div>
      </div>
    </div>

    <!-- 项目经验 -->
    <div class="profile-section">
      <h4 class="section-title">
        <span class="section-icon">🚀</span>
        项目经验
      </h4>
      <div class="projects-grid">
        <div v-for="(project, index) in projectList" :key="index" class="project-card">
          <div class="project-header">
            <span class="project-name">{{ project.name || '待完善' }}</span>
            <span class="project-role">{{ project.role || '' }}</span>
          </div>
          <div class="project-desc">{{ project.description || '' }}</div>
          <div class="project-techs">
            <span v-for="(tech, i) in project.technologies" :key="i" class="tech-tag">
              {{ tech }}
            </span>
          </div>
        </div>
        <div v-if="projectList.length === 0" class="empty-state">
          暂无项目经验信息
        </div>
      </div>
    </div>

    <!-- 个人特质与性格特点 -->
    <div class="profile-section">
      <h4 class="section-title">
        <span class="section-icon">🌟</span>
        个人特质与性格特点
      </h4>
      <div class="traits-container">
        <div v-for="(trait, index) in personalityTraits" :key="index" class="trait-card">
          <div class="trait-icon">{{ trait.icon }}</div>
          <div class="trait-info">
            <span class="trait-name">{{ trait.name }}</span>
            <span class="trait-desc">{{ trait.description }}</span>
          </div>
          <div class="trait-score">
            <div class="score-bar">
              <div class="score-fill" :style="{ width: trait.score + '%' }"></div>
            </div>
            <span class="score-text">{{ trait.score }}%</span>
          </div>
        </div>
        <div v-if="personalityTraits.length === 0" class="empty-state">
          暂无性格特质信息
        </div>
      </div>
    </div>

    <!-- 职业目标 -->
    <div class="profile-section">
      <h4 class="section-title">
        <span class="section-icon">🎯</span>
        职业目标
      </h4>
      <div class="career-goals">
        <div class="goal-card">
          <span class="goal-label">短期目标</span>
          <span class="goal-text">{{ careerGoals.shortTerm || '待确定' }}</span>
        </div>
        <div class="goal-card">
          <span class="goal-label">中长期目标</span>
          <span class="goal-text">{{ careerGoals.longTerm || '待确定' }}</span>
        </div>
      </div>
    </div>

    <!-- 能力评估摘要 -->
    <div class="profile-section ability-summary">
      <h4 class="section-title">
        <span class="section-icon">📊</span>
        能力评估摘要
      </h4>
      <div class="ability-overview">
        <div class="ability-radar-mini">
          <div class="radar-chart" ref="radarChartRef"></div>
        </div>
        <div class="ability-list">
          <div v-for="(ability, index) in abilitySummary" :key="index" class="ability-item">
            <span class="ability-name">{{ ability.name }}</span>
            <div class="ability-bar">
              <div class="ability-fill" :style="{ width: ability.score + '%' }"></div>
            </div>
            <span class="ability-score">{{ ability.score }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  resumeData?: any
}>()

const radarChartRef = ref<HTMLElement | null>(null)
let radarChart: echarts.ECharts | null = null

const basicInfo = computed(() => {
  if (props.resumeData) {
    // 检查是否有basic_info字段
    if (props.resumeData.basic_info) {
      return {
        name: props.resumeData.basic_info.name || '',
        gender: props.resumeData.basic_info.gender || '',
        age: props.resumeData.basic_info.age || '',
        email: props.resumeData.basic_info.email || '',
        phone: props.resumeData.basic_info.phone || '',
        city: props.resumeData.basic_info.city || ''
      }
    }
    // 兼容旧格式
    return {
      name: props.resumeData.name || '',
      gender: props.resumeData.gender || '',
      age: props.resumeData.age || '',
      email: props.resumeData.email || '',
      phone: props.resumeData.phone || '',
      city: props.resumeData.city || ''
    }
  }
  return {
    name: '',
    gender: '',
    age: '',
    email: '',
    phone: '',
    city: ''
  }
})

const educationList = computed(() => {
  if (props.resumeData && props.resumeData.education) {
    const edu = props.resumeData.education
    if (Array.isArray(edu)) {
      return edu
    } else if (typeof edu === 'object') {
      return [edu]
    }
  }
  return []
})

const workExperienceList = computed(() => {
  if (props.resumeData && props.resumeData.work_experience) {
    const exp = props.resumeData.work_experience
    if (Array.isArray(exp)) {
      return exp
    } else if (typeof exp === 'object') {
      return [exp]
    }
  }
  return []
})

const skillsList = computed(() => {
  if (props.resumeData && props.resumeData.skills) {
    const skills = props.resumeData.skills
    if (Array.isArray(skills)) {
      return skills.map((s: any) => typeof s === 'string' ? { name: s, level: 80 } : s)
    }
  }
  return []
})

const projectList = computed(() => {
  if (props.resumeData) {
    // 检查是否有projects字段
    if (props.resumeData.projects) {
      return props.resumeData.projects
    }
    // 兼容旧格式
    return []
  }
  return []
})

const personalityTraits = ref([
  { name: '责任心', description: '对工作认真负责，注重细节', icon: '🎯', score: 85 },
  { name: '执行力', description: '能够高效完成既定目标', icon: '💪', score: 80 },
  { name: '团队协作', description: '善于与他人合作沟通', icon: '🤝', score: 88 },
  { name: '创新思维', description: '具备独立思考和创新能力', icon: '💡', score: 75 },
  { name: '学习能力', description: '快速掌握新知识技能', icon: '📚', score: 82 },
  { name: '抗压能力', description: '能够在压力下保持冷静', icon: '🛡️', score: 78 }
])

const careerGoals = computed(() => {
  if (props.resumeData) {
    // 检查是否有career_goals字段
    if (props.resumeData.career_goals) {
      const goals = props.resumeData.career_goals
      if (typeof goals === 'object') {
        return goals
      } else if (typeof goals === 'string') {
        // 如果是字符串，作为短期目标
        return {
          shortTerm: goals,
          longTerm: ''
        }
      }
    }
    // 兼容旧格式
    return {
      shortTerm: '',
      longTerm: ''
    }
  }
  return {
    shortTerm: '',
    longTerm: ''
  }
})

const abilitySummary = ref([
  { name: '专业技能', score: 76 },
  { name: '学习能力', score: 74 },
  { name: '沟通能力', score: 74 },
  { name: '抗压能力', score: 74 },
  { name: '创新能力', score: 79 },
  { name: '团队协作', score: 80 }
])

const initRadarChart = () => {
  if (radarChartRef.value) {
    radarChart = echarts.init(radarChartRef.value)
    
    const option = {
      radar: {
        indicator: abilitySummary.value.map(a => ({ name: a.name, max: 100 })),
        radius: '60%',
        splitNumber: 5,
        axisName: {
          color: '#666',
          fontSize: 10
        },
        splitLine: {
          lineStyle: {
            color: '#e0e0e0'
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['#f8f9fa', '#fff']
          }
        },
        axisTick: {
          show: true
        },
        axisLine: {
          lineStyle: {
            color: '#ccc'
          }
        }
      },
      series: [{
        type: 'radar',
        data: [{
          value: abilitySummary.value.map(a => a.score),
          name: '能力评估',
          areaStyle: {
            color: 'rgba(102, 126, 234, 0.3)'
          },
          lineStyle: {
            color: '#667eea',
            width: 2
          },
          itemStyle: {
            color: '#667eea'
          }
        }]
      }]
    }
    
    radarChart.setOption(option)
  }
}

onMounted(() => {
  initRadarChart()
})

watch(() => props.resumeData, () => {
  initRadarChart()
}, { deep: true })
</script>

<style scoped>
.persona-profile {
  width: 100%;
}

.profile-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
}

.profile-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a237e;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.section-icon {
  font-size: 1.2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.info-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.info-label {
  font-size: 0.85rem;
  color: #666;
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.timeline {
  position: relative;
  padding-left: 1.5rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #667eea, #764ba2);
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
}

.timeline-dot {
  position: absolute;
  left: -1.35rem;
  top: 0.25rem;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #667eea;
  border: 2px solid white;
  box-shadow: 0 0 0 2px #667eea;
}

.timeline-content {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.school-name, .company-name {
  font-weight: 600;
  color: #333;
}

.edu-period, .work-period {
  font-size: 0.85rem;
  color: #666;
}

.timeline-body {
  display: flex;
  gap: 1rem;
  color: #555;
  font-size: 0.95rem;
}

.work-description {
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-tag {
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.skill-name {
  font-weight: 500;
  color: #333;
}

.skill-level-bar {
  width: 60px;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.skill-level-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.project-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.project-name {
  font-weight: 600;
  color: #333;
}

.project-role {
  font-size: 0.85rem;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.project-desc {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.project-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  font-size: 0.8rem;
  color: #555;
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.traits-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.trait-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.trait-icon {
  font-size: 1.5rem;
}

.trait-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.trait-name {
  font-weight: 600;
  color: #333;
}

.trait-desc {
  font-size: 0.85rem;
  color: #666;
}

.trait-score {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.score-bar {
  width: 60px;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 3px;
}

.score-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #667eea;
}

.career-goals {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.goal-card {
  background: white;
  padding: 1.25rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  border-left: 4px solid #667eea;
}

.goal-label {
  font-size: 0.85rem;
  color: #666;
}

.goal-text {
  font-weight: 600;
  color: #333;
}

.ability-summary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.ability-summary .section-title {
  color: white;
}

.ability-overview {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  align-items: center;
}

.ability-radar-mini {
  background: white;
  border-radius: 8px;
  padding: 1rem;
}

.radar-chart {
  width: 100%;
  height: 180px;
}

.ability-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.ability-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255,255,255,0.2);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
}

.ability-name {
  font-size: 0.9rem;
  color: white;
  min-width: 60px;
}

.ability-bar {
  flex: 1;
  height: 8px;
  background: rgba(255,255,255,0.3);
  border-radius: 4px;
  overflow: hidden;
}

.ability-fill {
  height: 100%;
  background: white;
  border-radius: 4px;
}

.ability-score {
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  min-width: 30px;
  text-align: right;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-style: italic;
}

@media (max-width: 768px) {
  .ability-overview {
    grid-template-columns: 1fr;
  }
  
  .ability-radar-mini {
    max-width: 200px;
    margin: 0 auto;
  }
  
  .ability-list {
    grid-template-columns: 1fr;
  }
}
</style>
