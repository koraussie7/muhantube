import { defineStore } from 'pinia'
import { ref } from 'vue'
import { calculateReward, recordView, recordLike, claimReward } from '@muhantube/core/rewards'

export const useRewardsStore = defineStore('rewards', () => {
  const balance = ref(0)
  const totalEarned = ref(0)
  const recentRewards = ref([])

  async function trackView(videoId, viewer) {
    await recordView(videoId, viewer)
    const reward = await calculateReward(videoId, viewer)
    return reward
  }

  async function trackLike(videoId, liker) {
    await recordLike(videoId, liker)
    const reward = await calculateReward(videoId, liker)
    return reward
  }

  async function checkRewards(videoId) {
    return await calculateReward(videoId)
  }

  async function claim(videoId, author, amount) {
    const result = await claimReward(videoId, author, amount)
    if (!result.error) {
      totalEarned.value += amount
    }
    return result
  }

  return {
    balance,
    totalEarned,
    recentRewards,
    trackView,
    trackLike,
    checkRewards,
    claim,
  }
})
