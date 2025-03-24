import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    backgroundType: 'color', // 'color' | 'image'
    backgroundColor: '#f0f2f5',
    backgroundImage: '',
    animationSpeed: 'normal', // 'slow' | 'normal' | 'fast'
    soundEnabled: true
  }),

  actions: {
    updateSettings(settings) {
      Object.assign(this.$state, settings)
    }
  },

  persistedState: {
    enabled: true,
    storage: localStorage,
    key: 'lucky-draw-settings'
  }
}) 