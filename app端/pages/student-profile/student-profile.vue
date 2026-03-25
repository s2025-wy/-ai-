<template>
    <view class="container">
        <view class="profile-header">
            <view class="avatar-section">
                <view class="avatar">
                    <text class="avatar-text">{{ initial }}</text>
                </view>
                <view class="user-info">
                    <text class="user-name">{{ userName }}</text>
                    <text class="user-role">{{ userRole }}</text>
                </view>
            </view>
        </view>
        
        <view class="progress-section">
            <view class="section-title">画像进度</view>
            <view class="progress-steps">
                <view 
                    v-for="(step, index) in steps" 
                    :key="index"
                    class="step-item"
                    :class="{ completed: index <= currentStep, active: index === currentStep }"
                >
                    <view class="step-icon">{{ step.icon }}</view>
                    <text class="step-text">{{ step.text }}</text>
                </view>
            </view>
        </view>
        
        <view class="ability-section">
            <view class="section-title">能力雷达图</view>
            <view class="radar-placeholder">
                <text class="placeholder-icon">📊</text>
                <text class="placeholder-text">能力雷达图开发中</text>
            </view>
        </view>
        
        <view class="action-section">
            <view class="section-title">快捷操作</view>
            <view class="action-list">
                <view class="action-card" @click="uploadResume">
                    <text class="action-icon">📄</text>
                    <view class="action-content">
                        <text class="action-title">上传简历</text>
                        <text class="action-desc">AI智能分析你的简历</text>
                    </view>
                    <text class="action-arrow">›</text>
                </view>
                <view class="action-card" @click="editProfile">
                    <text class="action-icon">✏️</text>
                    <view class="action-content">
                        <text class="action-title">编辑画像</text>
                        <text class="action-desc">完善你的个人信息</text>
                    </view>
                    <text class="action-arrow">›</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { useUserStore } from '@/stores/user.js'

export default {
    data() {
        return {
            userName: '同学',
            userRole: '学生',
            initial: '同',
            currentStep: 1,
            steps: [
                { icon: '📝', text: '简历分析' },
                { icon: '📊', text: '能力评估' },
                { icon: '🎯', text: '岗位匹配' },
                { icon: '🚀', text: '职业规划' }
            ]
        }
    },
    
    onLoad() {
        const user = useUserStore.state.user
        if (user) {
            this.userName = user.username || user.name || '同学'
            this.userRole = user.role === 'admin' ? '管理员' : '学生'
            this.initial = this.userName.charAt(0).toUpperCase()
        }
    },
    
    methods: {
        uploadResume() {
            uni.chooseMessageFile({
                count: 1,
                type: 'file',
                success: (res) => {
                    uni.showToast({
                        title: '简历上传成功',
                        icon: 'success'
                    })
                }
            })
        },
        
        editProfile() {
            uni.showToast({
                title: '编辑功能开发中',
                icon: 'none'
            })
        }
    }
}
</script>

<style scoped>
.container {
    min-height: 100vh;
    background: #f5f7fa;
    padding-bottom: 40rpx;
}

.profile-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 60rpx 30rpx;
}

.avatar-section {
    display: flex;
    align-items: center;
}

.avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 60rpx;
    background: rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 30rpx;
    border: 4rpx solid rgba(255, 255, 255, 0.5);
}

.avatar-text {
    font-size: 48rpx;
    font-weight: 600;
    color: white;
}

.user-info {
    flex: 1;
}

.user-name {
    font-size: 36rpx;
    font-weight: 600;
    color: white;
    display: block;
    margin-bottom: 8rpx;
}

.user-role {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
    display: block;
}

.progress-section, .ability-section, .action-section {
    padding: 30rpx;
    margin-top: 20rpx;
}

.section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 30rpx;
}

.progress-steps {
    display: flex;
    justify-content: space-between;
    background: white;
    border-radius: 24rpx;
    padding: 40rpx 30rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 0.4;
}

.step-item.completed {
    opacity: 1;
}

.step-item.active .step-icon {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: scale(1.1);
}

.step-icon {
    width: 80rpx;
    height: 80rpx;
    border-radius: 20rpx;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
    margin-bottom: 16rpx;
    transition: all 0.3s ease;
}

.step-text {
    font-size: 22rpx;
    color: #666;
}

.radar-placeholder {
    background: white;
    border-radius: 24rpx;
    padding: 100rpx 30rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.placeholder-icon {
    font-size: 100rpx;
    margin-bottom: 30rpx;
}

.placeholder-text {
    font-size: 28rpx;
    color: #999;
}

.action-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.action-card {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 20rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.action-icon {
    font-size: 48rpx;
    margin-right: 24rpx;
}

.action-content {
    flex: 1;
}

.action-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #1a1a1a;
    display: block;
    margin-bottom: 8rpx;
}

.action-desc {
    font-size: 24rpx;
    color: #999;
    display: block;
}

.action-arrow {
    font-size: 40rpx;
    color: #ccc;
}
</style>
