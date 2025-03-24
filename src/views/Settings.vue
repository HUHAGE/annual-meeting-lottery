<template>
  <div class="settings-page">
    <div class="settings-section">
      <h2 class="settings-title">系统设置</h2>
      
      <el-form :model="settings" label-width="120px" class="modern-form">
        <el-form-item label="动画速度">
          <el-select v-model="settings.animationSpeed" class="modern-select">
            <el-option label="慢速" value="slow" />
            <el-option label="正常" value="normal" />
            <el-option label="快速" value="fast" />
          </el-select>
        </el-form-item>

        <el-form-item label="中奖音效">
          <el-switch 
            v-model="settings.soundEnabled"
            class="modern-switch"
            active-color="#4CAF50"
            inactive-color="#DCDFE6"
          />
        </el-form-item>

        <el-form-item label="背景样式">
          <el-radio-group v-model="settings.backgroundStyle" class="modern-radio">
            <el-radio label="default">默认渐变</el-radio>
            <el-radio label="custom">自定义背景</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item 
          label="自定义背景" 
          v-if="settings.backgroundStyle === 'custom'"
        >
          <el-upload
            class="modern-uploader"
            :show-file-list="false"
            accept="image/*"
            :on-success="handleBackgroundUpload"
          >
            <div class="upload-area">
              <img 
                v-if="settings.backgroundImage" 
                :src="settings.backgroundImage" 
                class="preview-image"
              >
              <div v-else class="upload-placeholder">
                <el-icon class="upload-icon"><Plus /></el-icon>
                <span>点击上传背景图片</span>
              </div>
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            class="modern-button save-button"
            @click="saveSettings"
          >
            保存设置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '../store/settings'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const settingsStore = useSettingsStore()
const settings = ref({ ...settingsStore.$state })

const handleBackgroundUpload = (response) => {
  settings.value.backgroundImage = response.url
}

const saveSettings = () => {
  settingsStore.updateSettings(settings.value)
  ElMessage.success('设置保存成功')
}
</script>

<style scoped>
.settings-page {
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  min-height: calc(100vh - 48px);
}

.settings-section {
  max-width: 600px;
  margin: 0 auto;
  padding: 32px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.settings-title {
  margin: 0 0 32px;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.modern-form :deep(.el-form-item) {
  margin-bottom: 28px;
}

.modern-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #2c3e50;
  font-size: 15px;
}

.modern-select {
  width: 200px;
}

.modern-switch :deep(.el-switch__core) {
  width: 50px !important;
}

.modern-radio :deep(.el-radio) {
  margin-right: 24px;
}

.modern-radio :deep(.el-radio__label) {
  color: #2c3e50;
}

.modern-uploader {
  width: 100%;
}

.upload-area {
  width: 200px;
  height: 200px;
  border: 2px dashed #dcdfe6;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.upload-area:hover {
  border-color: #4CAF50;
  background: #f1f8e9;
}

.upload-placeholder {
  text-align: center;
  color: #909399;
}

.upload-icon {
  font-size: 32px;
  margin-bottom: 12px;
  color: #4CAF50;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.save-button {
  width: 100%;
  margin-top: 32px;
  height: 44px;
  font-size: 16px;
  background: #4CAF50 !important;
  border-color: #4CAF50 !important;
  transition: all 0.3s ease;
}

.save-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}

:deep(.el-form-item__content) {
  display: flex;
  align-items: center;
}

:deep(.el-switch) {
  margin-left: 8px;
}
</style> 