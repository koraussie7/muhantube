/**
 * rewards.js — DADAPOINT Watch Reward System (Vue 3)
 *
 * View/like based DADAPOINT auto-reward distribution
 */

export const REWARD_RATE_VIEWS = 1000    // 1000 views → 1 DADAPOINT
export const REWARD_RATE_LIKES = 10      // 10 likes → 1 DADAPOINT
export const REWARD_MAX_PER_POST = 100   // Max reward per video

export async function calculateReward(videoId, author) {
  try {
    // MDS select from DADA_REACTION scope
    const { mds } = await import('@/lib/minima')
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
      views,
      likes,
      viewReward,
      likeReward,
      total: Math.min(viewReward + likeReward, REWARD_MAX_PER_POST),
    }
  } catch (e) {
    return { error: e.message }
  }
}

// Record a view event
export async function recordView(videoId, viewer) {
  try {
    const { mds } = await import('@/lib/minima')
    return await mds('MDS_insert', {
      data: JSON.stringify({
        videoId,
        viewer,
        type: 'view',
        ts: Date.now(),
      }),
      scope: 'DADA_REACTION',
    })
  } catch (e) {
    console.warn('Failed to record view:', e)
  }
}

// Record a like
export async function recordLike(videoId, liker) {
  try {
    const { mds } = await import('@/lib/minima')
    return await mds('MDS_insert', {
      data: JSON.stringify({
        videoId,
        liker,
        type: 'like',
        ts: Date.now(),
      }),
      scope: 'DADA_REACTION',
    })
  } catch (e) {
    console.warn('Failed to record like:', e)
  }
}

// Claim rewards
export async function claimReward(videoId, author, amount) {
  try {
    const { sendDADAPoint } = await import('@/lib/minima')
    return await sendDADAPoint(author, amount, `Reward for video ${videoId}`)
  } catch (e) {
    return { error: e.message }
  }
}
