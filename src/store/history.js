import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    drawHistory: []
  }),

  actions: {
    addRecord(record) {
      this.drawHistory.push({
        ...record,
        timestamp: new Date().toISOString()
      })
    },

    clearHistory() {
      this.drawHistory = []
    }
  },

  persistedState: {
    enabled: true,
    storage: localStorage,
    key: 'lucky-draw-history'
  }
}) 