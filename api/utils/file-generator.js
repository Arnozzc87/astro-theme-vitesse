/**
 * 将处理后的数据转换为Markdown文件
 */
const fs = require('node:fs').promises
const path = require('node:path')
const process = require('node:process')

/**
 * 创建Markdown文件
 * @param {object} contentData - 处理后的内容数据（含SEO信息）
 */
async function createMdFile(contentData) {
  // 确定文件路径
  const contentDir = getContentDirectory(contentData.contentType)
  const filePath = path.join(contentDir, `${contentData.slug}.md`)

  // 生成frontmatter
  const frontmatter = generateFrontmatter(contentData)

  // 生成内容
  const content = contentData.content

  // 生成FAQ Markdown（如果有）
  let faqContent = ''
  if (contentData.seo && contentData.seo.faq && contentData.seo.faq.length > 0) {
    faqContent = '\n\n## 常见问题\n\n'
    contentData.seo.faq.forEach((item, index) => {
      faqContent += `### ${(index + 1)}. ${item.question}\n\n${item.answer}\n\n`
    })
  }

  // 组合最终文件内容
  const fileContent = `${frontmatter}\n\n${content}${faqContent}`

  // 确保目录存在
  await ensureDirectoryExists(contentDir)

  // 写入文件
  await fs.writeFile(filePath, fileContent, 'utf8')

  return filePath
}

/**
 * 根据内容类型获取目录路径
 */
function getContentDirectory(contentType) {
  const baseDir = path.join(process.cwd(), 'src', 'content')

  switch (contentType) {
    case 'project':
      return path.join(baseDir, 'projects')
    case 'school':
      return path.join(baseDir, 'schools')
    case 'notice':
      return path.join(baseDir, 'notices')
    default:
      return path.join(baseDir, 'blog')
  }
}

/**
 * 确保目录存在
 */
async function ensureDirectoryExists(dirPath) {
  try {
    await fs.mkdir(dirPath, { recursive: true })
  }
  catch (error) {
    if (error.code !== 'EEXIST') {
      throw error
    }
  }
}

/**
 * 生成frontmatter
 */
function generateFrontmatter(contentData) {
  let frontmatter = '---\n'

  // 基础frontmatter
  frontmatter += `title: "${escapeYaml(contentData.title)}"\n`
  frontmatter += `description: "${escapeYaml(contentData.seo.description)}"\n`
  frontmatter += `date: ${contentData.date}\n`

  // 标签
  if (contentData.tags && contentData.tags.length > 0) {
    frontmatter += 'tags:\n'
    contentData.tags.forEach((tag) => {
      frontmatter += `  - "${escapeYaml(tag)}"\n`
    })
  }

  // 图片
  if (contentData.images && contentData.images.length > 0) {
    const mainImage = contentData.images[0]
    frontmatter += 'image:\n'
    frontmatter += `  src: "${escapeYaml(mainImage.src)}"\n`
    frontmatter += `  alt: "${escapeYaml(mainImage.alt)}"\n`
  }

  // SEO关键词
  if (contentData.seo && contentData.seo.keywords) {
    frontmatter += `keywords: "${escapeYaml(contentData.seo.keywords)}"\n`
  }

  // 规范URL
  if (contentData.seo && contentData.seo.canonicalUrl) {
    frontmatter += `canonicalUrl: "${escapeYaml(contentData.seo.canonicalUrl)}"\n`
  }

  // 结构化数据(json字符串)
  if (contentData.seo && contentData.seo.structuredData) {
    const structuredDataStr = JSON.stringify(contentData.seo.structuredData)
    frontmatter += `structuredData: '${escapeYaml(structuredDataStr)}'\n`
  }

  // 元数据
  if (contentData.metaData) {
    if (contentData.metaData.author) {
      frontmatter += `author: "${escapeYaml(contentData.metaData.author)}"\n`
    }
    if (contentData.metaData.category) {
      frontmatter += `category: "${escapeYaml(contentData.metaData.category)}"\n`
    }
  }

  frontmatter += '---'
  return frontmatter
}

/**
 * 转义yaml字符串中的特殊字符
 */
function escapeYaml(str) {
  if (typeof str !== 'string')
    return ''
  return str
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
}

module.exports = {
  createMdFile,
}
