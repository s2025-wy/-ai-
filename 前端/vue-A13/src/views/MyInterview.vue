<template>
  <Transition name="page-enter" appear>
    <div class="my-interview">
      <!-- Page Header -->
      <section class="page-header">
        <div class="page-header-bg">
          <div class="page-header-pattern"></div>
        </div>
        <div class="page-header-particles">
          <div class="page-header-particle"></div>
          <div class="page-header-particle"></div>
          <div class="page-header-particle"></div>
          <div class="page-header-particle"></div>
          <div class="page-header-particle"></div>
          <div class="page-header-particle"></div>
          <div class="page-header-particle"></div>
          <div class="page-header-particle"></div>
        </div>
        <div class="page-header-energy"></div>
        <div class="page-header-content">
          <span class="page-badge">🎯 面试管理</span>
          <h1 class="page-title">我的面试</h1>
          <p class="page-subtitle">管理您的面试记录，追踪面试进度</p>
        </div>
      </section>

      <!-- Action Bar -->
      <section class="action-bar">
        <div class="container">
          <button class="create-btn" @click="showCreateModal = true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>创建面试</span>
          </button>
        </div>
      </section>

      <!-- Interview List -->
      <section class="interview-list">
        <div class="container">
          <div v-if="interviews.length > 0" class="cards-grid">
            <div 
              v-for="interview in interviews" 
              :key="interview.id"
              class="interview-card"
              :class="'status-' + interview.status"
              @click="goToInterviewDetail(interview.id)"
            >
              <div class="card-header">
                <div class="company-info">
                  <div class="company-logo">
                    {{ interview.company.charAt(0) }}
                  </div>
                  <div class="company-details">
                    <h3>{{ interview.company }}</h3>
                    <p>{{ interview.position }}</p>
                  </div>
                </div>
                <span class="status-badge" :class="'status-' + interview.status">
                  {{ getStatusText(interview.status) }}
                </span>
              </div>
              
              <div class="card-body">
                <div class="info-row">
                  <span class="label">面试时间：</span>
                  <span class="value">{{ interview.date }}</span>
                </div>
                <div class="info-row">
                  <span class="label">面试形式：</span>
                  <span class="value">{{ interview.type }}</span>
                </div>
                <div class="info-row" v-if="interview.interviewer">
                  <span class="label">面试官：</span>
                  <span class="value">{{ interview.interviewer }}</span>
                </div>
                <div class="info-row" v-if="interview.remark">
                  <span class="label">备注：</span>
                  <span class="value">{{ interview.remark }}</span>
                </div>
              </div>
              
              <div class="card-actions">
                <button class="action-btn edit" @click.stop="editInterview(interview)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <span>编辑</span>
                </button>
                <button class="action-btn delete" @click.stop="deleteInterview(interview)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  <span>删除</span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-else class="empty-state">
            <div class="empty-icon">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h2>暂无面试记录</h2>
            <p>点击右上角"创建面试"按钮，添加您的第一个面试记录</p>
            <button class="create-btn large" @click="showCreateModal = true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span>创建第一个面试</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h2>{{ isEditing ? '编辑面试' : '创建面试' }}</h2>
            <button class="close-btn" @click="closeModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="form-group">
                <label class="form-label">
                  名称
                  <span class="required">*</span>
                </label>
                <input 
                  v-model="formData.company" 
                  type="text" 
                  placeholder="请输入面试名称"
                  class="form-input"
                  required
                />
              </div>
              
              <div class="form-group">
                <label class="form-label">
                  职位
                  <span class="required">*</span>
                </label>
                <div class="input-with-button">
                  <select v-model="formData.position" class="form-input" required>
                    <option value="">选择职位</option>
                    <option value="前端开发工程师">前端开发工程师</option>
                    <option value="后端开发工程师">后端开发工程师</option>
                    <option value="全栈开发工程师">全栈开发工程师</option>
                    <option value="数据分析师">数据分析师</option>
                    <option value="产品经理">产品经理</option>
                    <option value="UI 设计师">UI 设计师</option>
                  </select>
                  <button type="button" class="add-jd-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    <span>添加职位 JD</span>
                  </button>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">
                    语言
                    <span class="required">*</span>
                    <span class="info-icon" title="选择面试使用的语言">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                      </svg>
                    </span>
                  </label>
                  <select v-model="formData.language" class="form-input" required>
                    <option value="中文">中文</option>
                    <option value="English">English</option>
                    <option value="日本語">日本語</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="form-label">
                    第二语言
                    <span class="info-icon" title="选择第二语言（可选）">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                      </svg>
                    </span>
                  </label>
                  <select v-model="formData.secondLanguage" class="form-input">
                    <option value="无">无</option>
                    <option value="中文">中文</option>
                    <option value="English">English</option>
                    <option value="日本語">日本語</option>
                  </select>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">
                  简历
                  <span class="info-icon" title="上传或选择简历">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 16v-4"/>
                      <path d="M12 8h.01"/>
                    </svg>
                  </span>
                </label>
                <div class="input-with-button">
                  <select v-model="formData.resume" class="form-input">
                    <option value="">选择简历（可选）</option>
                    <option value="resume1">简历 1.pdf</option>
                    <option value="resume2">简历 2.pdf</option>
                  </select>
                  <button type="button" class="upload-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span>上传简历</span>
                  </button>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">
                    面试时间
                    <span class="required">*</span>
                  </label>
                  <input 
                    v-model="formData.date" 
                    type="datetime-local" 
                    class="form-input"
                    required
                  />
                </div>
                
                <div class="form-group">
                  <label class="form-label">
                    面试形式
                    <span class="required">*</span>
                  </label>
                  <select v-model="formData.type" class="form-input" required>
                    <option value="">选择面试形式</option>
                    <option value="视频面试">视频面试</option>
                    <option value="现场面试">现场面试</option>
                    <option value="电话面试">电话面试</option>
                    <option value="在线笔试">在线笔试</option>
                  </select>
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">
                    面试状态
                    <span class="required">*</span>
                  </label>
                  <select v-model="formData.status" class="form-input" required>
                    <option value="pending">待面试</option>
                    <option value="completed">已完成</option>
                    <option value="offer">已拿 offer</option>
                    <option value="rejected">已拒绝</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label class="form-label">
                    面试官
                  </label>
                  <input 
                    v-model="formData.interviewer" 
                    type="text" 
                    placeholder="请输入面试官姓名（可选）"
                    class="form-input"
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">
                  备注
                </label>
                <textarea 
                  v-model="formData.remark" 
                  placeholder="请输入备注信息（可选）"
                  class="form-input"
                  rows="3"
                ></textarea>
              </div>
            </form>
          </div>
          
          <div class="modal-footer">
            <button class="cancel-btn" @click="closeModal">取消</button>
            <button class="submit-btn" @click="submitForm" :disabled="isSubmitting">
              {{ isSubmitting ? '提交中...' : (isEditing ? '保存修改' : '创建面试') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface Interview {
  id: string
  company: string
  position: string
  date: string
  type: string
  status: string
  interviewer?: string
  remark?: string
}

const interviews = ref<Interview[]>([])
const showCreateModal = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)
const editingId = ref<string | null>(null)

const formData = ref({
  company: '',
  position: '',
  language: '中文',
  secondLanguage: '无',
  resume: '',
  date: '',
  type: '',
  status: 'pending',
  interviewer: '',
  remark: ''
})

// 获取状态文本
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '待面试',
    completed: '已完成',
    offer: '已拿 offer',
    rejected: '已拒绝'
  }
  return statusMap[status] || status
}

