<script setup lang="ts">
import { ref, computed } from 'vue'

// 虚拟职业体验数据
const careers = ref([
  {
    id: '1',
    title: '软件工程师',
    description: '负责软件开发、测试和维护',
    tasks: [
      '编写代码实现功能需求',
      '测试软件功能和性能',
      '修复软件中的bug',
      '与团队成员协作开发'
    ],
    skills: ['编程', '问题解决', '团队协作', '学习能力'],
    salary: '10k-30k',
    growth: '高'
  },
  {
    id: '2',
    title: '产品经理',
    description: '负责产品规划和管理',
    tasks: [
      '收集和分析用户需求',
      '制定产品开发计划',
      '协调开发团队工作',
      '监控产品上线后的表现'
    ],
    skills: ['沟通', '分析', '领导力', '创新'],
    salary: '15k-35k',
    growth: '高'
  },
  {
    id: '3',
    title: '数据分析师',
    description: '负责数据分析和可视化',
    tasks: [
      '收集和整理数据',
      '分析数据并提取 insights',
      '制作数据可视化报告',
      '为业务决策提供数据支持'
    ],
    skills: ['数据分析', '统计', '可视化', '业务理解'],
    salary: '12k-25k',
    growth: '中高'
  }
])

const selectedCareer = ref<string | null>(null)
const currentTaskIndex = ref(0)
const taskCompleted = ref<boolean[]>([])

// 职业路径模拟器数据
const careerPathData = ref({
  education: '本科',
  skills: ['编程', '沟通'],
  experience: '1年',
  industry: '互联网'
})

const careerPathPrediction = computed(() => {
  const { education, experience, industry } = careerPathData.value
  let path = []
  
  if (education === '本科') {
    if (experience === '1年') {
      path.push('初级工程师')
      path.push('中级工程师')
      path.push('高级工程师')
      path.push('技术总监')
    } else if (experience === '3年') {
      path.push('中级工程师')
      path.push('高级工程师')
      path.push('技术总监')
      path.push('CTO')
    }
  } else if (education === '硕士') {
    if (experience === '1年') {
      path.push('中级工程师')
      path.push('高级工程师')
      path.push('技术总监')
      path.push('CTO')
    } else if (experience === '3年') {
      path.push('高级工程师')
      path.push('技术总监')
      path.push('CTO')
      path.push('创业者')
    }
  }
  
  return path
})

const selectCareer = (careerId: string) => {
  selectedCareer.value = careerId
  currentTaskIndex.value = 0
  taskCompleted.value = []
}

const completeTask = () => {
  taskCompleted.value.push(true)
  if (currentTaskIndex.value < (getSelectedCareer.value?.tasks.length || 0) - 1) {
    currentTaskIndex.value++
  }
}

const getSelectedCareer = computed(() => {
  return careers.value.find(career => career.id === selectedCareer.value)
})

const addSkill = (skill: string) => {
  if (!careerPathData.value.skills.includes(skill)) {
    careerPathData.value.skills.push(skill)
  }
}

const removeSkill = (skill: string) => {
  careerPathData.value.skills = careerPathData.value.skills.filter(s => s !== skill)
}
</script>

