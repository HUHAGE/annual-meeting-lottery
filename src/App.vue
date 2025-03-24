<template>
  <div class="app-container" :style="backgroundStyle">
    <el-config-provider :locale="zhCn">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useSettingsStore } from './store/settings'
import { usePrizesStore } from './store/prizes'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const settingsStore = useSettingsStore()
const prizesStore = usePrizesStore()

onMounted(() => {
  // 确保 store 被正确初始化
  prizesStore.initializeStore()
})

const backgroundStyle = computed(() => {
  const { backgroundType, backgroundColor, backgroundImage } = settingsStore
  
  if (backgroundType === 'image' && backgroundImage) {
    return {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  
  return {
    backgroundColor: backgroundColor || '#f0f2f5'
  }
})
</script>

<style>
.app-container {
  min-height: 100vh;
  width: 100%;
}

/* 全局弹窗样式 */
.el-dialog {
  border-radius: 20px !important;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15) !important;
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  max-width: 1200px;
  margin: 15vh auto !important;
}

.el-dialog__header {
  margin: 0 !important;
  padding: 24px 32px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  position: relative;
}

.el-dialog__title {
  font-size: 20px !important;
  font-weight: 600;
  color: #2c3e50;
}

.el-dialog__headerbtn {
  position: absolute !important;
  top: 24px !important;
  right: 24px !important;
  width: 32px !important;
  height: 32px !important;
  padding: 0 !important;
  background: rgba(0, 0, 0, 0.04) !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.3s ease !important;
}

.el-dialog__headerbtn:hover {
  background: rgba(0, 0, 0, 0.08) !important;
  transform: rotate(90deg);
}

.el-dialog__headerbtn .el-dialog__close {
  font-size: 18px !important;
  color: #606266 !important;
}

.el-dialog__headerbtn:hover .el-dialog__close {
  color: #409EFF !important;
}

.el-dialog__body {
  padding: 32px !important;
  color: #2c3e50;
}

.el-dialog__footer {
  padding: 16px 32px 24px !important;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}

/* 弹窗按钮样式 */
.el-dialog__footer .el-button {
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.el-dialog__footer .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.el-dialog__footer .el-button--primary {
  background: #409EFF;
  border-color: #409EFF;
}

.el-dialog__footer .el-button--primary:hover {
  background: #66b1ff;
  border-color: #66b1ff;
}

/* 弹窗动画效果 */
.el-overlay-dialog {
  animation: dialogFadeIn 0.3s ease-out;
}

@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 优化对话框全局过渡效果 */
.el-overlay {
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.el-dialog {
  margin: 15vh auto !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* 防止内容闪烁 */
.el-dialog__body {
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

/* 优化按钮点击效果 */
.el-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

/* 确保背景内容不会闪烁 */
.layout-container {
  background-color: transparent;
  transition: background-color 0.3s ease;
}
</style> 