// 加载数据
const loadInterviews = () => {
  const saved = localStorage.getItem('myInterviews')
  if (saved) {
    interviews.value = JSON.parse(saved)
  } else {
    // 示例数据
    interviews.value = [
      {
        id: '1',
        company: '某某科技有限公司',
        position: '前端开发工程师',
        date: '2024-03-20 14:00',
        type: '视频面试',
        status: 'pending',
        interviewer: '张经理',
        remark: '准备一下项目介绍'
      },
      {
        id: '2',
        company: '创新互联网公司',
        position: '全栈开发工程师',
        date: '2024-03-18 10:00',
        type: '现场面试',
        status: 'completed',
        interviewer: '李总监',
        remark: '感觉表现不错'
      }
    ]
  }
}

// 保存数据
const saveInterviews = () => {
  localStorage.setItem('myInterviews', JSON.stringify(interviews.value))
}

// 打开编辑
const editInterview = (interview: Interview) => {
  isEditing.value = true
  editingId.value = interview.id
  formData.value = {
    company: interview.company,
    position: interview.position,
    language: '中文',
    secondLanguage: '无',
    resume: '',
    date: interview.date,
    type: interview.type,
    status: interview.status,
    interviewer: interview.interviewer || '',
    remark: interview.remark || ''
  }
  showCreateModal.value = true
}

