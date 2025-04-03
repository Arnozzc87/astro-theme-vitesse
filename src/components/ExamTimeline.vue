<script setup>
const props = defineProps({
  examType: { type: String, default: '成人高考' },
  year: { type: Number, default: () => new Date().getFullYear() },
  events: {
    type: Array,
    default: () => [
      { date: '2025-03-01', title: '网上报名开始' },
      { date: '2025-05-15', title: '现场确认' },
      { date: '2025-08-20', title: '准考证打印' },
      { date: '2025-10-19', title: '全国统考' },
      { date: '2025-12-25', title: '成绩公布' },
    ],
  },
  detailLink: { type: String, default: '/exam-schedule' },
})

// 格式化日期: 2025-03-01 => 3月1日
function formatDate(dateStr) {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

// 判断是否是当前活跃阶段
function isActive(dateStr) {
  const _now = new Date()
  const _eventDate = new Date(dateStr)
  const nextEvent = findNextEvent()

  // 如果是下一个即将到来的事件，标记为活跃
  if (nextEvent && nextEvent.date === dateStr) {
    return true
  }

  return false
}

// 查找下一个即将到来的事件
function findNextEvent() {
  const now = new Date()
  // 按日期排序事件
  const sortedEvents = [...props.events].sort((a, b) => new Date(a.date) - new Date(b.date))
  // 找到下一个未发生的事件
  return sortedEvents.find(event => new Date(event.date) > now)
}

// 获取倒计时文本
function getCountdown(dateStr) {
  const now = new Date()
  const eventDate = new Date(dateStr)
  const diffTime = eventDate - now
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    return '已结束'
  }
  else if (diffDays === 0) {
    return '今天'
  }
  else {
    return `还剩 ${diffDays} 天`
  }
}
</script>

<template>
  <div class="bg-gray-50 rounded-lg p-6 my-8 shadow-sm">
    <h3 class="text-xl font-bold text-center mb-4">
      {{ year }}年{{ examType }}考试安排
    </h3>

    <div class="relative">
      <!-- 时间轴主轴 -->
      <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gray-300" />

      <!-- 时间轴项目 -->
      <div class="space-y-10 relative">
        <div
          v-for="(event, index) in events"
          :key="index"
          class="flex items-center"
          :class="{ 'opacity-80': !isActive(event.date), 'opacity-100': isActive(event.date) }"
        >
          <!-- 左侧日期 -->
          <div class="w-1/2 pr-8 text-right">
            <div :class="isActive(event.date) ? 'text-red-600 font-bold' : 'text-gray-600'">
              {{ formatDate(event.date) }}
            </div>
          </div>

          <!-- 中间节点 -->
          <div
            class="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full border-4"
            :class="isActive(event.date) ? 'bg-red-500 border-red-200' : 'bg-gray-500 border-gray-200'"
          />

          <!-- 右侧内容 -->
          <div class="w-1/2 pl-8">
            <div class="font-medium" :class="isActive(event.date) ? 'text-red-600' : 'text-gray-700'">
              {{ event.title }}
            </div>
            <div v-if="isActive(event.date)" class="text-red-500 text-sm mt-1">
              {{ getCountdown(event.date) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center mt-6">
      <a :href="detailLink" class="text-red-600 hover:text-red-700 font-medium inline-flex items-center">
        查看完整考试安排
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  </div>
</template>
