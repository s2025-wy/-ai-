<template>
  <div class="report">
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
        <div class="page-header-particle"></div>
        <div class="page-header-particle"></div>
      </div>
      <div class="page-header-energy"></div>
      <div class="page-header-content">
        <span class="page-badge">📄 报告中心</span>
        <h1 class="page-title">职业规划报告</h1>
        <p class="page-subtitle">保存规划成果，随时查看和分享</p>
      </div>
    </section>

    <!-- Report Content -->
    <section class="report-content">
      <div class="content-card">
        <div class="card-header">
          <div class="card-icon">📊</div>
          <div class="card-title-wrapper">
            <h3 class="card-title">报告预览</h3>
            <p class="card-desc">查看报告内容，确认无误后导出</p>
          </div>
        </div>
        <div id="report-preview-content" class="report-preview">
          <div class="preview-header">
            <h2>职业规划报告</h2>
            <p>生成日期: 2026-03-04</p>
          </div>
          <div class="preview-body">
            <div class="preview-section">
              <h4>个人信息</h4>
              <p>姓名: 张三</p>
              <p>专业: 计算机科学与技术</p>
              <p>学校: 某大学</p>
            </div>
            <div class="preview-section">
              <h4>人岗匹配结果</h4>
              <p>匹配度: 85%</p>
              <p>目标岗位: 前端开发工程师</p>
            </div>
            <div class="preview-section">
              <h4>职业发展路径</h4>
              <p>1. 前端开发工程师 (0-2年)</p>
              <p>2. 高级前端工程师 (2-5年)</p>
              <p>3. 前端技术专家 (5年以上)</p>
            </div>
            <div class="preview-section">
              <h4>行动计划</h4>
              <p>短期计划 (1-3个月):</p>
              <p>- 学习HTML、CSS和JavaScript基础</p>
              <p>- 完成前端开发入门项目</p>
              <p>中期计划 (3-6个月):</p>
              <p>- 学习Vue.js框架</p>
              <p>- 参与实际项目开发</p>
              <p>长期计划 (6-12个月):</p>
              <p>- 学习前端工程化工具</p>
              <p>- 构建个人作品集</p>
            </div>
          </div>
        </div>
      </div>

      <div class="content-card">
        <div class="card-header">
          <div class="card-icon">⚙️</div>
          <div class="card-title-wrapper">
            <h3 class="card-title">导出选项</h3>
            <p class="card-desc">选择需要包含的报告内容</p>
          </div>
        </div>
        <div class="export-options">
          <div class="option-item">
            <input type="checkbox" id="include-profile" checked />
            <label for="include-profile">包含个人信息</label>
          </div>
          <div class="option-item">
            <input type="checkbox" id="include-match" checked />
            <label for="include-match">包含匹配结果</label>
          </div>
          <div class="option-item">
            <input type="checkbox" id="include-path" checked />
            <label for="include-path">包含发展路径</label>
          </div>
          <div class="option-item">
            <input type="checkbox" id="include-action" checked />
            <label for="include-action">包含行动计划</label>
          </div>
          <div class="export-buttons">
            <button class="btn-primary" @click="handleExportPDF">
              <span class="btn-text">导出PDF</span>
              <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </button>
            <button class="btn-secondary" @click="handleExportWord">
              <span class="btn-text">导出Word</span>
              <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </button>
            <button class="btn-secondary" @click="handleShareReport">
              <span class="btn-text">分享报告</span>
              <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                <polyline points="16 6 12 2 8 6"/>
                <line x1="12" y1="2" x2="12" y2="15"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="content-card">
        <div class="card-header">
          <div class="card-icon">📋</div>
          <div class="card-title-wrapper">
            <h3 class="card-title">历史报告</h3>
            <p class="card-desc">查看和管理您的历史报告</p>
          </div>
        </div>
        <div class="history-list">
          <div class="history-item">
            <div class="history-info">
              <h4>职业规划报告 v1.0</h4>
              <p>生成日期: 2026-03-04</p>
            </div>
            <div class="history-actions">
              <button class="btn-text">查看</button>
              <button class="btn-text">下载</button>
              <button class="btn-text danger">删除</button>
            </div>
          </div>
          <div class="history-item">
            <div class="history-info">
              <h4>职业规划报告 v0.9</h4>
              <p>生成日期: 2026-03-01</p>
            </div>
            <div class="history-actions">
              <button class="btn-text">查看</button>
              <button class="btn-text">下载</button>
              <button class="btn-text danger">删除</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { exportToPDF, exportToWord, shareReport } from '@/utils/export'
import { ElMessage } from 'element-plus'

// 导出PDF
async function handleExportPDF() {
  try {
    await exportToPDF('report-preview-content', '职业规划报告.pdf')
    ElMessage.success('PDF导出成功')
  } catch (error) {
    console.error('导出PDF失败:', error)
    ElMessage.error('PDF导出失败，请重试')
  }
}

// 导出Word
function handleExportWord() {
  try {
    exportToWord('report-preview-content', '职业规划报告.doc')
    ElMessage.success('Word导出成功')
  } catch (error) {
    console.error('导出Word失败:', error)
    ElMessage.error('Word导出失败，请重试')
  }
}

// 分享报告
function handleShareReport() {
  try {
    shareReport('职业规划报告')
  } catch (error) {
    console.error('分享失败:', error)
    ElMessage.error('分享失败，请重试')
  }
}
</script>

