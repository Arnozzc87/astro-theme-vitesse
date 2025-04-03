<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  title: { type: String, default: '内容分类' },
  categoryType: { type: String, default: 'all' }, // article, exam, major, school
  layout: { type: String, default: 'grid' }, // grid, list, tags
  maxItems: { type: Number, default: 12 },
  showCount: { type: Boolean, default: true },
  showTabs: { type: Boolean, default: true },
  showViewAll: { type: Boolean, default: true },
  viewAllLink: { type: String, default: '/categories' },
})

const loading = ref(true)
const categories = ref([])
const activeMainCategory = ref('all')

// 获取主分类列表
const mainCategories = computed(() => {
  if (!categories.value || categories.value.length === 0)
    return []

  // 提取所有主分类
  const mainCats = [
    { id: 'all', name: '全部' },
  ]

  // 收集所有不重复的主分类
  const uniqueMainCategories = [...new Set(
    categories.value
      .filter(cat => cat.mainCategory)
      .map(cat => cat.mainCategory),
  )]

  // 添加到主分类列表
  uniqueMainCategories.forEach((catName) => {
    mainCats.push({
      id: catName,
      name: catName,
    })
  })

  return mainCats
})

// 过滤后的分类列表
const filteredCategories = computed(() => {
  if (!categories.value || categories.value.length === 0)
    return []

  let filtered = [...categories.value]

  // 按主分类筛选
  if (activeMainCategory.value !== 'all') {
    filtered = filtered.filter(cat => cat.mainCategory === activeMainCategory.value)
  }

  // 按分类类型筛选
  if (props.categoryType !== 'all') {
    filtered = filtered.filter(cat => cat.type === props.categoryType)
  }

  // 限制数量
  return filtered.slice(0, props.maxItems)
})

// 获取分类图标
function getCategoryIcon(iconName) {
  // 这里可以根据icon名称返回对应的SVG路径
  const icons = {
    article: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
    exam: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    school: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z M12 14l-9-5 9-5 9 5-9 5z',
    major: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    guide: 'M8.627,7.885C8.499,8.388,7.873,8.101,8.13,8.177L4.12,7.143c-0.218-0.057-0.351-0.28-0.293-0.498c0.057-0.218,0.279-0.351,0.497-0.294l4.011,1.037C8.552,7.444,8.685,7.667,8.627,7.885 M8.334,10.123L4.323,9.086C4.105,9.031,3.883,9.162,3.826,9.38C3.769,9.598,3.901,9.82,4.12,9.877l4.01,1.037c-0.262-0.062,0.373,0.192,0.497-0.294C8.685,10.401,8.552,10.18,8.334,10.123 M7.131,12.507L4.323,11.78c-0.218-0.057-0.44,0.076-0.497,0.295c-0.057,0.218,0.075,0.439,0.293,0.495l2.809,0.726c-0.265-0.062,0.37,0.193,0.495-0.293C7.48,12.784,7.35,12.562,7.131,12.507M18.159,3.677v10.701c0,0.186-0.126,0.348-0.306,0.393l-7.755,1.948c-0.07,0.016-0.134,0.016-0.204,0l-7.748-1.948c-0.179-0.045-0.306-0.207-0.306-0.393V3.677c0-0.267,0.249-0.461,0.509-0.396l7.646,1.921l7.654-1.921C17.91,3.216,18.159,3.41,18.159,3.677 M9.589,5.939L2.656,4.203v9.857l6.933,1.737V5.939z M17.344,4.203l-6.939,1.736v9.859l6.939-1.737V4.203z M16.168,6.645c-0.058-0.218-0.279-0.351-0.498-0.294l-4.011,1.037c-0.218,0.057-0.351,0.28-0.293,0.498c0.128,0.503,0.755,0.216,0.498,0.292l4.009-1.034C16.092,7.085,16.225,6.863,16.168,6.645 M16.168,9.38c-0.058-0.218-0.279-0.349-0.498-0.294l-4.011,1.036c-0.218,0.057-0.351,0.279-0.293,0.498c0.124,0.486,0.759,0.232,0.498,0.294l4.009-1.037C16.092,9.82,16.225,9.598,16.168,9.38 M14.963,12.385c-0.055-0.219-0.276-0.35-0.495-0.294l-2.809,0.726c-0.218,0.056-0.351,0.279-0.293,0.496c0.127,0.506,0.755,0.218,0.498,0.293l2.807-0.723C14.89,12.825,15.021,12.603,14.963,12.385',
    default: 'M7 20l4-16m2 16l4-16M6 9h14M4 15h14',
  }

  return icons[iconName] || icons.default
}

