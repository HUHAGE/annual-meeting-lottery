const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

// 读取package.json获取版本号
const pkg = require('../package.json')

// 创建输出目录
const outputDir = path.resolve(__dirname, '../dist-utools')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

// 创建zip文件
const output = fs.createWriteStream(path.join(outputDir, `lucky-draw-${pkg.version}.upx`))
const archive = archiver('zip')

output.on('close', () => {
  console.log('打包完成!')
})

archive.on('error', (err) => {
  throw err
})

// 添加构建文件
archive.directory('dist/', false)

// 添加插件配置文件
archive.file('plugin.json', { name: 'plugin.json' })
archive.file('logo.png', { name: 'logo.png' })
archive.file('preload.js', { name: 'preload.js' })

archive.pipe(output)
archive.finalize() 