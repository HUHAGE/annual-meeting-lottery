<template>
  <div class="history-container">
    <div class="toolbar">
      <el-button 
        class="modern-button export-button" 
        type="primary" 
        @click="exportHistory"
      >
        <el-icon><Download /></el-icon>
        <span>导出历史记录</span>
      </el-button>
      <el-button 
        class="modern-button clear-button" 
        type="danger" 
        @click="clearHistory"
      >
        <el-icon><Delete /></el-icon>
        <span>清空历史</span>
      </el-button>
    </div>

    <el-table 
      :data="historyData" 
      border 
      class="modern-table"
    >
      <el-table-column prop="timestamp" label="抽奖时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.timestamp) }}
        </template>
      </el-table-column>
      <el-table-column prop="prize.name" label="奖项" />
      <el-table-column label="获奖者">
        <template #default="{ row }">
          <el-tag
            v-for="winner in row.winners"
            :key="winner.id"
            class="modern-tag"
            effect="light"
            type="success"
          >
            {{ winner.name }}
            <template v-if="winner.department">
              ({{ winner.department }})
            </template>
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="historyStore.drawHistory.length"
        layout="total, sizes, prev, pager, next"
        :page-sizes="[10, 20, 50, 100]"
        background
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useHistoryStore } from '../store/history'
import { Download, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { utils, writeFile } from 'xlsx'

const historyStore = useHistoryStore()
const currentPage = ref(1)
const pageSize = ref(10)

const historyData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return historyStore.drawHistory.slice(start, end)
})

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

const exportHistory = () => {
  const data = historyStore.drawHistory.map(record => ({
    '抽奖时间': formatDate(record.timestamp),
    '奖项': record.prize.name,
    '获奖者': record.winners.map(w => w.name).join('、'),
    '部门': record.winners.map(w => w.department || '').join('、')
  }))

  const ws = utils.json_to_sheet(data)
  const wb = utils.book_new()
  utils.book_append_sheet(wb, ws, '抽奖历史')
  writeFile(wb, '抽奖历史.xlsx')
}

const clearHistory = () => {
  ElMessageBox.confirm('确定要清空所有历史记录吗？此操作不可恢复！', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    historyStore.clearHistory()
    ElMessage.success('历史记录已清空')
  })
}
</script>

<style scoped>
.history-container {
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
}

.toolbar {
  margin-bottom: 24px;
  display: flex;
  gap: 12px;
}

.export-button {
  background: #4CAF50 !important;
  border-color: #4CAF50 !important;
}

.clear-button {
  background: #FF5252 !important;
  border-color: #FF5252 !important;
}

.modern-button {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-table) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: #f8f9fa !important;
}

:deep(.el-pagination) {
  padding: 0;
}
</style> 