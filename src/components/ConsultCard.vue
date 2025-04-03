<script setup>
import { ref } from 'vue'

const props = defineProps({
  consultCount: { type: Number, default: 3568 },
  levels: {
    type: Array,
    default: () => ['高起专', '专升本', '高升本'],
  },
  categories: {
    type: Array,
    default: () => ['经济管理类', '理工类', '文史类', '教育学', '医学类'],
  },
  sourceType: { type: String, default: 'article' },
  sourceId: { type: String, default: '' },
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitMessage = ref('')
const showMessage = ref(false)

// 表单数据
const form = ref({
  name: '',
  phone: '',
  level: '',
  interest: '',
  source: props.sourceType,
  sourceId: props.sourceId,
})

// 提交表单
async function submitConsult() {
  if (isSubmitting.value)
    return

  isSubmitting.value = true

  try {
    // 这里替换为实际的API调用
    // const response = await fetch('/api/consult', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(form.value)
    // })

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 成功处理
    submitSuccess.value = true
    submitMessage.value = '提交成功！我们的顾问将尽快与您联系。'
    showMessage.value = true

    // 重置表单
    form.value = {
      name: '',
      phone: '',
      level: '',
      interest: '',
      source: props.sourceType,
      sourceId: props.sourceId,
    }
  }
  catch (error) {
    console.error('提交失败:', error)
    submitMessage.value = '提交失败，请稍后再试'
    showMessage.value = true
  }
  finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-6 my-8 shadow-sm border border-red-100">
    <div class="text-center mb-5">
      <h3 class="text-xl font-bold text-red-700">
        免费获取招生简章与报考指导
      </h3>
      <p class="text-gray-600 mt-1">
        已有{{ consultCount }}人成功获取，平均回复时间2小时
      </p>
    </div>

    <form class="space-y-4" @submit.prevent="submitConsult">
      <!-- 姓名和手机号 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            v-model="form.name"
            type="text"
            placeholder="您的姓名"
            required
            class="w-full px-4 py-2 rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
          >
        </div>
        <div>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="手机号码"
            required
            pattern="1[3-9]\d{9}"
            class="w-full px-4 py-2 rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
          >
        </div>
      </div>

      <!-- 学历层次和意向专业 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <select
            v-model="form.level"
            required
            class="w-full px-4 py-2 rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
          >
            <option value="">
              选择学历层次
            </option>
            <option v-for="level in levels" :key="level" :value="level">
              {{ level }}
            </option>
          </select>
        </div>
        <div>
          <select
            v-model="form.interest"
            required
            class="w-full px-4 py-2 rounded border border-gray-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition"
          >
            <option value="">
              意向专业类别
            </option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div>
      </div>

      <!-- 提交按钮 -->
      <button
        type="submit"
        class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition duration-200 flex items-center justify-center"
        :disabled="isSubmitting"
      >
        <span v-if="isSubmitting">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          提交中...
        </span>
        <span v-else>立即咨询</span>
      </button>
    </form>

    <div class="mt-4 text-center text-sm text-gray-500">
      <p>提交即视为同意《隐私保护协议》</p>
      <div class="mt-2 flex justify-center gap-4">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span>咨询热线: 020-12345678</span>
        </div>
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>工作时间: 9:00-18:00</span>
        </div>
      </div>
    </div>
  </div>
</template>