// 删除面试
const deleteInterview = (interview: Interview) => {
  if (confirm(`确定要删除"${interview.company} - ${interview.position}"的面试记录吗？`)) {
    interviews.value = interviews.value.filter(i => i.id !== interview.id)
    saveInterviews()
  }
}

// 跳转到面试详情
const goToInterviewDetail = (id: string) => {
  router.push(`/interview-detail/${id}`)
}

// 关闭弹窗
const closeModal = () => {
  showCreateModal.value = false
  isEditing.value = false
  editingId.value = null
  formData.value = {
    company: '',
    position: '',
    language: '中文',
    secondLanguage: '无',
    resume: '',
    date: '',
    type: '',
    status: 'pending',
    interviewer: '',
    remark: ''
  }
}

// 提交表单
const submitForm = () => {
  isSubmitting.value = true
  
  setTimeout(() => {
    if (isEditing.value && editingId.value) {
      // 编辑模式
      const index = interviews.value.findIndex(i => i.id === editingId.value)
      if (index !== -1) {
        interviews.value[index] = {
          id: editingId.value,
          company: formData.value.company,
          position: formData.value.position,
          date: formData.value.date,
          type: formData.value.type,
          status: formData.value.status,
          interviewer: formData.value.interviewer || undefined,
          remark: formData.value.remark || undefined
        }
      }
    } else {
      // 创建模式
      const newInterview: Interview = {
        id: Date.now().toString(),
        company: formData.value.company,
        position: formData.value.position,
        date: formData.value.date,
        type: formData.value.type,
        status: formData.value.status,
        interviewer: formData.value.interviewer || undefined,
        remark: formData.value.remark || undefined
      }
      interviews.value.push(newInterview)
    }
    
    saveInterviews()
    closeModal()
    isSubmitting.value = false
  }, 500)
}

onMounted(() => {
  loadInterviews()
})
</script>

<style scoped>
/* Page Transition */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* My Interview Container */
.my-interview {
  min-height: 100vh;
  background: #f5f7fa;
}

/* Page Header */
.page-header {
  position: relative;
  background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%);
  padding: 4rem 2rem;
  overflow: hidden;
  margin-bottom: 2rem;
}

.page-header-bg {
  position: absolute;
  inset: 0;
  opacity: 0.1;
}

.page-header-pattern {
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
}

.page-header-particles {
  position: absolute;
  inset: 0;
}

.page-header-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.page-header-particle:nth-child(1) { top: 10%; left: 20%; animation-delay: 0s; }
.page-header-particle:nth-child(2) { top: 30%; left: 80%; animation-delay: 1s; }
.page-header-particle:nth-child(3) { top: 50%; left: 40%; animation-delay: 2s; }
.page-header-particle:nth-child(4) { top: 70%; left: 60%; animation-delay: 3s; }
.page-header-particle:nth-child(5) { top: 20%; left: 90%; animation-delay: 4s; }
.page-header-particle:nth-child(6) { top: 60%; left: 10%; animation-delay: 5s; }
.page-header-particle:nth-child(7) { top: 80%; left: 70%; animation-delay: 6s; }
.page-header-particle:nth-child(8) { top: 40%; left: 30%; animation-delay: 7s; }

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) scale(1.5);
    opacity: 0.9;
  }
}

