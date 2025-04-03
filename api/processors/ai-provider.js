/**
 * AI提供商适配器
 * 支持多种AI模型，包括OpenAI和DeepSeek
 */
const process = require('node:process')
const axios = require('axios')
const { Configuration, OpenAIApi } = require('openai')

// 初始化OpenAI
const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(openaiConfig)

/**
 * 选择并使用适当的AI提供商生成内容
 * @param {string} prompt - 提示词
 * @param {object} options - 生成选项
 * @returns {Promise<string>} 生成的内容
 */
async function generateWithAI(prompt, options = {}) {
  const provider = process.env.AI_PROVIDER || 'deepseek'

  try {
    switch (provider.toLowerCase()) {
      case 'openai':
        return await generateWithOpenAI(prompt, options)
      case 'deepseek':
        return await generateWithDeepSeek(prompt, options)
      default:
        console.warn(`未知的AI提供商: ${provider}，使用DeepSeek作为默认选项`)
        return await generateWithDeepSeek(prompt, options)
    }
  }
  catch {
    // 如果主要提供商失败，尝试备用提供商
    const backupProvider = provider.toLowerCase() === 'openai' ? 'deepseek' : 'openai'
    console.warn(`${provider}调用失败，尝试备用提供商: ${backupProvider}`)

    if (backupProvider === 'openai') {
      return await generateWithOpenAI(prompt, options)
    }
    else {
      return await generateWithDeepSeek(prompt, options)
    }
  }
}

/**
 * 使用OpenAI生成内容
 * @param {string} prompt - 提示词
 * @param {object} options - 生成选项
 * @returns {Promise<string>} 生成的内容
 */
async function generateWithOpenAI(prompt, options = {}) {
  const {
    model = 'gpt-3.5-turbo-instruct',
    temperature = 0.7,
    max_tokens = 200,
  } = options

  const response = await openai.createCompletion({
    model,
    prompt,
    temperature,
    max_tokens,
  })

  return response.data.choices[0].text.trim()
}

/**
 * 使用DeepSeek生成内容
 * @param {string} prompt - 提示词
 * @param {object} options - 生成选项
 * @returns {Promise<string>} 生成的内容
 */
async function generateWithDeepSeek(prompt, options = {}) {
  const {
    model = 'deepseek-chat',
    temperature = 0.7,
    max_tokens = 200,
  } = options

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('未配置DeepSeek API密钥')
  }

  const response = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    },
  )

  return response.data.choices[0].message.content.trim()
}

/**
 * 批量生成内容
 * @param {Array<object>} requests - 请求数组，每个请求包含prompt和options
 * @returns {Promise<Array<string>>} 生成的内容数组
 */
async function batchGenerateWithAI(requests) {
  return Promise.all(requests.map(req =>
    generateWithAI(req.prompt, req.options),
  ))
}

/**
 * 生成JSON内容并解析
 * @param {string} prompt - 提示词
 * @param {object} options - 生成选项
 * @returns {Promise<object>} 解析后的JSON对象
 */
async function generateJSONWithAI(prompt, options = {}) {
  try {
    const jsonString = await generateWithAI(prompt, {
      ...options,
      temperature: 0.2, // 降低温度以获得更可预测的JSON
    })

    return JSON.parse(jsonString)
  }
  catch (error) {
    console.error('JSON解析失败:', error)
    return null
  }
}

module.exports = {
  generateWithAI,
  batchGenerateWithAI,
  generateJSONWithAI,
}