<style scoped>
.report {
  width: 100%;
  min-height: 100vh;
}

/* Page Header - Dark Blue Theme */
.page-header {
  position: relative;
  background: linear-gradient(135deg, #1a237e 0%, #283593 30%, #3949ab 60%, #3f51b5 100%);
  color: white;
  padding: 1.33rem 0;
  margin: -2rem -2rem 2rem 0rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
}

.page-header-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.page-header-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(240, 147, 251, 0.2) 0%, transparent 50%);
  animation: patternFloat 10s ease-in-out infinite;
}

@keyframes patternFloat {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(-15px, 10px) scale(1.05);
    opacity: 1;
  }
}

.page-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, 
    transparent 30%, 
    rgba(255, 255, 255, 0.05) 50%, 
    transparent 70%);
  animation: shimmer 4s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 添加粒子效果 */
.page-header-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.page-header-particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: headerParticleFloat 6s ease-in-out infinite;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
}

.page-header-particle:nth-child(1) { left: 5%; top: 30%; animation-delay: 0s; }
.page-header-particle:nth-child(2) { left: 15%; top: 70%; animation-delay: 0.8s; }
.page-header-particle:nth-child(3) { left: 25%; top: 50%; animation-delay: 1.5s; }
.page-header-particle:nth-child(4) { left: 35%; top: 80%; animation-delay: 0.3s; }
.page-header-particle:nth-child(5) { left: 45%; top: 40%; animation-delay: 2s; }
.page-header-particle:nth-child(6) { left: 55%; top: 60%; animation-delay: 1s; }
.page-header-particle:nth-child(7) { left: 65%; top: 30%; animation-delay: 2.5s; }
.page-header-particle:nth-child(8) { left: 75%; top: 70%; animation-delay: 0.5s; }
.page-header-particle:nth-child(9) { left: 85%; top: 50%; animation-delay: 1.8s; }
.page-header-particle:nth-child(10) { left: 95%; top: 80%; animation-delay: 1.2s; }

@keyframes headerParticleFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-15px) scale(1.3);
    opacity: 0.9;
  }
}

/* 添加能量环 */
.page-header-energy {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: energyRing 4s ease-out infinite;
}

.page-header-energy::before,
.page-header-energy::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.page-header-energy::before {
  width: 300px;
  height: 300px;
  animation: energyRing 4s ease-out infinite 0.5s;
}

.page-header-energy::after {
  width: 400px;
  height: 400px;
  animation: energyRing 4s ease-out infinite 1s;
}

@keyframes energyRing {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

.page-header-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 0 2rem;
}

.page-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

/* Report Content */
.report-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
}

.content-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

/* Card Header */
.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border-bottom: 1px solid #f0f0f0;
  background: #f9fafb;
}

.card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border-radius: 12px;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.card-title-wrapper {
  flex: 1;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem;
  padding: 0;
  border: none;
}

.card-desc {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

/* Report Preview */
.report-preview {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  margin: 2rem;
}

.preview-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.preview-header h2 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
  font-weight: 600;
}

.preview-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 1rem;
}

.preview-body {
  padding: 2rem;
  background: white;
}

.preview-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.preview-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.preview-section h4 {
  font-size: 1.25rem;
  color: #1e293b;
  margin-bottom: 1rem;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
}

.preview-section p {
  margin: 0.5rem 0;
  color: #64748b;
  line-height: 1.5;
}

/* Export Options */
.export-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.option-item:hover {
  background: #f8fafc;
}

.option-item input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: #3b82f6;
  cursor: pointer;
}

.option-item label {
  font-size: 1rem;
  color: #1e293b;
  cursor: pointer;
  font-weight: 500;
}

.export-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;
}

/* Buttons */
.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  text-decoration: none;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-secondary {
  background: white;
  color: #3b82f6;
  border: 2px solid #3b82f6;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.btn-secondary:hover {
  background: #f0f9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.btn-text {
  background: none;
  border: none;
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn-text:hover {
  background: #f0f9ff;
}

.btn-text.danger {
  color: #ef4444;
}

.btn-text.danger:hover {
  background: #fef2f2;
}

/* History List */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: white;
}

.history-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #3b82f6;
  transform: translateY(-2px);
}

.history-info h4 {
  margin: 0 0 0.5rem;
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 600;
}

.history-info p {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
}

.history-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

/* Large Screen Layout */
@media (min-width: 1200px) {
  .page-title {
    font-size: 3rem;
  }

  .page-subtitle {
    font-size: 1.25rem;
  }

  .report-content {
    gap: 2.5rem;
  }

  .content-card {
    padding: 0;
  }

  .preview-header {
    padding: 2.5rem;
  }

  .preview-body {
    padding: 2.5rem;
  }

  .export-options {
    padding: 2.5rem;
  }

  .history-list {
    padding: 2.5rem;
  }

  .history-item {
    padding: 2rem;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.75rem;
  }

  .report-content {
    padding: 0 1rem 3rem;
    gap: 1.5rem;
  }

  .card-header {
    padding: 1.5rem;
  }

  .card-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .card-title {
    font-size: 1.25rem;
  }

  .report-preview {
    margin: 1.5rem;
  }

  .preview-header {
    padding: 1.5rem;
  }

  .preview-body {
    padding: 1.5rem;
  }

  .export-options {
    padding: 1.5rem;
  }

  .export-buttons {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }

  .history-list {
    padding: 1.5rem;
  }

  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
  }

  .history-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>