// 获取分类数据
async function fetchCategories() {
  loading.value = true

  try {
    // 这里替换为实际的API调用
    // const response = await fetch(`/api/categories?type=${props.categoryType}`)
    // categories.value = await response.json()

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    // 示例数据
    categories.value = [
      {
        id: 1,
        name: '成人高考',
        type: 'exam',
        mainCategory: '考试信息',
        icon: 'exam',
        count: 128,
        isPopular: true,
        url: '/categories/1',
      },
      {
        id: 2,
        name: '自学考试',
        type: 'exam',
        mainCategory: '考试信息',
        icon: 'exam',
        count: 95,
        isPopular: true,
        url: '/categories/2',
      },
      {
        id: 3,
        name: '专升本',
        type: 'exam',
        mainCategory: '考试信息',
        icon: 'exam',
        count: 112,
        isPopular: true,
        url: '/categories/3',
      },
      {
        id: 4,
        name: '工学类',
        type: 'major',
        mainCategory: '专业分类',
        icon: 'major',
        count: 78,
        isPopular: false,
        url: '/categories/4',
      },
      {
        id: 5,
        name: '经济管理',
        type: 'major',
        mainCategory: '专业分类',
        icon: 'major',
        count: 86,
        isPopular: true,
        url: '/categories/5',
      },
      {
        id: 6,
        name: '医学类',
        type: 'major',
        mainCategory: '专业分类',
        icon: 'major',
        count: 45,
        isPopular: false,
        url: '/categories/6',
      },
      {
        id: 7,
        name: '备考指南',
        type: 'article',
        mainCategory: '学习资源',
        icon: 'guide',
        count: 67,
        isPopular: true,
        url: '/categories/7',
      },
      {
        id: 8,
        name: '考试技巧',
        type: 'article',
        mainCategory: '学习资源',
        icon: 'article',
        count: 54,
        isPopular: false,
        url: '/categories/8',
      },
      {
        id: 9,
        name: '本科院校',
        type: 'school',
        mainCategory: '院校信息',
        icon: 'school',
        count: 35,
        isPopular: true,
        url: '/categories/9',
      },
      {
        id: 10,
        name: '专科院校',
        type: 'school',
        mainCategory: '院校信息',
        icon: 'school',
        count: 42,
        isPopular: false,
        url: '/categories/10',
      },
      {
        id: 11,
        name: '职业规划',
        type: 'article',
        mainCategory: '学习资源',
        icon: 'article',
        count: 29,
        isPopular: false,
        url: '/categories/11',
      },
      {
        id: 12,
        name: '艺术类',
        type: 'major',
        mainCategory: '专业分类',
        icon: 'major',
        count: 31,
        isPopular: false,
        url: '/categories/12',
      },
    ]
  }
  catch (error) {
    console.error('获取分类失败:', error)
    categories.value = []
  }
  finally {
    loading.value = false
  }
}

// 初始加载
onMounted(fetchCategories)
</script>

<template>
  <div bg-white rounded-lg shadow-sm p-5 my-6>
    <div flex items-center justify-between mb-4>
      <h3 text-lg font-bold text-gray-800>
        {{ title }}
      </h3>
    </div>

    <!-- 分类导航 -->
    <div v-if="loading" py-8 text-center text-gray-500>
      <svg class="animate-spin h-5 w-5 mx-auto mb-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <span>加载中...</span>
    </div>

    <div v-else-if="!categories || categories.length === 0" py-8 text-center text-gray-500>
      暂无分类数据
    </div>

    <div v-else>
      <!-- 主分类选项卡 -->
      <div v-if="showTabs" border-b border-gray-200 mb-4>
        <div flex flex-wrap class="-mb-px">
          <button
            v-for="tab in mainCategories"
            :key="tab.id"
            mr-4
            py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors :class="activeMainCategory === tab.id
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
            @click="activeMainCategory = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <!-- 分类列表 - 网格布局 -->
      <div v-if="layout === 'grid'" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <a
          v-for="category in filteredCategories"
          :key="category.id"
          :href="category.url"
          flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors
        >
          <div v-if="category.icon" flex-shrink-0 mr-3>
            <div w-10 h-10 rounded-lg bg-white flex items-center justify-center text-green-600>
              <svg v-if="category.icon" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path :d="getCategoryIcon(category.icon)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
            </div>
          </div>
          <div flex-grow>
            <h4 text-gray-800 font-medium>{{ category.name }}</h4>
            <div v-if="showCount && category.count !== undefined" text-xs text-gray-500>
              {{ category.count }}篇文章
            </div>
          </div>
        </a>
      </div>

      <!-- 分类列表 - 列表布局 -->
      <div v-else-if="layout === 'list'" space-y-2>
        <a
          v-for="category in filteredCategories"
          :key="category.id"
          :href="category.url"
          flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors
        >
          <div flex items-center>
            <div v-if="category.icon" flex-shrink-0 mr-3 text-green-600>
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path :d="getCategoryIcon(category.icon)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
            </div>
            <span text-gray-700>{{ category.name }}</span>
          </div>
          <div v-if="showCount && category.count !== undefined" text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full>
            {{ category.count }}
          </div>
        </a>
      </div>

      <!-- 分类列表 - 标签云布局 -->
      <div v-else-if="layout === 'tags'" flex flex-wrap gap-2>
        <a
          v-for="category in filteredCategories"
          :key="category.id"
          :href="category.url"
          inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-50 hover:bg-gray-100 transition-colors
          :class="category.isPopular ? 'text-green-600 font-medium' : 'text-gray-600'"
        >
          <span>{{ category.name }}</span>
          <span v-if="showCount && category.count !== undefined" ml-1 text-xs text-gray-500>
            ({{ category.count }})
          </span>
        </a>
      </div>
    </div>

    <!-- 查看全部分类 -->
    <div v-if="showViewAll && categories && categories.length > 0" mt-5 text-center>
      <a :href="viewAllLink" text-sm text-green-600 hover:text-green-700 inline-flex items-center>
        查看全部分类
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  </div>
</template>
