const bodyParser = require('body-parser')
const express = require('express')
const { processFeishuData } = require('./processors/feishu')
const { generateSEO } = require('./processors/seo')
const { triggerBuild } = require('./utils/build-trigger')
const { createMdFile } = require('./utils/file-generator')

const app = express()
app.use(bodyParser.json())

// 飞书webhook接收端点
app.post('/webhook/feishu', async (req, res) => {
  try {
    // 1. 验证飞书签名
    // TODO: 实现签名验证

    // 2. 处理飞书数据
    const processedData = await processFeishuData(req.body)

    // 3. 生成SEO数据
    const withSEO = await generateSEO(processedData)

    // 4. 创建MD文件
    await createMdFile(withSEO)

    // 5. 触发构建
    await triggerBuild()

    res.status(200).json({ success: true, message: '内容已接收并处理' })
  }
  catch (error) {
    console.error('处理webhook失败:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

const PORT = require('node:process').env.PORT || 3000

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API服务运行在端口 ${PORT}`)
})
