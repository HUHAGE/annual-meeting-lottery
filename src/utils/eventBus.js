import { ref } from 'vue'
import mitt from 'mitt'

export const emitter = mitt()

// 抽奖状态管理
export const isDrawing = ref(false) 