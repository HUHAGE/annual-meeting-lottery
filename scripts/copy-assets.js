const fs = require('fs')
const path = require('path')

// 需要复制的文件列表
const filesToCopy = [
  'logo.png',
  'favicon.ico',
  'win-sound.mp3'
]

// 复制文件到dist目录
filesToCopy.forEach(file => {
  const sourcePath = path.resolve(__dirname, '..', file)
  const targetPath = path.resolve(__dirname, '../dist', file)
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath)
    console.log(`Copied ${file} to dist directory`)
  } else {
    console.warn(`Warning: ${file} not found in root directory`)
  }
})

console.log('Assets copying completed!') 