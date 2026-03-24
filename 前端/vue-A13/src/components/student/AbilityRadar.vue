<!--
能力评估组件

功能：
- 展示学生各项能力的评分
- 使用 ECharts 绘制多种图表
- 支持能力分数的可视化展示
- 显示胜任能力模型和契合度

能力维度：
- 专业技能
- 学习能力
- 沟通能力
- 抗压能力
- 创新能力
- 战略思维
- 系统思考
- 影响力
- 识人用人
- 决策能力

使用场景：
- 学生画像页面的能力评估功能
- 能力分析和可视化展示

技术特点：
- 使用 ECharts 5 绘制多种图表
- 响应式图表设计
- 动态数据绑定
-->

<template>
  <div class="ability-evaluation">
    <h3 class="evaluation-title">能力评估</h3>
    
    <!-- 学生基本信息 -->
    <div class="student-info">
      <div class="info-item">
        <span class="label">姓名：</span>
        <span class="value">{{ studentInfo.name }}</span>
      </div>
      <div class="info-item">
        <span class="label">部门：</span>
        <span class="value">{{ studentInfo.department }}</span>
      </div>
      <div class="info-item">
        <span class="label">职位：</span>
        <span class="value">{{ studentInfo.position }}</span>
      </div>
    </div>
    
    <!-- 胜任能力模型 -->
    <div class="competency-model">
      <h4 class="section-title">胜任能力模型</h4>
      <div ref="modelChartRef" class="chart-container"></div>
    </div>
    
    <!-- 胜任能力契合度 -->
    <div class="fitness-section">
      <h4 class="section-title">胜任能力契合度</h4>
      <div class="fitness-bar"></div>
      <div class="fitness-value">{{ overallFitScore }}%</div>
    </div>
    
    <!-- 能力评分和提升分布 -->
    <div class="charts-grid">
      <!-- 胜任能力评分分布图 -->
      <div class="chart-item">
        <h4 class="section-title">胜任能力评分分布图</h4>
        <div ref="scoreChartRef" class="chart-container"></div>
      </div>
      
      <!-- 需提升能力分布图 -->
      <div class="chart-item">
        <h4 class="section-title">需提升能力分布图</h4>
        <div ref="improveChartRef" class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import * as echarts from 'echarts'

const props = defineProps<{
  resumeData?: any
}>()

const modelChartRef = ref<HTMLElement | null>(null)
const scoreChartRef = ref<HTMLElement | null>(null)
const improveChartRef = ref<HTMLElement | null>(null)

let modelChart: echarts.ECharts | null = null
let scoreChart: echarts.ECharts | null = null
let improveChart: echarts.ECharts | null = null

const studentInfo = computed(() => {
  if (props.resumeData) {
    if (props.resumeData.basic_info) {
      return {
        name: props.resumeData.basic_info.name || '未命名',
        department: props.resumeData.department || '待定',
        position: props.resumeData.position || '待定'
      }
    }
    return {
      name: props.resumeData.name || '未命名',
      department: props.resumeData.department || '待定',
      position: props.resumeData.position || '待定'
    }
  }
  return {
    name: '赵晨梁',
    department: '领导层',
    position: '副总经理'
  }
})

const abilityData = computed(() => {
  if (props.resumeData && props.resumeData.ability_evaluation && Array.isArray(props.resumeData.ability_evaluation)) {
    return props.resumeData.ability_evaluation
  }
  return [
    { name: '专业技能', score: 76, fitScore: 81, improveScore: 0.9 },
    { name: '学习能力', score: 74, fitScore: 81, improveScore: 1.0 },
    { name: '沟通能力', score: 74, fitScore: 79, improveScore: 1.0 },
    { name: '抗压能力', score: 74, fitScore: 83, improveScore: 0.9 },
    { name: '创新能力', score: 79, fitScore: 83, improveScore: 1.0 },
    { name: '战略思维', score: 80, fitScore: 85, improveScore: 0.9 },
    { name: '系统思考', score: 79, fitScore: 83, improveScore: 1.0 },
    { name: '影响力', score: 77, fitScore: 84, improveScore: 0.9 },
    { name: '识人用人', score: 77, fitScore: 81, improveScore: 1.0 }
  ]
})

