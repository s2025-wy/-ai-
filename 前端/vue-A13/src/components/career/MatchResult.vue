<!--
人岗匹配结果组件

技术特点：
- 使用 ECharts 5 绘制雷达图
- 动态数据绑定
- 响应式布局设计
-->

<template>
  <div class="match-result">
    <h3 class="result-title">人岗匹配分析</h3>
    <div class="overall-score">
      <div class="score-circle">
        <span class="score-number">{{ matchResult.overallScore }}</span>
        <span class="score-label">匹配度</span>
      </div>
      <div class="score-info">
        <h4>综合匹配度</h4>
        <p>{{ getMatchLevel(matchResult.overallScore) }}</p>
      </div>
    </div>
    
    <div class="match-chart">
      <div ref="chartRef" class="chart"></div>
    </div>
    
    <div class="match-details">
      <h4>匹配详情</h4>
      <div class="detail-grid">
        <div 
          v-for="dimension in matchResult.dimensions" 
          :key="dimension.name"
          class="detail-item"
        >
          <span class="dimension-name">{{ dimension.name }}</span>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: dimension.score + '%' }"
            ></div>
          </div>
          <span class="dimension-score">{{ dimension.score }}%</span>
        </div>
      </div>
    </div>
    
    <div class="recommendations">
      <h4>匹配建议</h4>
      <ul>
        <li v-for="(recommendation, index) in matchResult.recommendations" :key="index">
          {{ recommendation }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useCareerStore } from '@/stores/career'

const careerStore = useCareerStore()
const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

const matchResult = careerStore.matchResult

const getMatchLevel = (score: number): string => {
  if (score >= 90) return '优秀匹配'
  if (score >= 80) return '良好匹配'
  if (score >= 70) return '一般匹配'
  if (score >= 60) return '较低匹配'
  return '低匹配'
}

const initChart = () => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
    updateChart()
  }
}

const updateChart = () => {
  if (!chart) return

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      data: ['匹配度']
    },
    radar: {
      indicator: matchResult.dimensions.map(dim => ({
        name: dim.name,
        max: 100
      }))
    },
    series: [{
      name: '匹配度',
      type: 'radar',
      data: [{
        value: matchResult.dimensions.map(dim => dim.score),
        name: '匹配度',
        areaStyle: {
          color: 'rgba(102, 126, 234, 0.3)'
        },
        lineStyle: {
          color: '#667eea'
        },
        itemStyle: {
          color: '#667eea'
        }
      }]
    }]
  }

  chart.setOption(option)
}

const handleResize = () => {
  chart?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

watch(
  () => careerStore.matchResult,
  () => {
    updateChart()
  },
  { deep: true }
)
</script>

<style scoped>
.match-result {
  width: 100%;
}

.result-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
}

.overall-score {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 2rem;
}

.score-number {
  font-size: 2.5rem;
  font-weight: 700;
}

.score-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.score-info h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.score-info p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.match-chart {
  height: 400px;
  margin-bottom: 2rem;
}

.chart {
  width: 100%;
  height: 100%;
}

.match-details h4,
.recommendations h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.dimension-name {
  width: 80px;
  font-weight: 600;
  color: #333;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.dimension-score {
  width: 50px;
  font-weight: 600;
  color: #667eea;
}

.recommendations ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recommendations li {
  padding: 0.75rem 1rem;
  background: #f9f9f9;
  border-left: 4px solid #667eea;
  margin-bottom: 0.75rem;
  border-radius: 0 8px 8px 0;
  color: #333;
}

@media (max-width: 768px) {
  .overall-score {
    flex-direction: column;
    text-align: center;
  }
  
  .score-circle {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .match-chart {
    height: 300px;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
