/**
 * 自动生成SEO相关内容
 */
const process = require('node:process')
const {
  generateWithAI,
  generateJSONWithAI,
  batchGenerateWithAI,
} = require('./ai-provider')

const {
  metaDescriptionPrompt,
  keywordsPrompt,
  faqPrompt,
  imageAltPrompt,
  structuredDataPrompt,
  internalLinkPrompt,
  competitiveAnalysisPrompt,
} = require('./prompt-templates')

/**
 * 生成SEO元数据、FAQ和结构化数据
 * @param {object} contentData - 处理后的内容数据
 * @returns {object} 添加了SEO数据的内容对象
 */
async function generateSEO(contentData) {
  try {
    // 复制原始数据
    const enrichedData = { ...contentData }

    // 基础信息（用于生成请求）
    const baseParams = {
      title: contentData.title,
      content: contentData.content,
      contentType: contentData.contentType,
      description: contentData.description,
    }

    // 并行生成基础SEO数据
    const [description, keywords, canonicalUrl] = await Promise.all([
      generateMetaDescription(baseParams),
      generateKeywords(baseParams),
      generateCanonicalUrl(contentData),
    ])

    // 设置基础SEO数据
    enrichedData.seo = {
      title: contentData.title,
      description,
      keywords,
      canonicalUrl,
      structuredData: {},
      faq: [],
      internalLinks: [],
    }

    // 处理图片SEO（如果有）
    if (contentData.images && contentData.images.length > 0) {
      enrichedData.images = await enhanceImageMetadata(contentData.images, baseParams)
    }

    // 根据内容类型生成不同的SEO数据
    const promises = []

    // 为项目页生成FAQ
    if (contentData.contentType === 'project') {
      // 首先解析已生成的关键词
      const keywordsArray = keywords.split(',').map(k => k.trim())
      const keywordParams = { ...baseParams, keywords: keywordsArray }

      promises.push(
        generateFAQ(keywordParams).then((faq) => {
          enrichedData.seo.faq = faq
        }),
      )

      promises.push(
        generateStructuredData({
          ...baseParams,
          structureType: 'project',
        }).then((data) => {
          enrichedData.seo.structuredData = data
        }),
      )
    }
    else if (contentData.contentType === 'school') {
      promises.push(
        generateStructuredData({
          ...baseParams,
          structureType: 'school',
        }).then((data) => {
          enrichedData.seo.structuredData = data
        }),
      )
    }
    else {
      promises.push(
        generateStructuredData({
          ...baseParams,
          structureType: 'article',
          date: contentData.date,
        }).then((data) => {
          enrichedData.seo.structuredData = data
        }),
      )
    }

    // 为所有内容生成内部链接建议
    promises.push(
      generateInternalLinks(baseParams).then((links) => {
        enrichedData.seo.internalLinks = links
      }),
    )

    // 如果启用了竞争分析
    if (process.env.ENABLE_COMPETITIVE_ANALYSIS === 'true') {
      promises.push(
        generateCompetitiveAnalysis(baseParams).then((analysis) => {
          enrichedData.seo.competitiveAnalysis = analysis
        }),
      )
    }

    // 等待所有异步操作完成
    await Promise.all(promises)

    return enrichedData
  }
  catch (error) {
    console.error('SEO生成失败:', error)
    // 出错时返回原始数据
    return contentData
  }
}

/**
 * 生成meta描述
 */
async function generateMetaDescription(params) {
  try {
    const prompt = metaDescriptionPrompt(params)

    // 设置更适合生成描述的参数
    return await generateWithAI(prompt, {
      max_tokens: 200,
      temperature: 0.7,
    })
  }
  catch {
    // 出错时使用标题或描述
    return params.description || params.title
  }
}

/**
 * 生成关键词
 */
async function generateKeywords(params) {
  try {
    const prompt = keywordsPrompt(params)

    return await generateWithAI(prompt, {
      max_tokens: 100,
      temperature: 0.7,
    })
  }
  catch {
    // 出错时使用标签或默认关键词
    if (params.tags && params.tags.length > 0) {
      return params.tags.join(', ')
    }
    return '成人高考, 学历提升, 专升本, 广东学历教育'
  }
}

/**
 * 生成规范URL
 */
