/**
 * SEO提示词模板系统
 * 提供结构化、针对教育行业优化的提示词模板
 */

/**
 * 元描述生成模板
 * @param {object} params - 模板参数
 * @returns {string} 格式化后的提示词
 */
function metaDescriptionPrompt(params) {
  const { title, content, keywords = [] } = params
  const keywordsText = keywords.length > 0 ? keywords.join('、') : '成人高等教育、学历提升'

  return `作为SEO专家和教育顾问，请为以下成人教育内容生成一个吸引人且信息丰富的元描述，长度在120-160字符之间。
内容应包含关键词"${keywordsText}"，同时强调教育价值和资格认证。
遵循以下要点：
1. 包含清晰的价值主张
2. 强调文凭的官方认可性
3. 暗示就业前景提升
4. 使用行动导向语言
5. 整体风格专业、可信且积极向上

标题: ${title}
内容摘要: ${content ? content.substring(0, 500) : title}...`
}

/**
 * 关键词生成模板
 * @param {object} params - 模板参数
 * @returns {string} 格式化后的提示词
 */
function keywordsPrompt(params) {
  const { title, content, category } = params

  return `作为SEO专家和教育行业分析师，请为以下成人教育内容提取8-10个最具搜索潜力的关键词，用逗号分隔。
关键词应当：
1. 包含长尾关键词和短尾关键词的混合
2. 符合广东地区的搜索习惯和表达方式
3. 考虑搜索意图(如"如何"、"多少钱"等问询性关键词)
4. 覆盖行业术语和普通用户可能的搜索词
5. 关注转化率高的关键词(如"报名"、"学费"等)

内容分类: ${category || '成人高等教育'}
标题: ${title}
内容: ${content ? content.substring(0, 500) : title}...`
}

/**
 * FAQ生成模板
 * @param {object} params - 模板参数
 * @returns {string} 格式化后的提示词
 */
function faqPrompt(params) {
  const { title, keywords = [] } = params
  const keywordsText = keywords.length > 0 ? keywords.join('、') : ''

  return `作为教育咨询专家，为广东地区的"${title}"项目生成5个最常见且搜索量高的问题及专业解答。
问题应覆盖以下方面：
1. 报名条件和流程
2. 学习方式和难度
3. 学历证书认可度和用途
4. 学费和可能的优惠政策
5. 就业前景或晋升机会

${keywordsText ? `问答应自然融入以下关键词：${keywordsText}` : ''}
答案应当详细具体，每个回答保持在100-150字之间，语气专业权威。
返回格式为严格的JSON数组：[{"question": "问题1", "answer": "答案1"}, ...]`
}

/**
 * 图片Alt文本生成模板
 * @param {object} params - 模板参数
 * @returns {string} 格式化后的提示词
 */
function imageAltPrompt(params) {
  const { title, contentType } = params

  return `请为一篇关于"${title}"的${getContentTypeText(contentType)}中的主图生成一个SEO友好的alt文本描述，遵循以下规则：
1. 长度在10-15个汉字之间
2. 包含内容主题的关键信息
3. 描述图片内容而非文章主题
4. 不使用"图片"、"照片"等词
5. 自然融入1-2个相关关键词

生成的alt文本需简洁明了且对搜索引擎友好。`
}

/**
 * 结构化数据生成模板
 * @param {object} params - 模板参数
 * @returns {string} 格式化后的提示词
 */
function structuredDataPrompt(params) {
  const { title, contentType } = params

  let promptText = `为"${title}"这篇${getContentTypeText(contentType)}生成完整的JSON-LD结构化数据。`

  switch (contentType) {
    case 'project':
      promptText += `
结构化数据应符合Schema.org的Course类型，包含以下信息：
1. 课程名称和描述
2. 提供机构（东莞市卫培教育培训中心）
3. 课程提供地点（广东东莞）
4. 大致学费范围和时长`
      break

    case 'school':
      promptText += `
结构化数据应符合Schema.org的CollegeOrUniversity类型，包含以下信息：
1. 院校名称和描述
2. 院校位置信息
3. 开设的主要项目`
      break

    default:
      promptText += `
结构化数据应符合Schema.org的Article类型，包含以下信息：
1. 文章标题、描述和发布日期
2. 作者信息（东莞市卫培教育培训中心）
3. 发布组织信息
4. 主要内容分类`
  }

  promptText += `\n\n返回完整的JSON对象，确保语法正确无误，可被直接解析。`

  return promptText
}

/**
 * 内部链接建议生成模板
 * @param {object} params - 模板参数
 * @returns {string} 格式化后的提示词
 */
function internalLinkPrompt(params) {
  const { title, contentType, content } = params

  return `作为内容策略专家，分析以下成人教育内容，识别3-5个可以添加内部链接的关键词或短语。
目标是提高网站内链密度，增强相关性，并引导用户浏览更多相关内容。

文章类型: ${getContentTypeText(contentType)}
标题: ${title}
内容摘要: ${content ? content.substring(0, 300) : title}...

请指出:
1. 可链接的关键词/短语
2. 建议链接到的目标页面类型(如专业介绍、报名指南等)
3. 链接添加的理由

返回格式为JSON数组: [{"anchor": "关键词", "target": "目标页面类型", "reason": "添加理由"}, ...]`
}

/**
 * 竞争分析模板
 * @param {object} params - 模板参数
 * @returns {string} 格式化后的提示词
 */
function competitiveAnalysisPrompt(params) {
  const { title, contentType } = params

  return `作为SEO竞争分析专家，对"${title}"这个${getContentTypeText(contentType)}主题进行竞争分析。
考虑广东地区成人教育市场的特点，提供3-5个SEO差异化策略。

分析应包括:
1. 可能的竞争关键词及其难度评估
2. 内容差异化建议
3. 用户意图匹配策略
4. 特色内容机会

返回格式为JSON: {
  "competitiveKeywords": ["关键词1", "关键词2"...],
  "contentGaps": ["差异化内容1", "差异化内容2"...],
  "userIntentStrategies": ["策略1", "策略2"...],
  "uniqueOpportunities": ["机会1", "机会2"...]
}`
}

/**
 * 获取内容类型的中文描述
 * @param {string} contentType - 内容类型
 * @returns {string} 中文描述
 */
function getContentTypeText(contentType) {
  switch (contentType) {
    case 'project':
      return '教育项目介绍'
    case 'school':
      return '院校简介'
    case 'notice':
      return '教务通知'
    default:
      return '博客文章'
  }
}

module.exports = {
  metaDescriptionPrompt,
  keywordsPrompt,
  faqPrompt,
  imageAltPrompt,
  structuredDataPrompt,
  internalLinkPrompt,
  competitiveAnalysisPrompt,
}
