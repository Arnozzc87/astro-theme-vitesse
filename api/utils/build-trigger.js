const { exec } = require('node:child_process')
const process = require('node:process')
const util = require('node:util')
/**
 * 触发网站自动构建
 */
const axios = require('axios')

const execPromise = util.promisify(exec)
const ssh2 = require('ssh2')

/**
 * 触发Astro网站重新构建
 * 可选支持多种部署服务：GitHub Actions、Netlify、Vercel、阿里云等
 * @returns {Promise<object>} 构建触发结果
 */
async function triggerBuild() {
  const deployType = process.env.DEPLOY_TYPE || 'aliyun'

  switch (deployType.toLowerCase()) {
    case 'github':
      return triggerGitHubBuild()
    case 'netlify':
      return triggerNetlifyBuild()
    case 'vercel':
      return triggerVercelBuild()
    case 'aliyun':
      return triggerAliyunBuild()
    default:
      throw new Error(`不支持的部署类型: ${deployType}`)
  }
}

/**
 * 触发阿里云服务器构建
 * 支持三种方式：SSH、Webhook和本地命令
 */
async function triggerAliyunBuild() {
  const buildMethod = process.env.ALIYUN_BUILD_METHOD || 'ssh'

  try {
    switch (buildMethod.toLowerCase()) {
      case 'ssh':
        return await triggerBuildViaSSH()
      case 'webhook':
        return await triggerBuildViaWebhook()
      case 'local':
        return await triggerBuildViaLocalCommand()
      default:
        throw new Error(`不支持的阿里云构建方法: ${buildMethod}`)
    }
  }
  catch (error) {
    console.error('触发阿里云构建失败:', error.message)
    throw new Error(`触发阿里云构建失败: ${error.message}`)
  }
}

/**
 * 通过SSH连接到阿里云服务器触发构建
 */
async function triggerBuildViaSSH() {
  const host = process.env.ALIYUN_SSH_HOST
  const port = Number.parseInt(process.env.ALIYUN_SSH_PORT || '22', 10)
  const username = process.env.ALIYUN_SSH_USER
  const privateKey = process.env.ALIYUN_SSH_KEY
  const buildScript = process.env.ALIYUN_BUILD_SCRIPT || 'cd /path/to/website && git pull && npm install && npm run build'

  if (!host || !username || !privateKey) {
    throw new Error('缺少阿里云SSH配置参数')
  }

  return new Promise((resolve, reject) => {
    const conn = new ssh2.Client()

    conn.on('ready', () => {
      conn.exec(buildScript, (err, stream) => {
        if (err) {
          conn.end()
          return reject(new Error(`执行构建命令失败: ${err.message}`))
        }

        let output = ''

        stream.on('data', (data) => {
          output += data.toString()
        })

        stream.on('close', (code) => {
          conn.end()
          if (code === 0) {
            resolve({
              success: true,
              message: '阿里云服务器构建已触发',
              data: { output },
            })
          }
          else {
            reject(new Error(`构建脚本返回非零状态: ${code}, 输出: ${output}`))
          }
        })
      })
    })

    conn.on('error', (err) => {
      reject(new Error(`SSH连接失败: ${err.message}`))
    })

    conn.connect({
      host,
      port,
      username,
      privateKey,
    })
  })
}

/**
 * 通过Webhook触发阿里云服务器构建
 */
async function triggerBuildViaWebhook() {
  const webhookUrl = process.env.ALIYUN_WEBHOOK_URL
  const webhookSecret = process.env.ALIYUN_WEBHOOK_SECRET

  if (!webhookUrl) {
    throw new Error('缺少阿里云Webhook配置参数')
  }

  const headers = {
    'Content-Type': 'application/json',
  }

  if (webhookSecret) {
    headers['X-Webhook-Secret'] = webhookSecret
  }

  const response = await axios.post(webhookUrl, {
    event: 'content-update',
    timestamp: new Date().toISOString(),
  }, { headers })

  return {
    success: true,
    message: '阿里云Webhook构建已触发',
    data: response.data,
  }
}

/**
 * 通过本地命令触发构建（适用于API和网站在同一台服务器的情况）
 */
async function triggerBuildViaLocalCommand() {
  const buildScript = process.env.ALIYUN_BUILD_SCRIPT || 'cd /path/to/website && git pull && npm install && npm run build'

  const { stdout, stderr } = await execPromise(buildScript)

  if (stderr && stderr.length > 0) {
    console.warn('构建脚本警告:', stderr)
  }

  return {
    success: true,
    message: '本地构建命令已执行',
    data: { output: stdout },
  }
}

/**
 * 触发GitHub Actions工作流
 */
async function triggerGitHubBuild() {
  try {
    const owner = process.env.GITHUB_OWNER
    const repo = process.env.GITHUB_REPO
    const workflow_id = process.env.GITHUB_WORKFLOW_ID
    const token = process.env.GITHUB_TOKEN

    if (!owner || !repo || !workflow_id || !token) {
      throw new Error('缺少GitHub配置参数')
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`

    const response = await axios.post(url, { ref: 'main' }, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })

    return {
      success: true,
      message: 'GitHub Actions构建已触发',
      data: response.data,
    }
  }
  catch (error) {
    console.error('触发GitHub构建失败:', error.message)
    throw new Error(`触发GitHub构建失败: ${error.message}`)
  }
}

/**
 * 触发Netlify构建
 */
async function triggerNetlifyBuild() {
  try {
    const site_id = process.env.NETLIFY_SITE_ID
    const token = process.env.NETLIFY_TOKEN

    if (!site_id || !token) {
      throw new Error('缺少Netlify配置参数')
    }

    const url = `https://api.netlify.com/build_hooks/${site_id}`

    const response = await axios.post(url, {}, {
      headers: { 'Content-Type': 'application/json' },
    })

    return {
      success: true,
      message: 'Netlify构建已触发',
      data: response.data,
    }
  }
  catch (error) {
    console.error('触发Netlify构建失败:', error.message)
    throw new Error(`触发Netlify构建失败: ${error.message}`)
  }
}

/**
 * 触发Vercel构建
 */
async function triggerVercelBuild() {
  try {
    const project_id = process.env.VERCEL_PROJECT_ID
    const token = process.env.VERCEL_TOKEN

    if (!project_id || !token) {
      throw new Error('缺少Vercel配置参数')
    }

    const url = `https://api.vercel.com/v1/projects/${project_id}/deployments`

    const response = await axios.post(url, {
      target: 'production',
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    return {
      success: true,
      message: 'Vercel构建已触发',
      data: response.data,
    }
  }
  catch (error) {
    console.error('触发Vercel构建失败:', error.message)
    throw new Error(`触发Vercel构建失败: ${error.message}`)
  }
}

module.exports = {
  triggerBuild,
}
