<template>
  <div class="prizes-container">
    <div class="toolbar">
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon>
        添加奖项
      </el-button>
    </div>

    <el-table :data="prizesStore.prizes" border style="width: 100%">
      <el-table-column prop="name" label="奖项名称" />
      <el-table-column prop="description" label="奖品描述" />
      <el-table-column prop="count" label="奖项数量" width="100" />
      <el-table-column prop="remainingCount" label="剩余数量" width="100" />
      <el-table-column label="奖项图片" width="120">
        <template #default="{ row }">
          <el-image
            v-if="row.image"
            :src="row.image"
            fit="cover"
            style="width: 50px; height: 50px"
          />
          <span v-else>无图片</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加奖项' : '编辑奖项'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="formData" label-width="100px">
        <el-form-item label="奖项名称" required>
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="奖品描述">
          <el-input v-model="formData.description" type="textarea" />
        </el-form-item>
        <el-form-item label="奖项数量" required>
          <el-input-number v-model="formData.count" :min="1" />
        </el-form-item>
        <el-form-item label="奖项图片">
          <el-upload
            class="prize-image-uploader"
            accept="image/*"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleImageChange"
          >
            <img v-if="formData.image" :src="formData.image" class="preview-image">
            <el-icon v-else class="upload-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePrizesStore } from '../store/prizes'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const prizesStore = usePrizesStore()
const dialogVisible = ref(false)
const dialogType = ref('add')
const formData = ref({
  name: '',
  description: '',
  count: 1,
  image: ''
})

const handleImageChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    formData.value.image = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const showAddDialog = () => {
  dialogType.value = 'add'
  formData.value = {
    name: '',
    description: '',
    count: 1,
    image: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除该奖项吗？', '提示', {
    type: 'warning'
  }).then(() => {
    prizesStore.removePrize(row.id)
    ElMessage.success('删除成功')
  })
}

const handleSubmit = () => {
  if (!formData.value.name) {
    ElMessage.warning('请输入奖项名称')
    return
  }

  const prizeData = {
    name: formData.value.name,
    description: formData.value.description || '',
    count: formData.value.count || 1,
    image: formData.value.image || '',
    remainingCount: formData.value.count || 1
  }

  if (dialogType.value === 'add') {
    prizesStore.addPrize(prizeData)
  } else {
    prizesStore.updatePrize(formData.value.id, prizeData)
  }

  dialogVisible.value = false
  ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
}
</script>

<style scoped>
.prizes-container {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
}

.prize-image-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-icon {
  font-size: 28px;
  color: #8c939d;
}
</style> 