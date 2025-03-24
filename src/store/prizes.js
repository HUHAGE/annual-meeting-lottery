import { defineStore } from 'pinia'
import logger from '../utils/logger'

export const usePrizesStore = defineStore('prizes', {
  state: () => ({
    prizes: [],
    currentPrize: null
  }),

  actions: {
    addPrize(prize) {
      if (!this.prizes) {
        this.prizes = []
      }
      this.prizes.push({
        id: Date.now(),
        ...prize,
        remainingCount: prize.count
      })
      logger.debug('Prize added:', prize)
    },

    updatePrize(id, prize) {
      const index = this.prizes.findIndex(p => p.id === id)
      if (index !== -1) {
        this.prizes[index] = { ...this.prizes[index], ...prize }
      }
    },

    removePrize(id) {
      this.prizes = this.prizes.filter(p => p.id !== id)
    },

    setCurrentPrize(prize) {
      this.currentPrize = prize
    },

    decrementPrizeCount(id) {
      const prize = this.prizes.find(p => p.id === id)
      if (prize && prize.remainingCount > 0) {
        prize.remainingCount--
      }
    },

    setPrizes(prizes) {
      this.prizes = prizes
    },

    initializeStore() {
      if (!this.prizes) {
        this.prizes = []
      }
    }
  },

  persistedState: {
    enabled: true,
    storage: localStorage,
    key: 'lucky-draw-prizes'
  }
}) 