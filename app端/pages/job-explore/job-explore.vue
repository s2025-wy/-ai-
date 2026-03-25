<template>
    <view class="container">
        <view class="search-section">
            <view class="search-bar">
                <text class="search-icon">🔍</text>
                <input 
                    v-model="searchKeyword"
                    class="search-input"
                    placeholder="搜索岗位名称..."
                    @confirm="handleSearch"
                />
            </view>
        </view>
        
        <view class="filter-section">
            <scroll-view class="filter-scroll" scroll-x="true">
                <view 
                    v-for="(filter, index) in filters" 
                    :key="index"
                    class="filter-item"
                    :class="{ active: activeFilter === index }"
                    @click="activeFilter = index"
                >
                    {{ filter }}
                </view>
            </scroll-view>
        </view>
        
        <view class="job-list" v-if="jobList.length > 0">
            <view 
                v-for="job in jobList" 
                :key="job.id"
                class="job-card"
                @click="viewJobDetail(job)"
            >
                <view class="job-header">
                    <view class="job-title">{{ job.title || '岗位名称' }}</view>
                    <view class="job-salary">{{ job.salary || '薪资面议' }}</view>
                </view>
                <view class="job-company">{{ job.company || '公司名称' }}</view>
                <view class="job-info">
                    <text class="info-tag">{{ job.location || '地点' }}</text>
                    <text class="info-tag">{{ job.experience || '经验不限' }}</text>
                    <text class="info-tag">{{ job.education || '学历不限' }}</text>
                </view>
                <view class="job-tags">
                    <text v-for="(tag, i) in (job.tags || [])" :key="i" class="tag">{{ tag }}</text>
                </view>
            </view>
        </view>
        
        <view v-else class="empty-state">
            <text class="empty-icon">📭</text>
            <text class="empty-text">暂无岗位数据</text>
            <text class="empty-desc">请确保后端服务已启动</text>
        </view>
    </view>
</template>

<script>
import jobApi from '@/api/job.js'

export default {
    data() {
        return {
            searchKeyword: '',
            activeFilter: 0,
            filters: ['全部', '前端', '后端', '算法', '产品', '运营'],
            jobList: []
        }
    },
    
    onLoad() {
        this.loadJobList()
    },
    
    onPullDownRefresh() {
        this.loadJobList()
        setTimeout(() => {
            uni.stopPullDownRefresh()
        }, 1000)
    },
    
    methods: {
        async loadJobList() {
            try {
                const data = await jobApi.getJobList()
                if (data && Array.isArray(data)) {
                    this.jobList = data
                }
            } catch (error) {
                console.error('加载岗位列表失败:', error)
                this.jobList = this.getMockJobs()
            }
        },
        
        getMockJobs() {
            return [
                {
                    id: 1,
                    title: '前端开发工程师',
                    company: '字节跳动',
                    salary: '25-45K',
                    location: '北京',
                    experience: '1-3年',
                    education: '本科',
                    tags: ['Vue', 'React', 'TypeScript']
                },
                {
                    id: 2,
                    title: '后端开发工程师',
                    company: '阿里巴巴',
                    salary: '30-50K',
                    location: '杭州',
                    experience: '3-5年',
                    education: '本科',
                    tags: ['Java', 'Spring', 'MySQL']
                },
                {
                    id: 3,
                    title: '算法工程师',
                    company: '腾讯',
                    salary: '35-60K',
                    location: '深圳',
                    experience: '3-5年',
                    education: '硕士',
                    tags: ['Python', '机器学习', '深度学习']
                }
            ]
        },
        
        handleSearch() {
            uni.showToast({
                title: '搜索功能开发中',
                icon: 'none'
            })
        },
        
        viewJobDetail(job) {
            uni.showToast({
                title: '查看岗位详情',
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
}

.search-section {
    padding: 30rpx;
    background: white;
}

.search-bar {
    display: flex;
    align-items: center;
    background: #f8fafc;
    border-radius: 16rpx;
    padding: 24rpx 30rpx;
    border: 2rpx solid #e2e8f0;
}

.search-icon {
    font-size: 32rpx;
    margin-right: 20rpx;
}

.search-input {
    flex: 1;
    font-size: 28rpx;
}

.filter-section {
    background: white;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
}

.filter-scroll {
    white-space: nowrap;
    padding: 0 30rpx;
}

.filter-item {
    display: inline-block;
    padding: 16rpx 32rpx;
    background: #f0f0f0;
    border-radius: 30rpx;
    font-size: 26rpx;
    color: #666;
    margin-right: 20rpx;
    transition: all 0.3s ease;
}

.filter-item.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.job-list {
    padding: 30rpx;
}

.job-card {
    background: white;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.job-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16rpx;
}

.job-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #1a1a1a;
    flex: 1;
}

.job-salary {
    font-size: 32rpx;
    font-weight: 700;
    color: #f5576c;
    flex-shrink: 0;
    margin-left: 20rpx;
}

.job-company {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 20rpx;
}

.job-info {
    display: flex;
    gap: 16rpx;
    margin-bottom: 20rpx;
}

.info-tag {
    font-size: 24rpx;
    color: #999;
    background: #f8fafc;
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
}

.job-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
}

.tag {
    font-size: 22rpx;
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 30rpx;
}

.empty-icon {
    font-size: 120rpx;
    margin-bottom: 30rpx;
}

.empty-text {
    font-size: 32rpx;
    color: #999;
    margin-bottom: 10rpx;
}

.empty-desc {
    font-size: 24rpx;
    color: #ccc;
}
</style>
