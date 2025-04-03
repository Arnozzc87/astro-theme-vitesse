import { defineCollection, z } from 'astro:content'

// 通用SEO字段
const seoSchema = z.object({
  keywords: z.string().optional(),
  canonicalUrl: z.string().optional(),
  structuredData: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
})

// 通用图片字段
const imageSchema = z.object({
  src: z.string(),
  alt: z.string(),
})

// 页面集合
const pages = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: imageSchema.optional(),
    seo: seoSchema.optional(),
  }),
})

// 博客集合
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    duration: z.string().optional(),
    image: imageSchema.optional(),
    date: z
      .string()
      .or(z.date())
      .transform((val: string | number | Date) => new Date(val).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })),
    draft: z.boolean().default(false).optional(),
    lang: z.string().default('zh-CN').optional(),
    tag: z.string().optional(),
    redirect: z.string().optional(),
    video: z.boolean().default(false).optional(),
    seo: seoSchema.optional(),
    author: z.string().optional(),
    category: z.string().optional(),
  }),
})

// 新增项目集合
const projects = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: imageSchema.optional(),
    date: z
      .string()
      .or(z.date())
      .transform((val: string | number | Date) => new Date(val).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })),
    category: z.string().optional(), // 项目分类
    features: z.array(z.string()).optional(), // 项目特点
    requirements: z.array(z.string()).optional(), // 报名要求
    duration: z.string().optional(), // 学制
    price: z.string().optional(), // 费用
    priority: z.number().default(0).optional(), // 优先级
    draft: z.boolean().default(false).optional(),
    seo: seoSchema.optional(),
    faq: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ).optional(),
  }),
})

// 新增院校集合
const schools = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    image: imageSchema.optional(),
    date: z
      .string()
      .or(z.date())
      .transform((val: string | number | Date) => new Date(val).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })),
    location: z.string().optional(), // 院校位置
    level: z.string().optional(), // 院校级别
    programs: z.array( // 招生项目
      z.object({
        name: z.string(),
        description: z.string().optional(),
        price: z.string().optional(),
      }),
    ).optional(),
    priority: z.number().default(0).optional(), // 优先级
    draft: z.boolean().default(false).optional(),
    seo: seoSchema.optional(),
  }),
})

// 新增通知集合
const notices = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z
      .string()
      .or(z.date())
      .transform((val: string | number | Date) => new Date(val).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })),
    image: imageSchema.optional(),
    type: z.enum(['政策', '招生', '教务', '其他']).default('其他'), // 通知类型
    importance: z.enum(['高', '中', '低']).default('中'), // 重要性
    expireDate: z.string().or(z.date()).optional(), // 过期日期
    draft: z.boolean().default(false).optional(),
    seo: seoSchema.optional(),
  }),
})

export const collections = {
  pages,
  blog,
  projects,
  schools,
  notices,
}