function generateCanonicalUrl(contentData) {
  const baseUrl = process.env.WEBSITE_URL || 'https://weipei.edu.cn'

  if (contentData.contentType === 'blog') {
    return `${baseUrl}/blog/${contentData.slug}`
  }
  else if (contentData.contentType === 'project') {
    return `${baseUrl}/project/${contentData.slug}`
  }
  else if (contentData.contentType === 'school') {
    return `${baseUrl}/school/${contentData.slug}`
  }
  else if (contentData.contentType === 'notice') {
    return `${baseUrl}/notice/${contentData.slug}`
  }

  return `${baseUrl}/${contentData.slug}`
}

/**
 * 增强图片元数据
 */
async function enhanceImageMetadata(images, params) {
  const enhancedImages = [...images]

  // 如果有多张图片，批量生成alt文本
  if (enhancedImages.length > 1) {
    const requests = enhancedImages.map((_, index) => ({
      prompt: imageAltPrompt({
        ...params,
        imageIndex: index + 1,
      }),
      options: {
        max_tokens: 50,
        temperature: 0.7,
      },
    }))

    try {
      const altTexts = await batchGenerateWithAI(requests)

      // 更新alt文本
      altTexts.forEach((alt, index) => {
        if (index < enhancedImages.length) {
          enhancedImages[index].alt = alt
        }
      })
    }
    catch {
      // 保持原样
    }
  }
  // 如果只有一张图片且只有默认alt文本
  else if (enhancedImages.length === 1 && enhancedImages[0].alt === params.title) {
    try {
      const prompt = imageAltPrompt(params)
      enhancedImages[0].alt = await generateWithAI(prompt, {
        max_tokens: 50,
        temperature: 0.7,
      })
    }
    catch {
      // 保持原样
    }
  }

  return enhancedImages
}

/**
 * 生成FAQ问答对
 */
async function generateFAQ(params) {
  try {
    const prompt = faqPrompt(params)

    return await generateJSONWithAI(prompt, {
      max_tokens: 800,
      temperature: 0.7,
    })
  }
  catch {
    return []
  }
}

/**
 * 生成结构化数据
 */
async function generateStructuredData(params) {
  try {
    const prompt = structuredDataPrompt(params)

    return await generateJSONWithAI(prompt, {
      max_tokens: 600,
      temperature: 0.3, // 较低的温度以确保JSON有效
    })
  }
  catch {
    // 出错时生成基本结构化数据
    switch (params.contentType) {
      case 'project':
        return generateProjectStructuredData(params)
      case 'school':
        return generateSchoolStructuredData(params)
      default:
        return generateArticleStructuredData(params)
    }
  }
}

/**
 * 生成内部链接建议
 */
async function generateInternalLinks(params) {
  try {
    const prompt = internalLinkPrompt(params)

    return await generateJSONWithAI(prompt, {
      max_tokens: 600,
      temperature: 0.7,
    })
  }
  catch {
    return []
  }
}

/**
 * 生成竞争分析
 */
async function generateCompetitiveAnalysis(params) {
  try {
    const prompt = competitiveAnalysisPrompt(params)

    return await generateJSONWithAI(prompt, {
      max_tokens: 800,
      temperature: 0.7,
    })
  }
  catch {
    return {
      competitiveKeywords: [],
      contentGaps: [],
      userIntentStrategies: [],
      uniqueOpportunities: [],
    }
  }
}

/**
 * 生成项目结构化数据
 */
function generateProjectStructuredData(params) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    'name': params.title,
    'description': params.description || params.title,
    'provider': {
      '@type': 'Organization',
      'name': '东莞市卫培教育培训中心',
      'sameAs': 'https://weipei.edu.cn',
    },
  }
}

/**
 * 生成院校结构化数据
 */
function generateSchoolStructuredData(params) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    'name': params.title,
    'description': params.description || params.title,
  }
}

/**
 * 生成文章结构化数据
 */
function generateArticleStructuredData(params) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': params.title,
    'description': params.description || params.title,
    'datePublished': params.date || new Date().toISOString(),
    'author': {
      '@type': 'Organization',
      'name': '东莞市卫培教育培训中心',
    },
  }
}

module.exports = {
  generateSEO,
}
