/**
 * rewards.js — DADAPOINT Watch Reward System
 */
import { mds, sendDADAPoint } from './minima.js'

export const REWARD_RATE_VIEWS = 1000
export const REWARD_RATE_LIKES = 10
export const REWARD_MAX_PER_POST = 100

export async function calculateReward(videoId, author) {
  try {
    const viewsRes = await mds('MDS_select', {
      data: JSON.stringify({ videoId, type: 'view' }),
      scope: 'DADA_REACTION',
    })
    const views = Array.isArray(viewsRes) ? viewsRes.length : 0
    const likesRes = await mds('MDS_select', {
      data: JSON.stringify({ videoId, type: 'like' }),
      scope: 'DADA_REACTION',
    })
    const likes = Array.isArray(likesRes) ? likesRes.length : 0
    const viewReward = Math.floor(views / REWARD_RATE_VIEWS)
    const likeReward = Math.floor(likes / REWARD_RATE_LIKES)
    return {
      views, likes, viewReward, likeReward,
      total: Math.min(viewReward + likeReward, REWARD_MAX_PER_POST),
    }
  } catch (e) { return { error: e.message } }
}

export async function recordView(videoId, viewer) {
  try {
    return await mds('MDS_insert', {
      data: JSON.stringify({ videoId, viewer, type: 'view', ts: Date.now() }),
      scope: 'DADA_REACTION',
    })
  } catch (e) { console.warn('Failed to record view:', e) }
}

export async function recordLike(videoId, liker) {
  try {
    return await mds('MDS_insert', {
      data: JSON.stringify({ videoId, liker, type: 'like', ts: Date.now() }),
      scope: 'DADA_REACTION',
    })
  } catch (e) { console.warn('Failed to record like:', e) }
}

export async function claimReward(videoId, author, amount) {
  try {
    return await sendDADAPoint(author, amount, `Reward for video ${videoId}`)
  } catch (e) { return { error: e.message } }
}
