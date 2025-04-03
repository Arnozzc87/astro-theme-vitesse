<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  title: { type: String, default: '推荐院校' },
  layout: { type: String, default: 'list' }, // list, grid
  schoolType: { type: String, default: 'all' }, // all, university, college, specialized
  region: { type: String, default: '' },
  majorCategory: { type: String, default: '' },
  maxItems: { type: Number, default: 4 },
  showTags: { type: Boolean, default: false },
  showPrograms: { type: Boolean, default: true },
  showApplyInfo: { type: Boolean, default: true },
  showMore: { type: Boolean, default: true },
  moreLink: { type: String, default: '/schools' },
  tags: {
    type: Array,
    default: () => [
      { id: 'all', name: '全部' },
      { id: 'university', name: '本科院校' },
      { id: 'college', name: '高职院校' },
      { id: 'specialized', name: '专科院校' },
    ],
  },
})

const currentTag = ref(props.schoolType)
const loading = ref(true)
const schools = ref([])

// 根据标签和条件过滤学校
const filteredSchools = computed(() => {
  if (!schools.value || schools.value.length === 0)
    return []

  let filtered = [...schools.value]

  // 根据标签筛选
  if (currentTag.value !== 'all') {
    filtered = filtered.filter(school => school.type === currentTag.value)
  }

  // 根据地区筛选
  if (props.region) {
    filtered = filtered.filter(school => school.region === props.region)
  }

  // 根据专业类别筛选
  if (props.majorCategory) {
    filtered = filtered.filter(school =>
      school.majorCategories && school.majorCategories.includes(props.majorCategory),
    )
  }

  return filtered
})

// 获取院校数据
async function fetchSchools() {
  loading.value = true

  try {
    // 这里替换为实际的API调用
    // const response = await fetch(`/api/schools?type=${props.schoolType}&region=${props.region}&major=${props.majorCategory}`)
    // schools.value = await response.json()

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 600))

    // 示例数据
    schools.value = [
      {
        id: 1,
        name: '广东工业大学',
        type: 'university',
        region: '广东',
        logo: 'https://picsum.photos/120/120?random=1',
        labels: ['211高校', '成人教育', '在职研究生'],
        programs: [
          { name: '计算机科学与技术', url: '/programs/1' },
          { name: '电气工程及自动化', url: '/programs/2' },
          { name: '国际经济与贸易', url: '/programs/3' },
          { name: '工商管理', url: '/programs/4' },
        ],
        majorCategories: ['工学', '管理学', '经济学'],
        deadline: '2025-05-15',
        url: '/schools/1',
        applyUrl: '/apply/1',
      },
      {
        id: 2,
        name: '广东财经大学',
        type: 'university',
        region: '广东',
        logo: 'https://picsum.photos/120/120?random=2',
        labels: ['财经类', '成人教育', '远程教育'],
        programs: [
          { name: '会计学', url: '/programs/5' },
          { name: '金融学', url: '/programs/6' },
          { name: '市场营销', url: '/programs/7' },
        ],
        majorCategories: ['经济学', '管理学'],
        deadline: '2025-05-20',
        url: '/schools/2',
        applyUrl: '/apply/2',
      },
      {
        id: 3,
        name: '广东轻工职业技术学院',
        type: 'college',
        region: '广东',
        logo: 'https://picsum.photos/120/120?random=3',
        labels: ['高职院校', '专升本'],
        programs: [
          { name: '食品营养与检测', url: '/programs/8' },
          { name: '机电一体化技术', url: '/programs/9' },
          { name: '电子商务', url: '/programs/10' },
        ],
        majorCategories: ['工学', '农学'],
        deadline: '2025-06-10',
        url: '/schools/3',
        applyUrl: '/apply/3',
      },
      {
        id: 4,
        name: '深圳职业技术学院',
        type: 'college',
        region: '广东',
        logo: 'https://picsum.photos/120/120?random=4',
        labels: ['高职院校', '示范性院校'],
        programs: [
          { name: '电子信息工程技术', url: '/programs/11' },
          { name: '物联网应用技术', url: '/programs/12' },
          { name: '数字媒体艺术设计', url: '/programs/13' },
        ],
        majorCategories: ['工学', '艺术学'],
        deadline: '2025-06-05',
        url: '/schools/4',
        applyUrl: '/apply/4',
      },
      {
        id: 5,
        name: '广东科学技术职业学院',
        type: 'specialized',
        region: '广东',
        logo: 'https://picsum.photos/120/120?random=5',
        labels: ['专科院校', '职业教育'],
        programs: [
          { name: '建筑工程技术', url: '/programs/14' },
          { name: '模具设计与制造', url: '/programs/15' },
          { name: '汽车检测与维修技术', url: '/programs/16' },
        ],
        majorCategories: ['工学'],
        deadline: '2025-06-15',
        url: '/schools/5',
        applyUrl: '/apply/5',
      },
    ]
  }
  catch (error) {
    console.error('获取院校失败:', error)
    schools.value = []
  }
  finally {
    loading.value = false
  }
}

