<!--
行动计划组件

技术特点：
- 任务状态管理
- 响应式布局
- 交互操作功能
-->

<template>
  <div class="action-plan">
    <h3 class="plan-title">行动计划</h3>
    <div class="plan-tabs">
      <button 
        v-for="type in planTypes" 
        :key="type.value"
        class="plan-tab"
        :class="{ active: activePlanType === type.value }"
        @click="activePlanType = type.value as 'short' | 'medium' | 'long'"
      >
        {{ type.label }}
      </button>
    </div>
    
    <div class="plan-content">
      <div 
        v-for="plan in filteredPlans" 
        :key="plan.id"
        class="plan-card"
      >
        <div class="plan-header">
          <h4 class="plan-name">{{ plan.title }}</h4>
          <span class="plan-duration">{{ plan.duration }}</span>
        </div>
        <div class="plan-tasks">
          <div 
            v-for="task in plan.tasks" 
            :key="task.id"
            class="task-item"
            :class="{ completed: task.completed }"
          >
            <input 
              type="checkbox" 
              :checked="task.completed"
              @change="toggleTask(plan.id, task.id)"
            />
            <span class="task-text">{{ task.text }}</span>
            <button 
              class="delete-task"
              @click="removeTask(plan.id, task.id)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="add-task">
            <input 
              v-model="newTaskText"
              @keyup.enter="addTask(plan.id)"
              placeholder="添加新任务..."
              class="task-input"
            />
            <button 
              class="add-btn"
              @click="addTask(plan.id)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCareerStore } from '@/stores/career'

const careerStore = useCareerStore()
const activePlanType = ref<'short' | 'medium' | 'long'>('short')
const newTaskText = ref('')

const planTypes = [
  { label: '短期计划', value: 'short' },
  { label: '中期计划', value: 'medium' },
  { label: '长期计划', value: 'long' }
]

const filteredPlans = computed(() => {
  return careerStore.actionPlans.filter(plan => plan.type === activePlanType.value)
})

const addTask = (planId: string) => {
  if (newTaskText.value.trim()) {
    careerStore.addTask(planId, newTaskText.value.trim())
    newTaskText.value = ''
  }
}

const toggleTask = (planId: string, taskId: string) => {
  careerStore.toggleTaskCompletion(planId, taskId)
}

const removeTask = (planId: string, taskId: string) => {
  careerStore.removeTask(planId, taskId)
}
</script>

<style scoped>
.action-plan {
  width: 100%;
}

.plan-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
}

.plan-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: #f9f9f9;
  padding: 0.5rem;
  border-radius: 12px;
}

.plan-tab {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.plan-tab.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.plan-tab:hover:not(.active) {
  background: rgba(0, 0, 0, 0.05);
}

.plan-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.plan-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.plan-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.plan-duration {
  font-size: 0.85rem;
  color: #667eea;
  font-weight: 600;
  background: #f0f4ff;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.plan-tasks {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.task-item.completed {
  background: #f0f9ff;
  opacity: 0.8;
}

.task-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.task-text {
  flex: 1;
  color: #333;
  font-size: 0.95rem;
}

.task-item.completed .task-text {
  text-decoration: line-through;
  color: #999;
}

.delete-task {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.delete-task:hover {
  background: #fef2f2;
}

.add-task {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.task-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.task-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .plan-tabs {
    flex-direction: column;
  }
  
  .plan-card {
    padding: 1rem;
  }
  
  .add-task {
    flex-direction: column;
  }
}
</style>
