<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  title: { type: String, default: '热门文章' },
  articleType: { type: String, default: 'popular' }, // popular, latest, related
  category: { type: String, default: '' },
  tag: { type: String, default: '' },
  maxItems: { type: Number, default: 5 },
  showImage: { type: Boolean, default: true },
  showRank: { type: Boolean, default: true },
  showDate: { type: Boolean, default: true },
  showViews: { type: Boolean, default: true },
  showMeta: { type: Boolean, default: true },
  showTabs: { type: Boolean, default: false },
  showMore: { type: Boolean, default: true },
  moreLink: { type: String, default: '/articles' },
  tabs: {
    type: Array,
    default: () => [
      { id: 'popular', name: '热门' },
      { id: 'latest', name: '最新' },
    ],
  },
})

const currentTab = ref(props.articleType)
const loading = ref(true)
const articles = ref([])

// 格式化日期: 2023-01-01 => 01-01
function formatDate(dateStr) {
  if (!dateStr)
    return ''
  const date = new Date(dateStr)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day}`
}

// 当前标签页的文章
const currentArticles = computed(() => {
  if (!articles.value || articles.value.length === 0)
    return []

  // 根据标签筛选
  if (currentTab.value === 'popular') {
    return [...articles.value].sort((a, b) => b.views - a.views)
  }
  else if (currentTab.value === 'latest') {
    return [...articles.value].sort((a, b) => new Date(b.date) - new Date(a.date))
  }
  else if (currentTab.value === 'related') {
    // 根据相关性排序逻辑，这里用views代替
    return [...articles.value].sort((a, b) => b.views - a.views)
  }

  return articles.value
})

// 获取文章数据
async function fetchArticles() {
  loading.value = true

  try {
    // 这里替换为实际的API调用
    // const response = await fetch(`/api/articles?type=${props.articleType}&category=${props.category}&tag=${props.tag}`)
    // articles.value = await response.json()

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 示例数据
    articles.value = [
      {
        id: 1,
        title: '2025年广东成人高考报名条件及流程详解',
        date: '2025-01-15',
        views: 3560,
        image: 'https://picsum.photos/200/120?random=1',
        url: '/article/1',
      },
      {
        id: 2,
        title: '专升本VS高升本：哪种提升方式更适合在职人士？',
        date: '2025-01-10',
        views: 2870,
        image: 'https://picsum.photos/200/120?random=2',
        url: '/article/2',
      },
      {
        id: 3,
        title: '成人高考备考攻略：如何高效利用碎片时间',
        date: '2025-01-05',
        views: 2150,
        image: 'https://picsum.photos/200/120?random=3',
        url: '/article/3',
      },
      {
        id: 4,
        title: '广东地区热门院校专业对比分析',
        date: '2024-12-28',
        views: 1890,
        image: 'https://picsum.photos/200/120?random=4',
        url: '/article/4',
      },
      {
        id: 5,
        title: '成考学历在求职中的优势与使用指南',
        date: '2024-12-22',
        views: 1670,
        image: 'https://picsum.photos/200/120?random=5',
        url: '/article/5',
      },
      {
        id: 6,
        title: '在职考研与成人高考：双重提升的可行性分析',
        date: '2024-12-18',
        views: 1450,
        image: 'https://picsum.photos/200/120?random=6',
        url: '/article/6',
      },
    ]
  }
  catch (error) {
    console.error('获取文章失败:', error)
    articles.value = []
  }
  finally {
    loading.value = false
  }
}

// 监听标签变化重新获取数据
// 这里简化处理，实际使用中可能需要根据标签发起不同请求
// watch(currentTab, fetchArticles)

// 初始加载
onMounted(fetchArticles)
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-5 my-6">
    <div flex items-center justify-between mb-4>
      <h3 text-lg font-bold text-gray-800>
        {{ title }}
      </h3>

      <!-- 选项卡 -->
      <div v-if="showTabs" flex text-sm>
        <button
          v-for="tab in tabs"
          :key="tab.id"
          px-3
          py-1 rounded transition-colors :class="currentTab === tab.id ? 'bg-red-100 text-red-600 font-medium' : 'text-gray-600 hover:bg-gray-100'"
          @click="currentTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- 文章列表 -->
    <div v-if="loading" py-8 text-center text-gray-500>
      <svg class="animate-spin h-5 w-5 mx-auto mb-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <span>加载中...</span>
    </div>

    <div v-else-if="!currentArticles || currentArticles.length === 0" py-8 text-center text-gray-500>
      暂无文章
    </div>

    <div v-else space-y-4>
      <div
        v-for="(article, index) in currentArticles.slice(0, maxItems)"
        :key="article.id"
        flex
      >
        <!-- 排名标记 -->
        <div v-if="showRank" flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mr-3 mt-1>
          <span text-sm font-bold :class="index < 3 ? 'text-red-500' : 'text-gray-500'">{{ index + 1 }}</span>
        </div>

        <!-- 文章图片 -->
        <div v-if="showImage && article.image" flex-shrink-0 w-20 h-16 mr-3 overflow-hidden rounded>
          <img :src="article.image" :alt="article.title" w-full h-full object-cover>
        </div>

        <!-- 文章内容 -->
        <div flex-grow>
          <h4 text-gray-800 font-medium line-clamp-2 leading-snug hover:text-red-600 transition-colors>
            <a :href="article.url">{{ article.title }}</a>
          </h4>

          <!-- 元数据 -->
          <div v-if="showMeta" mt-1 flex text-xs text-gray-500 space-x-2>
            <span v-if="showDate" flex items-center>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(article.date) }}
            </span>

            <span v-if="showViews" flex items-center>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {{ article.views }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 查看更多 -->
    <div v-if="showMore && currentArticles && currentArticles.length > 0" mt-5 text-center>
      <a :href="moreLink" text-sm text-red-600 hover:text-red-700 inline-flex items-center>
        查看更多
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  </div>
</template>