// 初始加载
onMounted(fetchSchools)
</script>

<template>
  <div bg-white rounded-lg shadow-sm p-5 my-6>
    <div flex items-center justify-between mb-4>
      <h3 text-lg font-bold text-gray-800>
        {{ title }}
      </h3>

      <!-- 筛选标签 -->
      <div v-if="showTags && tags.length" flex text-sm>
        <button
          v-for="tag in tags"
          :key="tag.id"
          px-3
          py-1 rounded transition-colors :class="currentTag === tag.id ? 'bg-blue-100 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-100'"
          @click="currentTag = tag.id"
        >
          {{ tag.name }}
        </button>
      </div>
    </div>

    <!-- 学校列表 -->
    <div v-if="loading" py-8 text-center text-gray-500>
      <svg class="animate-spin h-5 w-5 mx-auto mb-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <span>加载中...</span>
    </div>

    <div v-else-if="!filteredSchools || filteredSchools.length === 0" py-8 text-center text-gray-500>
      暂无推荐院校
    </div>

    <div v-else :class="[layout === 'grid' ? 'grid grid-cols-2 gap-4' : 'space-y-4']">
      <div
        v-for="school in filteredSchools.slice(0, maxItems)"
        :key="school.id"
        :class="[
          layout === 'grid'
            ? 'bg-gray-50 rounded-lg overflow-hidden'
            : 'flex bg-gray-50 rounded-lg overflow-hidden',
        ]"
      >
        <!-- 学校图片 -->
        <div
          class="overflow-hidden"
          :class="[
            layout === 'grid'
              ? 'h-36'
              : 'flex-shrink-0 w-32',
          ]"
        >
          <img
            :src="school.logo || school.image"
            :alt="school.name"
            w-full h-full object-cover
          >
        </div>

        <!-- 学校信息 -->
        <div
          :class="[
            layout === 'grid'
              ? 'p-3'
              : 'flex-grow p-3',
          ]"
        >
          <h4 text-gray-800 font-medium line-clamp-1 hover:text-blue-600 transition-colors>
            <a :href="school.url">{{ school.name }}</a>
          </h4>

          <!-- 标签 -->
          <div mt-1 flex flex-wrap gap-1>
            <span
              v-for="(label, index) in school.labels"
              :key="index"
              px-2 py-0.5 text-xs bg-white rounded-full text-gray-600 border border-gray-200
            >
              {{ label }}
            </span>
          </div>

          <!-- 专业列表 -->
          <div v-if="showPrograms && school.programs && school.programs.length" mt-2>
            <div text-xs text-gray-500>
              热门专业：
            </div>
            <div mt-1 text-xs text-gray-600 flex flex-wrap gap-x-2 gap-y-1>
              <a
                v-for="(program, index) in school.programs.slice(0, 3)"
                :key="index"
                :href="program.url"
                hover:text-blue-600
              >
                {{ program.name }}
              </a>
              <span v-if="school.programs.length > 3">等</span>
            </div>
          </div>

          <!-- 报名信息 -->
          <div v-if="showApplyInfo" mt-2 flex justify-between items-center>
            <div text-xs>
              <span v-if="school.deadline" text-gray-500>截止:
                <span text-red-500 font-medium>{{ school.deadline }}</span>
              </span>
            </div>
            <a
              :href="school.applyUrl || school.url"
              text-xs px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full
            >
              立即报名
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- 查看更多 -->
    <div v-if="showMore && filteredSchools && filteredSchools.length > 0" mt-5 text-center>
      <a :href="moreLink" text-sm text-blue-600 hover:text-blue-700 inline-flex items-center>
        查看更多院校
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  </div>
</template>
