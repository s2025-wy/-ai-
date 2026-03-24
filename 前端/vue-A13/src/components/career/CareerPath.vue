<!--
职业发展路径组件

技术特点：
- 时间线布局设计
- 响应式布局
- 交互展开/收起功能
-->

<template>
  <div class="career-path">
    <h3 class="path-title">职业发展路径</h3>
    <div class="timeline">
      <div 
        v-for="(path, index) in careerPaths" 
        :key="path.id"
        class="timeline-item"
        :class="{ 'active': activePathId === path.id }"
      >
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="path-header" @click="togglePath(path.id)">
            <h4 class="path-title">{{ path.title }}</h4>
            <span class="path-level">{{ path.levelName }}</span>
            <button class="expand-btn">
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2"
                :class="{ 'rotate': activePathId === path.id }"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
          <div class="path-details" v-if="activePathId === path.id">
            <div class="detail-item">
              <span class="detail-label">经验要求：</span>
              <span class="detail-value">{{ path.experience }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">薪资范围：</span>
              <span class="detail-value">{{ path.salary }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">所需技能：</span>
              <div class="skill-tags">
                <span 
                  v-for="skill in path.skills" 
                  :key="skill"
                  class="skill-tag"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-label">岗位描述：</span>
              <p class="detail-description">{{ path.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCareerStore } from '@/stores/career'

const careerStore = useCareerStore()
const activePathId = ref<string | null>(null)

const careerPaths = careerStore.careerPaths

const togglePath = (pathId: string) => {
  activePathId.value = activePathId.value === pathId ? null : pathId
}
</script>

<style scoped>
.career-path {
  width: 100%;
}

.path-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 14px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e0e0;
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-dot {
  position: absolute;
  left: -30px;
  top: 10px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #667eea;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.timeline-item.active .timeline-dot {
  background: #764ba2;
  transform: scale(1.2);
}

.timeline-content {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.timeline-item.active .timeline-content {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
  border-left: 4px solid #667eea;
}

.path-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 1rem;
}

.path-header h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.path-level {
  font-size: 0.85rem;
  color: #667eea;
  font-weight: 600;
  background: #f0f4ff;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  margin: 0 1rem;
}

.expand-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.expand-btn:hover {
  background: #f0f0f0;
}

.expand-btn svg {
  transition: transform 0.3s ease;
}

.expand-btn svg.rotate {
  transform: rotate(180deg);
}

.path-details {
  animation: slideDown 0.3s ease;
}

.detail-item {
  margin-bottom: 1rem;
}

.detail-label {
  font-weight: 600;
  color: #333;
  margin-right: 0.5rem;
  display: block;
  margin-bottom: 0.25rem;
}

.detail-value {
  color: #666;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.skill-tag {
  background: #f0f4ff;
  color: #667eea;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
}

.detail-description {
  color: #666;
  line-height: 1.5;
  margin: 0.25rem 0 0 0;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .timeline {
    padding-left: 20px;
  }
  
  .timeline-dot {
    left: -20px;
  }
  
  .path-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .path-level {
    margin: 0;
  }
  
  .expand-btn {
    align-self: flex-end;
  }
}
</style>
