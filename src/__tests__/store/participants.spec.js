import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useParticipantsStore } from '../../store/participants'

describe('Participants Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds participant correctly', () => {
    const store = useParticipantsStore()
    const participant = {
      name: '张三',
      number: '001',
      department: '技术部'
    }
    
    store.addParticipant(participant)
    expect(store.participants.length).toBe(1)
    expect(store.participants[0].name).toBe('张三')
  })

  it('removes participant correctly', () => {
    const store = useParticipantsStore()
    const participant = {
      name: '张三',
      number: '001',
      department: '技术部'
    }
    
    store.addParticipant(participant)
    const id = store.participants[0].id
    store.removeParticipant(id)
    expect(store.participants.length).toBe(0)
  })

  it('excludes winners correctly', () => {
    const store = useParticipantsStore()
    const winner = {
      id: 1,
      name: '张三',
      number: '001',
      department: '技术部'
    }
    
    store.addToExcluded(winner)
    expect(store.excludedParticipants.length).toBe(1)
    expect(store.excludedParticipants[0].name).toBe('张三')
  })
}) 