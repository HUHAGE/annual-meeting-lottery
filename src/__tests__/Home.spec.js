import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Home from '../views/Home.vue'
import { useParticipantsStore } from '../store/participants'
import { usePrizesStore } from '../store/prizes'

describe('Home.vue', () => {
  let wrapper
  let participantsStore
  let prizesStore

  beforeEach(() => {
    wrapper = mount(Home, {
      global: {
        plugins: [createTestingPinia()]
      }
    })
    participantsStore = useParticipantsStore()
    prizesStore = usePrizesStore()
  })

  it('shows empty state when no participants', () => {
    expect(wrapper.find('.start-hint').exists()).toBe(true)
  })

  it('shows rolling animation when isRolling is true', async () => {
    await wrapper.setData({ isRolling: true })
    expect(wrapper.find('.name-rolling').exists()).toBe(true)
  })

  it('shows winners when available', async () => {
    const winners = [
      { id: 1, name: '张三' },
      { id: 2, name: '李四' }
    ]
    await wrapper.setData({ winners })
    expect(wrapper.findAll('.winner-item').length).toBe(2)
  })
}) 