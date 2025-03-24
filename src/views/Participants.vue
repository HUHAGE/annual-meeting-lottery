<template>
  <div class="participants-container">
    <div class="toolbar">
      <el-upload
        class="upload-excel"
        accept=".xlsx,.xls"
        :auto-upload="true"
        :show-file-list="false"
        :on-change="handleFileChange"
      >
        <el-button type="primary">
          <el-icon><Upload /></el-icon>
          导入Excel
        </el-button>
      </el-upload>
      
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon>
        添加参与者
      </el-button>
    </div>

    <el-table :data="participantsStore.participants" border style="width: 100%">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="number" label="工号" />
      <el-table-column prop="department" label="部门" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '添加参与者' : '编辑参与者'"
      v-model="dialogVisible"
      width="500px"
    >
      <el-form :model="formData" label-width="80px">
        <el-form-item label="姓名" required>
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="工号">
          <el-input v-model="formData.number" />
        </el-form-item>
        <el-form-item label="部门">
          <el-input v-model="formData.department" />
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
import { useParticipantsStore } from '../store/participants'
import { Upload, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const participantsStore = useParticipantsStore()
const dialogVisible = ref(false)
const dialogType = ref('add')
const formData = ref({
  name: '',
  number: '',
  department: ''
})

const handleFileChange = async (file) => {
  const result = await participantsStore.importFromExcel(file.raw)
  if (result) {
    ElMessage.success('导入成功')
  } else {
    ElMessage.error('导入失败')
  }
}

const showAddDialog = () => {
  dialogType.value = 'add'
  formData.value = {
    name: '',
    number: '',
    department: ''
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除该参与者吗？', '提示', {
    type: 'warning'
  }).then(() => {
    participantsStore.removeParticipant(id)
    ElMessage.success('删除成功')
  })
}

const handleSubmit = () => {
  if (!formData.value.name) {
    ElMessage.warning('请输入姓名')
    return
  }

  if (dialogType.value === 'add') {
    participantsStore.addParticipant({
      id: Date.now(),
      ...formData.value
    })
  } else {
    participantsStore.updateParticipant(formData.value.id, formData.value)
  }

  dialogVisible.value = false
  ElMessage.success(dialogType.value === 'add' ? '添加成功' : '更新成功')
}
</script>

<style scoped>
.participants-container {
  padding: 20px;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}
</style> 