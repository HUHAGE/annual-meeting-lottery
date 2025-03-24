<template>
  <div class="lucky-draw-container">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <div class="button-group">
        <el-button 
          class="toolbar-button history-button"
          type="primary" 
          circle 
          @click="openHistoryPanel"
        >
          <el-icon class="toolbar-icon"><Timer /></el-icon>
        </el-button>
        
        <el-button 
          class="toolbar-button settings-button"
          type="primary" 
          circle 
          @click="openSettingsPanel"
        >
          <el-icon class="toolbar-icon"><Setting /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 主抽奖区域 -->
    <div class="draw-content">
      <!-- 奖项展示 -->
      <div class="prize-info" v-if="currentPrize">
        <h1>{{ currentPrize.name }}</h1>
        <p>{{ currentPrize.description }}</p>
      </div>

      <!-- 抽奖展示区 -->
      <div class="draw-box" @click="toggleDraw">
        <div class="draw-display">
          <template v-if="isDrawing">
            <div class="rolling-name">{{ currentRollingName }}</div>
          </template>
          <template v-else-if="winners.length">
            <div class="winners-display">
              <div v-for="winner in winners" :key="winner.id" class="winner-item">
                {{ winner.name }}
                <small v-if="winner.department">({{ winner.department }})</small>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="start-hint">点击开始抽奖</div>
          </template>
        </div>
      </div>
    </div>

    <!-- 设置面板对话框 -->
    <el-dialog
      v-model="settingsPanelVisible"
      title="系统设置"
      width="70%"
      class="modern-dialog settings-dialog"
      :show-close="false"
      :lock-scroll="true"
      :close-on-click-modal="false"
      :destroy-on-close="false"
    >
      <template #header="{ close }">
        <div class="modern-dialog-header">
          <h3>系统设置</h3>
          <el-button class="close-btn" circle @click="close">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
      </template>
      
      <el-tabs v-model="activeTab" class="settings-tabs">
        <el-tab-pane label="名单管理" name="participants">
          <Participants />
        </el-tab-pane>
        <el-tab-pane label="奖项设置" name="prizes">
          <Prizes />
        </el-tab-pane>
        <el-tab-pane label="抽奖历史" name="history">
          <History />
        </el-tab-pane>
        <el-tab-pane label="系统设置" name="settings">
          <Settings />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 添加历史记录对话框 -->
    <el-dialog
      v-model="historyPanelVisible"
      title="抽奖历史"
      width="70%"
      class="modern-dialog history-dialog"
      :show-close="false"
      :lock-scroll="true"
      :close-on-click-modal="false"
      :destroy-on-close="false"
    >
      <template #header="{ close }">
        <div class="modern-dialog-header">
          <h3>抽奖历史</h3>
          <el-button class="close-btn" circle @click="close">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
      </template>
      
      <History />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, markRaw } from 'vue'
import { useParticipantsStore } from '../store/participants'
import { usePrizesStore } from '../store/prizes'
import { useHistoryStore } from '../store/history'
import { useSettingsStore } from '../store/settings'
import { Setting, User, Trophy, Timer, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import Participants from './Participants.vue'
import Prizes from './Prizes.vue'
import History from './History.vue'
import Settings from './Settings.vue'

const router = useRouter()
const participantsStore = useParticipantsStore()
const prizesStore = usePrizesStore()
const historyStore = useHistoryStore()
const settingsStore = useSettingsStore()

const isDrawing = ref(false)
const winners = ref([])
const currentRollingName = ref('')
let rollingInterval = null

// 当前选中的奖项
const currentPrize = computed(() => prizesStore.currentPrize)

// 可用的参与者
const availableParticipants = computed(() => {
  const excludedIds = new Set(participantsStore.excludedParticipants.map(p => p.id))
  return participantsStore.participants.filter(p => !excludedIds.has(p.id))
})

// 开始/停止抽奖
const toggleDraw = () => {
  if (!currentPrize.value) {
    ElMessage.warning('请先在设置中选择抽奖奖项')
    return
  }

  if (isDrawing.value) {
    stopDraw()
  } else {
    startDraw()
  }
}

// 开始抽奖
const startDraw = () => {
  if (availableParticipants.value.length === 0) {
    ElMessage.warning('没有可抽奖的参与者')
    return
  }

  isDrawing.value = true
  winners.value = []
  
  // 开始滚动名单
  rollingInterval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * availableParticipants.value.length)
    currentRollingName.value = availableParticipants.value[randomIndex].name
  }, 50)
}

// 停止抽奖
const stopDraw = () => {
  isDrawing.value = false
  clearInterval(rollingInterval)

  // 抽取获奖者
  const winnerCount = currentPrize.value.count
  winners.value = getRandomParticipants(winnerCount)

  // 记录中奖历史
  historyStore.addRecord({
    timestamp: Date.now(),
    prize: currentPrize.value,
    winners: winners.value
  })

  // 更新奖项剩余数量
  prizesStore.updatePrizeCount(currentPrize.value.id)

  // 将中奖者加入排除名单
  winners.value.forEach(winner => {
    participantsStore.excludeParticipant(winner.id)
  })

  // 播放中奖音效
  if (settingsStore.soundEnabled) {
    playWinSound()
  }
}

