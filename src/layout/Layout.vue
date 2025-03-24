<template>
  <el-container class="layout-container">
    <el-container>
      <el-main>
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { emitter, isDrawing } from '../utils/eventBus'

const route = useRoute()
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.el-main {
  padding: 0;
  background-color: transparent;
}
</style> 