.page-header-energy {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.6;
  }
}

.page-header-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: white;
}

.page-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  backdrop-filter: blur(10px);
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem;
  letter-spacing: 2px;
}

.page-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Action Bar */
.action-bar {
  margin-bottom: 2rem;
}

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #fdd835 0%, #fbc02d 100%);
  color: #1a237e;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(253, 216, 53, 0.3);
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(253, 216, 53, 0.4);
}

.create-btn.large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* Interview List */
.interview-list {
  padding-bottom: 4rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.interview-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.interview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.interview-card.status-pending {
  border-left-color: #fdd835;
}

.interview-card.status-completed {
  border-left-color: #4caf50;
}

.interview-card.status-offer {
  border-left-color: #2196f3;
}

.interview-card.status-rejected {
  border-left-color: #f44336;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.company-info {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.company-logo {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.company-details h3 {
  margin: 0 0 0.25rem;
  font-size: 1.125rem;
  color: #1a237e;
}

.company-details p {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.status-badge.status-pending {
  background: rgba(253, 216, 53, 0.15);
  color: #f57f17;
}

.status-badge.status-completed {
  background: rgba(76, 175, 80, 0.15);
  color: #2e7d32;
}

.status-badge.status-offer {
  background: rgba(33, 150, 243, 0.15);
  color: #1565c0;
}

.status-badge.status-rejected {
  background: rgba(244, 67, 54, 0.15);
  color: #c62828;
}

.card-body {
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  color: #666;
  width: 80px;
  flex-shrink: 0;
}

.value {
  color: #333;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.edit {
  background: rgba(33, 150, 243, 0.1);
  color: #1976d2;
}

.action-btn.edit:hover {
  background: rgba(33, 150, 243, 0.2);
}

.action-btn.delete {
  background: rgba(244, 67, 54, 0.1);
  color: #d32f2f;
}

.action-btn.delete:hover {
  background: rgba(244, 67, 54, 0.2);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  margin-bottom: 1.5rem;
  opacity: 0.3;
}

.empty-state h2 {
  margin: 0 0 0.5rem;
  color: #1a237e;
}

.empty-state p {
  margin: 0 0 2rem;
  color: #666;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 680px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #999;
  transition: all 0.3s ease;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
  background: #f5f5f5;
}

.modal-body {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
  font-weight: 500;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.required {
  color: #ff4d4f;
}

.info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #999;
  cursor: help;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.info-icon:hover {
  opacity: 1;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  font-family: inherit;
  background: #fff;
  color: #333;
}

.form-input:hover {
  border-color: #40a9ff;
}

.form-input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.form-input:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.input-with-button {
  display: flex;
  gap: 0.75rem;
}

.input-with-button .form-input {
  flex: 1;
}

.add-jd-btn,
.upload-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1rem;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.add-jd-btn:hover,
.upload-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.agreement-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
}

.agreement-label input[type="checkbox"] {
  margin-top: 0.25rem;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.agreement-link {
  color: #1890ff;
  text-decoration: none;
}

.agreement-link:hover {
  text-decoration: underline;
}

.agreement-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
}

.agreement-label input[type="checkbox"] {
  margin-top: 0.25rem;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.agreement-link {
  color: #1890ff;
  text-decoration: none;
}

.agreement-link:hover {
  text-decoration: underline;
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid #f0f0f0;
  justify-content: flex-end;
}

.cancel-btn,
.submit-btn {
  padding: 0.625rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.cancel-btn:hover {
  background: #e8e8e8;
}

.submit-btn {
  background: linear-gradient(135deg, #fdd835 0%, #fbc02d 100%);
  color: #1a237e;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(253, 216, 53, 0.4);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .modal {
    max-height: 95vh;
  }
}
</style>
