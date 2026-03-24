<template>
  <Transition name="page-enter" appear>
    <div class="interview-detail">
      <!-- Top Navigation Bar -->
      <div class="top-nav">
        <div class="nav-left">
          <button class="back-btn" @click="goBack">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </button>
          <div class="company-info">
            <span class="company-name">{{ interviewData.company }}</span>
            <span class="position-name">{{ interviewData.position }}</span>
          </div>
          <div class="tech-tags">
            <span class="tech-tag">{{ interviewData.language }}</span>
            <span v-if="interviewData.secondLanguage && interviewData.secondLanguage !== '无'" class="tech-tag">{{ interviewData.secondLanguage }}</span>
          </div>
        </div>
        <div class="nav-right">
          <button class="settings-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span>设置</span>
          </button>
          <button class="start-interview-btn" @click="startInterview">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <span>开始面试</span>
          </button>
        </div>
      </div>

      <!-- AI Assistant Banner -->
      <div class="ai-banner">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span>AI 面试助手已准备就绪，随时为您解答面试问题，提供专业帮助</span>
      </div>

      <!-- Main Content Area -->
      <div class="main-content">
        <!-- Left Panel - Question Area -->
        <div class="left-panel">
          <div class="question-area">
            <div v-if="!interviewStarted" class="empty-state">
              <div class="empty-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <h3>暂无面试问题</h3>
              <p>点击开始面试，自动语音识别面试官问题</p>
            </div>
            <div v-else class="question-content">
              <div class="question-header">
                <span class="question-number">问题 1</span>
                <span class="question-type">技术题</span>
              </div>
              <div class="question-text">
                {{ currentQuestion }}
              </div>
            </div>
          </div>

          <!-- Input Area -->
          <div class="input-area">
            <textarea 
              v-model="userInput" 
              placeholder="如有突发情况或回答文字问题，可以在这手动输入，回车发送"
              @keydown.enter.exact.prevent="sendMessage"
            ></textarea>
            <div class="input-actions">
              <button class="action-btn-local">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>本地上传</span>
              </button>
              <button class="action-btn-screen">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                <span>遥控截屏</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Right Panel - AI Assistant -->
        <div class="right-panel">
          <div v-if="!interviewStarted" class="assistant-intro">
            <div class="assistant-avatar">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="8" r="5"/>
                <path d="M20 21a8 8 0 1 0-16 0"/>
              </svg>
            </div>
            <h3>你的 AI 面试助手已准备就绪</h3>
            <p>随时随地解答面试问题，提供专业帮助</p>
            
            <div class="features">
              <div class="feature-item">
                <div class="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polygon points="10 8 16 12 10 16 10 8"/>
                  </svg>
                </div>
                <div class="feature-content">
                  <h4>最强 GPT 模型</h4>
                  <p>回答任何面试问题，结合简历不刻板</p>
                </div>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </div>
                <div class="feature-content">
                  <h4>AI 问题校正</h4>
                  <p>问题不清楚也没关系，AI 可以帮你校正</p>
                </div>
              </div>
              
              <div class="feature-item">
                <div class="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <div class="feature-content">
                  <h4>快捷回答</h4>
                  <p>点击快答，毫秒级生成面试回答</p>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="assistant-chat">
            <div class="chat-messages">
              <div class="message ai-message">
                <div class="message-avatar">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="8" r="5"/>
                    <path d="M20 21a8 8 0 1 0-16 0"/>
                  </svg>
                </div>
                <div class="message-content">
                  <div class="message-header">AI 助手</div>
                  <div class="message-text">
                    {{ aiResponse }}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="chat-actions">
              <button class="quick-answer-btn" @click="quickAnswer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <span>快答 Ctrl + Enter</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Assistant Avatar -->
      <div class="floating-avatar">
        <div class="avatar-circle">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="8" r="5"/>
            <path d="M20 21a8 8 0 1 0-16 0"/>
          </svg>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const interviewData = ref({
  id: '',
  company: '某某科技公司',
  position: '前端开发工程师',
  language: '中文',
  secondLanguage: '无'
})

const interviewStarted = ref(false)
const currentQuestion = ref('')
const userInput = ref('')
const aiResponse = ref('您好！我是您的 AI 面试助手。在面试过程中，您可以随时向我提问或寻求帮助。无论是技术问题、项目经验还是行为面试问题，我都会尽力为您提供专业的建议和指导。祝您面试顺利！')

const questions = [
  '请简单介绍一下你自己，以及你为什么选择前端开发这个方向？',
  '你能解释一下 Vue 的响应式原理吗？',
  '在项目中有遇到过什么技术难点吗？是如何解决的？',
  '你对前端性能优化有什么理解和实践经验？',
  '谈谈你对 TypeScript 的理解，以及它在项目中的优势'
]

