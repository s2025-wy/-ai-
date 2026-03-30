<template>
    <view class="container">
        <view class="upload-section">
            <view class="upload-area" @click="chooseFile">
                <text v-if="!selectedFile" class="upload-icon">📄</text>
                <text v-if="!selectedFile" class="upload-text">点击上传简历</text>
                <text v-if="!selectedFile" class="upload-desc">支持PDF、DOC、DOCX格式</text>
                <view v-if="selectedFile" class="file-info">
                    <text class="file-icon">📎</text>
                    <view class="file-detail">
                        <text class="file-name">{{ selectedFile.name }}</text>
                        <text class="file-size">{{ formatFileSize(selectedFile.size) }}</text>
                    </view>
                    <text class="file-remove" @click.stop="removeFile">✕</text>
                </view>
            </view>
        </view>
        
        <view class="tips-section">
            <view class="section-title">上传提示</view>
            <view class="tips-list">
                <view class="tip-item">
                    <text class="tip-icon">✅</text>
                    <text class="tip-text">建议使用最新版本的简历</text>
                </view>
                <view class="tip-item">
                    <text class="tip-icon">✅</text>
                    <text class="tip-text">确保简历包含完整的教育和工作经历</text>
                </view>
                <view class="tip-item">
                    <text class="tip-icon">✅</text>
                    <text class="tip-text">文件大小不超过10MB</text>
                </view>
                <view class="tip-item">
                    <text class="tip-icon">✅</text>
                    <text class="tip-text">上传后AI将自动分析你的简历</text>
                </view>
            </view>
        </view>
        
        <view class="action-section" v-if="selectedFile">
            <button 
                class="btn btn-primary"
                :class="{ loading: isUploading }"
                @click="uploadResume"
                :disabled="isUploading"
            >
                {{ isUploading ? '分析中...' : '开始分析' }}
            </button>
        </view>
    </view>
</template>

<script>
import appConfig from '@/config/index.js'

export default {
    data() {
        return {
            selectedFile: null,
            isUploading: false
        }
    },
    
    methods: {
        chooseFile() {
            uni.chooseMessageFile({
                count: 1,
                type: 'file',
                extension: ['.pdf', '.doc', '.docx'],
                success: (res) => {
                    const file = res.tempFiles[0]
                    this.selectedFile = file
                },
                fail: (err) => {
                    console.error('选择文件失败:', err)
                    uni.showToast({
                        title: '选择文件失败',
                        icon: 'none'
                    })
                }
            })
        },
        
        removeFile() {
            this.selectedFile = null
        },
        
        formatFileSize(bytes) {
            if (bytes === 0) return '0 B'
            const k = 1024
            const sizes = ['B', 'KB', 'MB', 'GB']
            const i = Math.floor(Math.log(bytes) / Math.log(k))
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
        },
        
        async uploadResume() {
            if (!this.selectedFile) {
                uni.showToast({
                    title: '请先选择文件',
                    icon: 'none'
                })
                return
            }
            
            this.isUploading = true
            
            try {
                uni.showLoading({ title: '上传中...' })
                
                const uploadTask = uni.uploadFile({
                    url: appConfig.baseUrl + '/resume/upload',
                    filePath: this.selectedFile.path,
                    name: 'file',
                    success: (res) => {
                        const data = JSON.parse(res.data)
                        if (res.statusCode === 200) {
                            uni.showToast({
                                title: '上传成功',
                                icon: 'success'
                            })
                            setTimeout(() => {
                                uni.navigateBack()
                            }, 1500)
                        } else {
                            uni.showToast({
                                title: data.msg || '上传失败',
                                icon: 'none'
                            })
                        }
                    },
                    fail: (err) => {
                        console.error('上传失败:', err)
                        uni.showToast({
                            title: '上传失败',
                            icon: 'none'
                        })
                    },
                    complete: () => {
                        this.isUploading = false
                        uni.hideLoading()
                    }
                })
                
                uploadTask.onProgressUpdate((res) => {
                    console.log('上传进度', res.progress)
                })
                
            } catch (err) {
                console.error(err)
                this.isUploading = false
                uni.hideLoading()
            }
        }
    }
}
</script>

<style scoped>
.container {
    min-height: 100vh;
    background: #f5f7fa;
    padding: 30rpx;
    padding-bottom: 140rpx;
}

.upload-section {
    background: white;
    border-radius: 24rpx;
    padding: 60rpx 30rpx;
}

.upload-area {
    border: 2rpx dashed #d1d5db;
    border-radius: 16rpx;
    padding: 80rpx 30rpx;
    text-align: center;
    transition: all 0.3s ease;
}

.upload-area:active {
    border-color: #667eea;
    background: #f8fafc;
}

.upload-icon {
    font-size: 100rpx;
    display: block;
    margin-bottom: 20rpx;
}

.upload-text {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    display: block;
    margin-bottom: 12rpx;
}

.upload-desc {
    font-size: 24rpx;
    color: #999;
    display: block;
}

.file-info {
    display: flex;
    align-items: center;
    background: #f8fafc;
    border-radius: 12rpx;
    padding: 24rpx;
}

.file-icon {
    font-size: 48rpx;
    margin-right: 20rpx;
}

.file-detail {
    flex: 1;
    text-align: left;
}

.file-name {
    font-size: 28rpx;
    color: #333;
    display: block;
    margin-bottom: 8rpx;
}

.file-size {
    font-size: 24rpx;
    color: #999;
    display: block;
}

.file-remove {
    font-size: 32rpx;
    color: #f5576c;
    padding: 10rpx;
}

.tips-section {
    margin-top: 40rpx;
}

.section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 24rpx;
}

.tips-list {
    background: white;
    border-radius: 24rpx;
    padding: 30rpx;
}

.tip-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 24rpx;
}

.tip-item:last-child {
    margin-bottom: 0;
}

.tip-icon {
    font-size: 28rpx;
    margin-right: 16rpx;
    margin-top: 4rpx;
}

.tip-text {
    flex: 1;
    font-size: 26rpx;
    color: #666;
    line-height: 1.6;
}

.action-section {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    padding: 20rpx 30rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    border-top: 1rpx solid #e8e8e8;
}

.btn {
    width: 100%;
    padding: 28rpx;
    border-radius: 16rpx;
    font-size: 30rpx;
    font-weight: 600;
    border: none;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn:disabled {
    opacity: 0.6;
}
</style>
