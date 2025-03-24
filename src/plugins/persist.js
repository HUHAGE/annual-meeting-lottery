import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()

// 自定义存储适配器
const storage = {
  getItem: (key) => {
    return window.exports?.getData?.(key) || localStorage.getItem(key)
  },
  
  setItem: (key, value) => {
    if (window.exports?.saveData) {
      window.exports.saveData(key, value)
    } else {
      localStorage.setItem(key, value)
    }
  },
  
  removeItem: (key) => {
    if (window.exports?.removeData) {
      window.exports.removeData(key)
    } else {
      localStorage.removeItem(key)
    }
  }
}

// 配置持久化插件
pinia.use(piniaPluginPersistedstate)

export default pinia 