const goBack = () => {
  router.back()
}

const startInterview = () => {
  interviewStarted.value = true
  // 模拟开始面试，加载第一个问题
  setTimeout(() => {
    currentQuestion.value = questions[0] || ''
  }, 500)
}

const sendMessage = () => {
  if (userInput.value.trim()) {
    // 模拟发送消息
    console.log('发送消息:', userInput.value)
    userInput.value = ''
  }
}

const quickAnswer = () => {
  // 模拟快速回答
  aiResponse.value = '这是一个很好的问题！基于我的理解，建议您从以下几个方面来回答：\n\n1. **技术层面**：展示您对该技术的深入理解\n2. **实践经验**：结合具体项目案例说明\n3. **思考深度**：体现您的技术选型思考\n\n您想针对哪个方面详细展开呢？'
}

onMounted(() => {
  const interviewId = route.params.id
  if (interviewId) {
    interviewData.value.id = interviewId as string
    // 这里可以从 localStorage 或其他数据源加载面试数据
  }
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.interview-detail {
  min-height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
}

/* Top Navigation */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;
  transition: all 0.3s ease;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.company-info {
  display: flex;
  flex-direction: column;
}

.company-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.position-name {
  font-size: 0.875rem;
  color: #666;
}

.tech-tags {
  display: flex;
  gap: 0.5rem;
}

.tech-tag {
  padding: 0.25rem 0.75rem;
  background: #f0f0f0;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #666;
}

.nav-right {
  display: flex;
  gap: 0.75rem;
}

.settings-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.settings-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.start-interview-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, #fdd835 0%, #fbc02d 100%);
  border: none;
  border-radius: 6px;
  color: #1a237e;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.start-interview-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(253, 216, 53, 0.4);
}

/* AI Banner */
.ai-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #fffbe6;
  border-bottom: 1px solid #ffe58f;
  color: #faad14;
  font-size: 0.875rem;
}

/* Main Content */
.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: #e8e8e8;
}

.left-panel,
.right-panel {
  background: #fff;
  display: flex;
  flex-direction: column;
}

.left-panel {
  border-right: 1px solid #e8e8e8;
}

/* Question Area */
.question-area {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  margin-bottom: 1.5rem;
  opacity: 0.3;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  color: #1a1a1a;
}

.empty-state p {
  color: #999;
  font-size: 0.875rem;
}

.question-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.question-header {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.question-number {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.question-type {
  padding: 0.25rem 0.75rem;
  background: #e6f7ff;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #1890ff;
}

.question-text {
  font-size: 1.125rem;
  line-height: 1.8;
  color: #333;
}

/* Input Area */
.input-area {
  padding: 1.5rem;
  border-top: 1px solid #e8e8e8;
}

.input-area textarea {
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  margin-bottom: 0.75rem;
}

.input-area textarea:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.input-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn-local,
.action-btn-screen {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: #f5f5f5;
  border: none;
  border-radius: 6px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
}

.action-btn-local:hover,
.action-btn-screen:hover {
  background: #e8e8e8;
  color: #333;
}

/* Right Panel - Assistant */
.assistant-intro {
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.assistant-avatar {
  width: 100px;
  height: 100px;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.assistant-intro h3 {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
  color: #1a1a1a;
}

.assistant-intro > p {
  margin-bottom: 2rem;
  color: #999;
  font-size: 0.875rem;
}

.features {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  gap: 1rem;
  text-align: left;
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: #fffbe6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #faad14;
  flex-shrink: 0;
}

.feature-content h4 {
  margin-bottom: 0.25rem;
  font-size: 1rem;
  color: #1a1a1a;
}

.feature-content p {
  font-size: 0.875rem;
  color: #999;
  line-height: 1.5;
}

/* Chat Messages */
.assistant-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.message {
  display: flex;
  gap: 1rem;
}

.ai-message .message-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
}

.message-header {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
}

.message-text {
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
}

.chat-actions {
  margin-top: 1.5rem;
}

.quick-answer-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #fdd835 0%, #fbc02d 100%);
  border: none;
  border-radius: 8px;
  color: #1a237e;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  width: 100%;
  justify-content: center;
}

.quick-answer-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(253, 216, 53, 0.4);
}

/* Floating Avatar */
.floating-avatar {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 1000;
}

.avatar-circle {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-circle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

/* Responsive */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .left-panel {
    border-right: none;
    border-bottom: 1px solid #e8e8e8;
  }
}
</style>
