import { defineStore } from 'pinia'
import { read, utils } from 'xlsx'

export const useParticipantsStore = defineStore('participants', {
  state: () => ({
    participants: [],
    excludedParticipants: [] // 已中奖人员
  }),

  actions: {
    async importFromExcel(file) {
      try {
        const data = await file.arrayBuffer()
        const workbook = read(data)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = utils.sheet_to_json(worksheet)

        this.participants = jsonData.map((row, index) => ({
          id: index + 1,
          name: row['姓名'],
          number: row['工号'] || '',
          department: row['部门'] || ''
        }))

        return true
      } catch (error) {
        console.error('导入Excel失败:', error)
        return false
      }
    },

    addParticipant(participant) {
      this.participants.push(participant)
    },

    excludeParticipant(participantId) {
      const participant = this.participants.find(p => p.id === participantId)
      if (participant) {
        this.excludedParticipants.push(participant)
      }
    },

    removeParticipant(id) {
      this.participants = this.participants.filter(p => p.id !== id)
    }
  },

  persistedState: {
    enabled: true,
    storage: localStorage,
    key: 'lucky-draw-participants'
  }
}) 