<template>
  <div class="career-simulation">
    <h1 class="page-title">职业模拟</h1>
    
    <div class="simulation-container">
      <!-- 虚拟职业体验 -->
      <div class="simulation-card">
        <h2 class="card-title">
          <i class="card-icon">🎮</i>
          虚拟职业体验
        </h2>
        
        <div class="career-selection" v-if="!selectedCareer">
          <p class="selection-intro">选择一个职业开始体验：</p>
          <div class="career-list">
            <div 
              v-for="career in careers" 
              :key="career.id"
              class="career-card"
              @click="selectCareer(career.id)"
            >
              <h3 class="career-title">{{ career.title }}</h3>
              <p class="career-description">{{ career.description }}</p>
              <div class="career-info">
                <span class="info-item">薪资: {{ career.salary }}</span>
                <span class="info-item">发展: {{ career.growth }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="career-experience" v-else-if="selectedCareer">
          <div class="experience-header">
            <h3 class="experience-title">{{ getSelectedCareer?.title }}</h3>
            <button class="back-btn" @click="selectedCareer = null">返回选择</button>
          </div>
          
          <div class="skills-section">
            <h4>所需技能</h4>
            <div class="skills-list">
              <span 
                v-for="skill in getSelectedCareer?.skills" 
                :key="skill"
                class="skill-tag"
              >
                {{ skill }}
              </span>
            </div>
          </div>
          
          <div class="tasks-section">
            <h4>模拟任务</h4>
            <div class="task-list">
              <div 
                v-for="(task, index) in getSelectedCareer?.tasks" 
                :key="index"
                class="task-item"
                :class="{ completed: taskCompleted[index], active: index === currentTaskIndex }"
              >
                <div class="task-number">{{ index + 1 }}</div>
                <div class="task-content">
                  <p class="task-text">{{ task }}</p>
                  <div class="task-status" v-if="index === currentTaskIndex">
                    <button class="complete-btn" @click="completeTask">完成任务</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="feedback-section" v-if="currentTaskIndex >= (getSelectedCareer?.tasks.length || 0) - 1 && taskCompleted.length === (getSelectedCareer?.tasks.length || 0)">
            <h4>体验反馈</h4>
            <div class="feedback-content">
              <p>恭喜你完成了{{ getSelectedCareer?.title }}的虚拟体验！</p>
              <p>根据你的表现，我们认为你适合这个职业方向。</p>
              <p>建议：继续提升相关技能，为未来的职业发展做好准备。</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 职业路径模拟器 -->
      <div class="simulation-card">
        <h2 class="card-title">
          <i class="card-icon">📈</i>
          职业路径模拟器
        </h2>
        
        <div class="path-params">
          <h4>调整参数</h4>
          <div class="params-grid">
            <div class="param-item">
              <label>教育程度</label>
              <select v-model="careerPathData.education">
                <option value="本科">本科</option>
                <option value="硕士">硕士</option>
                <option value="博士">博士</option>
              </select>
            </div>
            
            <div class="param-item">
              <label>工作经验</label>
              <select v-model="careerPathData.experience">
                <option value="1年">1年</option>
                <option value="3年">3年</option>
                <option value="5年">5年</option>
              </select>
            </div>
            
            <div class="param-item">
              <label>行业</label>
              <select v-model="careerPathData.industry">
                <option value="互联网">互联网</option>
                <option value="金融">金融</option>
                <option value="教育">教育</option>
              </select>
            </div>
            
            <div class="param-item skills-param">
              <label>技能</label>
              <div class="skills-input">
                <span 
                  v-for="skill in careerPathData.skills" 
                  :key="skill"
                  class="skill-tag"
                >
                  {{ skill }}
                  <button class="remove-skill" @click="removeSkill(skill)">×</button>
                </span>
                <div class="add-skill">
                  <button @click="addSkill('编程')">+ 编程</button>
                  <button @click="addSkill('沟通')">+ 沟通</button>
                  <button @click="addSkill('管理')">+ 管理</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="path-result">
          <h4>预测职业路径</h4>
          <div class="path-timeline">
            <div 
              v-for="(stage, index) in careerPathPrediction" 
              :key="index"
              class="path-stage"
            >
              <div class="stage-number">{{ index + 1 }}</div>
              <div class="stage-content">
                <h5 class="stage-title">{{ stage }}</h5>
                <p class="stage-description">
                  {{ index === 0 ? '入门阶段' : index === 1 ? '成长阶段' : index === 2 ? '成熟阶段' : '高级阶段' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.career-simulation {
  padding: 2rem;
  background-color: #f5f7fa;
  min-height: calc(100vh - 4rem);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.simulation-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.simulation-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  transition: all 0.3s ease;
}

.simulation-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-icon {
  font-size: 1.75rem;
}

/* 职业选择 */
.career-selection {
  padding: 1rem 0;
}

.selection-intro {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1.5rem;
}

.career-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.career-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.career-card:hover {
  background: #f0f2f5;
  border-color: #667eea;
  transform: translateX(4px);
}

.career-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
}

.career-description {
  color: #666;
  margin-bottom: 1rem;
}

.career-info {
  display: flex;
  gap: 1.5rem;
  font-size: 0.9rem;
  color: #888;
}

/* 职业体验 */
.career-experience {
  padding: 1rem 0;
}

.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.experience-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
}

.back-btn {
  background: #f0f2f5;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.back-btn:hover {
  background: #e0e2e5;
}

.skills-section {
  margin-bottom: 2rem;
}

.skills-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-tag {
  background: #e3e7ff;
  color: #667eea;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.remove-skill {
  background: none;
  border: none;
  color: #667eea;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.tasks-section {
  margin-bottom: 2rem;
}

.tasks-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f8f9fa;
  border-left: 4px solid #e0e0e0;
  transition: all 0.3s ease;
}

.task-item.active {
  background: #e3e7ff;
  border-left-color: #667eea;
}

.task-item.completed {
  background: #e8f5e9;
  border-left-color: #4caf50;
  opacity: 0.8;
}

.task-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  flex-shrink: 0;
}

.task-item.active .task-number {
  background: #667eea;
  color: white;
}

.task-item.completed .task-number {
  background: #4caf50;
  color: white;
}

.task-content {
  flex: 1;
}

.task-text {
  margin: 0 0 0.75rem 0;
  color: #333;
}

.complete-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.complete-btn:hover {
  background: #5a6fd8;
  transform: translateY(-1px);
}

.feedback-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #e8f5e9;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.feedback-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.feedback-content p {
  margin: 0.5rem 0;
  color: #333;
}

/* 职业路径模拟器 */
.path-params {
  margin-bottom: 2rem;
}

.path-params h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.params-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.param-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.param-item label {
  font-size: 0.95rem;
  font-weight: 500;
  color: #666;
}

.param-item select {
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
}

.param-item select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.skills-input {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.add-skill {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.add-skill button {
  background: #f0f2f5;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.add-skill button:hover {
  background: #e0e2e5;
}

.path-result {
  margin-top: 2rem;
}

.path-result h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.path-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.path-stage {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f8f9fa;
  position: relative;
}

.path-stage:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 11px;
  top: 100%;
  width: 2px;
  height: 1rem;
  background: #e0e0e0;
}

.stage-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  flex-shrink: 0;
  z-index: 1;
}

.stage-content {
  flex: 1;
}

.stage-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.25rem 0;
}

.stage-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .simulation-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .career-simulation {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .simulation-card {
    padding: 1.5rem;
  }
  
  .card-title {
    font-size: 1.25rem;
  }
}
</style>