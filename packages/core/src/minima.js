/**
 * minima.js — Minima MDS RPC Client
 */
const MDS_HOST = localStorage.getItem('mds_host') || 'http://localhost:9002'
const MDS_TOKEN = localStorage.getItem('mds_token') || ''

export async function mds(method, params = {}) {
  try {
    const res = await fetch(`${MDS_HOST}/${method}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(MDS_TOKEN)}`,
      },
      body: JSON.stringify(params),
    })
    return await res.json()
  } catch (e) {
    console.warn('MDS call failed:', method, e)
    return { error: e.message }
  }
}

export async function initMinimaWasm() {
  return new Promise((resolve, reject) => {
    if (typeof Minima !== 'undefined') { resolve(Minima); return }
    const check = setInterval(() => {
      if (typeof Minima !== 'undefined') { clearInterval(check); resolve(Minima) }
    }, 500)
    setTimeout(() => { clearInterval(check); reject(new Error('Minima not loaded')) }, 30000)
  })
}

export async function getMinimaBalance(address) {
  const res = await mds('mds_tokens', { address })
  return res?.tokens || []
}

export async function sendToken(to, tokenId, amount, msg = '') {
  return await mds('mds_send', { to, tokenid: tokenId, amount, msg })
}

export async function sendDADAPoint(to, amount, msg = '') {
  return await mds('mds_send', { to, token: 'DADAPOINT', amount, msg })
}