const overallFitScore = computed(() => {
  if (props.resumeData && props.resumeData.fit_score !== undefined) {
    return Math.round(props.resumeData.fit_score)
  }
  return 85
})

const competencyModelData = computed(() => {
  if (props.resumeData && props.resumeData.competency_model && Array.isArray(props.resumeData.competency_model)) {
    return props.resumeData.competency_model
  }
  return [4, 4, 4, 4, 5, 4, 5, 4, 4]
})

const initCharts = () => {
  initModelChart()
  initScoreChart()
  initImproveChart()
}

const initModelChart = () => {
  if (modelChartRef.value) {
    modelChart = echarts.init(modelChartRef.value)
    updateModelChart()
  }
}

const updateModelChart = () => {
  if (!modelChart) return

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['专业技能', '学习能力', '沟通能力', '抗压能力', '创新能力', '战略思维', '系统思考', '影响力', '识人用人'],
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 5,
      interval: 1
    },
    series: [{
      name: '能力评分',
      type: 'line',
      data: competencyModelData.value,
      smooth: true,
      lineStyle: {
        color: '#4caf50',
        width: 2
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(76, 175, 80, 0.6)' },
          { offset: 1, color: 'rgba(76, 175, 80, 0.1)' }
        ])
      },
      itemStyle: {
        color: '#4caf50'
      }
    }]
  }

  modelChart.setOption(option)
}

const initScoreChart = () => {
  if (scoreChartRef.value) {
    scoreChart = echarts.init(scoreChartRef.value)
    updateScoreChart()
  }
}

const updateScoreChart = () => {
  if (!scoreChart) return

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: abilityData.value.map((item: { name: string }) => item.name),
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 20
    },
    series: [
      {
        name: '评分',
        type: 'bar',
        data: abilityData.value.map((item: { score: number }) => item.score),
        itemStyle: {
          color: '#e53935'
        }
      },
      {
        name: '契合度',
        type: 'bar',
        data: abilityData.value.map((item: { fitScore: number }) => item.fitScore),
        itemStyle: {
          color: '#43a047'
        }
      }
    ]
  }

  scoreChart.setOption(option)
}

const initImproveChart = () => {
  if (improveChartRef.value) {
    improveChart = echarts.init(improveChartRef.value)
    updateImproveChart()
  }
}

const updateImproveChart = () => {
  if (!improveChart) return

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: abilityData.value.map((item: { name: string }) => item.name),
      axisLabel: {
        interval: 0,
        rotate: 45,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1.2,
      interval: 0.2
    },
    series: [{
      name: '提升需求',
      type: 'line',
      data: abilityData.value.map((item: { improveScore: number }) => item.improveScore),
      smooth: true,
      lineStyle: {
        color: '#1976d2',
        width: 2
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(25, 118, 210, 0.6)' },
          { offset: 1, color: 'rgba(25, 118, 210, 0.1)' }
        ])
      },
      itemStyle: {
        color: '#1976d2'
      }
    }]
  }

  improveChart.setOption(option)
}

const handleResize = () => {
  modelChart?.resize()
  scoreChart?.resize()
  improveChart?.resize()
}

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})
</script>

<style scoped>
.ability-evaluation {
  width: 100%;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.evaluation-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.student-info {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-item {
  display: flex;
  align-items: center;
}

.label {
  font-weight: 600;
  margin-right: 8px;
  color: #555;
}

.value {
  color: #333;
}

.competency-model {
  margin-bottom: 20px;
}

.fitness-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e0e0e0;
}

.chart-container {
  height: 300px;
  width: 100%;
}

.fitness-bar {
  height: 20px;
  background: linear-gradient(to right, #4caf50, #81c784);
  border-radius: 10px;
  margin-bottom: 10px;
}

.fitness-value {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 600;
  color: #4caf50;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chart-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .student-info {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-container {
    height: 250px;
  }
  
  .section-title {
    font-size: 1rem;
  }
}
</style>
