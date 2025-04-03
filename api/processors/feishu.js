/**
 * 处理来自飞书多维表格的数据
 */
const slugify = require('slugify')

/**
 * 处理飞书多维表格的数据并转换为内容结构
 * @param {object} webhookData - 飞书webhook发送的原始数据
 * @returns {object} 处理后的内容对象
 */
async function processFeishuData(webhookData) {
  // 解析飞书数据
  const { event, action } = webhookData

  // 仅处理表格记录更新
  if (action !== 'record_created' && action !== 'record_updated') {
    throw new Error('不支持的事件类型')
  }

  // 提取表格字段
  const { record } = event

  // 根据内容类型处理
  let contentType = 'blog' // 默认类型
  if (record.表格类型 && record.表格类型.value) {
    contentType = record.表格类型.value.toLowerCase()
  }

  // 构建基础内容结构
  const processedData = {
    contentType,
    title: record.标题?.value || '未命名文章',
    description: record.摘要?.value || '',
    content: record.内容?.value || '',
    date: new Date().toISOString(),
    slug: '',
    tags: [],
    images: [],
    metaData: {},
  }

  // 生成slug
  processedData.slug = slugify(processedData.title, {
    lower: true,
    strict: true,
    locale: 'zh-CN',
  })

  // 处理标签
  if (record.标签?.value) {
    try {
      // 假设标签是以逗号分隔的字符串
      processedData.tags = record.标签.value.split(',').map(tag => tag.trim())
    }
    catch {
      processedData.tags = []
    }
  }

  // 处理图片
  if (record.主图?.value) {
    try {
      const imageUrl = record.主图.value
      processedData.images.push({
        src: imageUrl,
        alt: processedData.title,
      })
    }
    catch {
      // 图片处理失败
    }
  }

  // 处理元数据
  processedData.metaData = {
    author: record.作者?.value || '卫培教育',
    source: '飞书自动发布',
    category: record.分类?.value || '未分类',
  }

  return processedData
}

module.exports = {
  processFeishuData,
}
