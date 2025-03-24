# 幸运抽奖系统 (Lucky Draw System)

一个现代化的抽奖系统，支持大屏展示、炫酷动画效果和灵活的奖项配置。

## 核心功能

### 1. 抽奖界面
- 3D 球形动态展示参与者
- 炫酷的开始/停止动画效果
- 大屏适配的字体和布局
- 获奖者信息华丽展示

### 2. 奖项管理
- 自定义奖项名称和数量
- 奖项展示效果配置
- 已抽奖项的自动跳过

### 3. 参与者管理
- Excel 批量导入
- 在线添加/编辑
- 中奖人员自动过滤

### 4. 系统设置
- 动画速度调节
- 音效开关
- 主题切换
- 显示效果配置

## 技术栈
- Vue 3 (组合式 API)
- Three.js (3D 动画)
- GSAP (动画效果)
- Element Plus (UI 组件)
- Vite (构建工具)

## 项目结构 
```
lucky-draw/
├── src/
│ ├── assets/    # 静态资源
│ ├── components/# 组件
│ ├── views/     # 页面
│ │ ├── Home.vue       # 抽奖主页
│ │ ├── Participants.vue # 名单管理
│ │ ├── Prizes.vue    # 奖项设置
│ │ ├── History.vue   # 抽奖历史
│ │ └── Settings.vue  # 系统设置
│ ├── store/     # 状态管理
│ │ ├── participants.js # 参与者管理
│ │ ├── prizes.js      # 奖项管理
│ │ ├── history.js     # 历史记录
│ │ └── settings.js    # 系统设置
│ ├── utils/     # 工具函数
│ └── App.vue    # 根组件
├── public/      # 公共资源
└── package.json # 项目配置
```

## 技术栈

- Vue 3 - 渐进式JavaScript框架
- Vite - 下一代前端构建工具
- Element Plus - Vue 3的UI组件库
- XLSX.js - Excel文件处理
- Material Design Icons - 图标库
- Animate.css - 动画效果库
- Pinia - Vue状态管理
- Vue Router - 路由管理

## 注意事项

- 建议使用1920x1080及以上分辨率
- 建议使用Chrome浏览器获得最佳体验
- Excel导入时请确保文件格式正确
- 建议提前准备好奖项信息和图片
- 抽奖过程中请勿刷新页面
- 请定期导出保存抽奖历史

## 常见问题

1. Excel导入失败
   - 检查文件格式是否正确
   - 确保文件未被其他程序占用
   - 尝试重新导出Excel文件

2. 抽奖按钮无反应
   - 检查是否已选择奖项
   - 确认参与者人数是否足够
   - 检查是否正在抽奖中

3. 背景图片上传失败
   - 检查图片格式是否支持
   - 确保图片大小在限制范围内
   - 尝试使用其他图片

## 更新日志

### v1.0.0
- 基础功能实现
- Excel导入支持
- 奖项管理
- 抽奖动画
- 历史记录
- 数据持久化

## 贡献指南

欢迎提交Issue和Pull Request，一起完善这个项目。

## 许可证

MIT License 