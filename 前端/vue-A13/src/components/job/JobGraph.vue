<template>
  <div class="job-graph">
    <h3 class="graph-title">岗位关联图谱</h3>
    <div v-if="!job" class="empty-state">
      <p>请选择一个岗位查看关联图谱</p>
    </div>
    <div v-else class="graph-container" ref="graphRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

interface Job {
  id: string
  title: string
  company: string
  industry: string
  location: string
  salary: string
  salaryMin: number
  salaryMax: number
  experience: string
  education: string
  description: string
  requirements: string[]
  tags: string[]
  isFavorite: boolean
  publishDate: string
}

const props = defineProps<{
  job: Job | null
}>()

const graphRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

const fetchGraphData = async (job: Job) => {
  console.log('fetchGraphData called for job:', job.title)
  try {
    const searchResponse = await fetch(`http://localhost:8000/neo4j/jobs/search?keyword=${encodeURIComponent(job.title)}&limit=10`)
    const searchData = await searchResponse.json()
    
    const promotionResponse = await fetch(`http://localhost:8000/neo4j/jobs/${encodeURIComponent(job.title)}/promotions`)
    const promotionData = await promotionResponse.json()
    
    const transferResponse = await fetch(`http://localhost:8000/neo4j/jobs/${encodeURIComponent(job.title)}/transfers`)
    const transferData = await transferResponse.json()
    
    const nodes = new Set<string>()
    const links: { source: string; target: string; type: string }[] = []
    
    if (Array.isArray(searchData)) {
      searchData.forEach((item: any) => {
        if (item.name) {
          nodes.add(item.name)
          links.push({
            source: job.title,
            target: item.name,
            type: 'RELATED_TO'
          })
        }
      })
    }
    
    if (Array.isArray(promotionData)) {
      promotionData.forEach((item: any) => {
        if (item.name) {
          nodes.add(item.name)
          links.push({
            source: job.title,
            target: item.name,
            type: 'PROMOTES_TO'
          })
        }
      })
    }
    
    if (Array.isArray(transferData)) {
      transferData.forEach((item: any) => {
        if (item.name) {
          nodes.add(item.name)
          links.push({
            source: job.title,
            target: item.name,
            type: 'TRANSFERS_TO'
          })
        }
      })
    }
    
    nodes.add(job.title)
    
    console.log('Nodes:', Array.from(nodes))
    console.log('Links:', links)
    
    return { nodes: Array.from(nodes), links }
  } catch (error) {
    console.error('获取知识图谱数据失败:', error)
    return generateMockGraphData(job.title)
  }
}

const generateMockGraphData = (title: string) => {
  const relatedJobs = ['高级工程师', '技术专家', '架构师', '技术总监']
  const relationships = ['PROMOTES_TO', 'RELATED_TO', 'PROMOTES_TO', 'PROMOTES_TO']
  
  const nodes = new Set<string>()
  const links: { source: string; target: string; type: string }[] = []
  
  nodes.add(title)
  relatedJobs.forEach((job, index) => {
    nodes.add(job)
    links.push({
      source: title,
      target: job,
      type: relationships[index] || 'RELATED_TO'
    })
  })
  
  return { nodes: Array.from(nodes), links }
}

const getLinkColor = (type: string) => {
  switch (type) {
    case 'PROMOTES_TO':
      return '#43e97b'
    case 'TRANSFERS_TO':
      return '#4facfe'
    case 'RELATED_TO':
      return '#f5576c'
    default:
      return '#999'
  }
}

const renderChart = async () => {
  if (!graphRef.value || !props.job) {
    return
  }

  console.log('Rendering chart for:', props.job.title)

  if (chart) {
    chart.dispose()
    chart = null
  }

  chart = echarts.init(graphRef.value)

  const graphData = await fetchGraphData(props.job)
  
  const data = graphData.nodes.map((node, index) => ({
    name: node,
    itemStyle: {
      color: node === props.job?.title ? '#667eea' : ['#764ba2', '#f093fb', '#f5576c', '#4facfe', '#43e97b'][index % 5]
    },
    symbolSize: node === props.job?.title ? 60 : 45 + Math.random() * 15,
    label: node === props.job?.title ? { fontWeight: 'bold' } : {}
  }))

  const links = graphData.links.map(link => ({
    source: link.source,
    target: link.target,
    label: {
      show: true,
      formatter: link.type,
      fontSize: 10,
      color: '#999'
    },
    lineStyle: {
      color: getLinkColor(link.type),
      curveness: 0.3,
      width: 2
    }
  }))

  const option = {
    title: {
      text: `${props.job.title} - 发展路径`,
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}'
    },
    animation: true,
    animationDurationUpdate: 1500,
    series: [
      {
        type: 'graph',
        layout: 'force',
        force: {
          repulsion: 1000,
          edgeLength: [100, 200],
          gravity: 0.1,
          friction: 0.2
        },
        roam: true,
        label: {
          show: true,
          position: 'right',
          formatter: '{b}',
          fontSize: 12,
          color: '#333'
        },
        data,
        links,
        emphasis: {
          lineStyle: {
            width: 4
          },
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  chart.setOption(option)

  setTimeout(() => chart?.resize(), 100)
  setTimeout(() => chart?.resize(), 300)
  setTimeout(() => chart?.resize(), 500)
}

onMounted(() => {
  if (props.job) {
    nextTick(() => {
      setTimeout(() => renderChart(), 500)
    })
  }
})

watch(() => props.job, (newJob) => {
  if (newJob) {
    nextTick(() => {
      setTimeout(() => renderChart(), 500)
    })
  }
})

onUnmounted(() => {
  chart?.dispose()
})
</script>

<style scoped>
.job-graph {
  width: 100%;
}

.graph-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 1rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
  background: #f9f9f9;
  border-radius: 8px;
}

.graph-container {
  width: 100%;
  height: 350px;
  min-height: 350px;
  border-radius: 8px;
  overflow: hidden;
  background: #f9f9f9;
  border: 1px solid #e2e8f0;
}

@media (max-width: 768px) {
  .graph-container {
    height: 300px;
    min-height: 300px;
  }
}
</style>