// 随机抽取指定数量的参与者
const getRandomParticipants = (count) => {
  const participants = [...availableParticipants.value]
  const result = []
  
  while (result.length < count && participants.length > 0) {
    const randomIndex = Math.floor(Math.random() * participants.length)
    result.push(participants.splice(randomIndex, 1)[0])
  }
  
  return result
}

// 打开设置面板
const settingsPanelVisible = ref(false)
const activeTab = ref('participants')

const openSettingsPanel = () => {
  settingsPanelVisible.value = true
}

// 播放中奖音效
const playWinSound = () => {
  const audio = new Audio('/win-sound.mp3')
  audio.play()
}

// 添加历史面板控制
const historyPanelVisible = ref(false)

const openHistoryPanel = () => {
  historyPanelVisible.value = true
}

onUnmounted(() => {
  clearInterval(rollingInterval)
})
</script>

<style scoped>
.lucky-draw-container {
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1f4037 0%, #99f2c8 100%);
}

.draw-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
}

.prize-info {
  margin-bottom: 2rem;
  color: white;
}

.prize-info h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.draw-box {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 2rem;
  min-width: 500px;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.draw-display {
  font-size: 2.5rem;
  font-weight: bold;
}

.winners-display {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.winner-item {
  font-size: 2rem;
  color: #67c23a;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  background: rgba(103, 194, 58, 0.1);
}

.winner-item small {
  font-size: 1rem;
  color: #909399;
}

.toolbar {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 100;
}

.button-group {
  display: flex;
  gap: 16px;
}

.toolbar-button {
  width: 56px !important;
  height: 56px !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border: none !important;
}

.toolbar-button:hover {
  background: rgba(255, 255, 255, 0.3) !important;
}

.toolbar-icon {
  font-size: 24px;
  color: white;
}

/* 可以为历史按钮添加特殊样式 */
.history-button {
  background: rgba(103, 194, 58, 0.2) !important;
}

.history-button:hover {
  background: rgba(103, 194, 58, 0.3) !important;
}

/* 现代化对话框样式 */
.modern-dialog {
  :deep(.el-dialog) {
    border-radius: 40px;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    max-width: 1200px;
    margin: 15vh auto;
    border: 1px solid rgba(255, 255, 255, 0.8);
  }

  :deep(.el-dialog__header) {
    margin: 0;
    padding: 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  }

  :deep(.el-dialog__body) {
    padding: 32px 40px;
    border-radius: 0 0 40px 40px;
  }

  :deep(.el-overlay) {
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
  }

  :deep(.el-overlay-dialog) {
    animation: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.modern-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 40px;
  background: rgba(255, 255, 255, 0.8);

  h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
    letter-spacing: -0.5px;
  }
}

.close-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.03);
  color: #666;

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  .el-icon {
    font-size: 20px;
  }
}

/* 标签页样式优化 */
.settings-tabs {
  padding: 0 20px;

  :deep(.el-tabs__header) {
    margin: 0 0 30px 0;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.02);
    padding: 8px;
  }

  :deep(.el-tabs__nav) {
    border: none !important;
  }

  :deep(.el-tabs__item) {
    font-size: 16px;
    padding: 0 30px;
    height: 50px;
    line-height: 50px;
    border-radius: 16px;
    transition: all 0.3s ease;
    margin: 0 4px;
    color: #666;

    &.is-active {
      font-weight: 600;
      color: var(--el-color-primary);
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    &:hover:not(.is-active) {
      color: var(--el-color-primary);
      background: rgba(255, 255, 255, 0.5);
    }
  }

  :deep(.el-tabs__active-bar) {
    display: none;  /* 移除下划线 */
  }

  :deep(.el-tabs__content) {
    padding: 20px;
    background: white;
    border-radius: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  }
}

/* 历史记录对话框特殊样式 */
.history-dialog {
  :deep(.el-dialog__body) {
    max-height: 65vh;
    overflow-y: auto;
    
    /* 自定义滚动条 */
    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.02);
      border-radius: 10px;
      margin: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.08);
      border-radius: 10px;
      border: 2px solid transparent;
      background-clip: padding-box;
      
      &:hover {
        background: rgba(0, 0, 0, 0.15);
        border: 2px solid transparent;
        background-clip: padding-box;
      }
    }
  }
}

/* 表格样式优化 */
:deep(.el-table) {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);

  th.el-table__cell {
    background: rgba(0, 0, 0, 0.02);
    font-weight: 600;
  }

  .el-table__cell {
    padding: 16px 24px;
  }
}

/* 按钮样式优化 */
:deep(.el-button) {
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:not(.is-text) {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}
</style> 