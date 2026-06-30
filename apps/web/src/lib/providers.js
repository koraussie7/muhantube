/**
 * providers.js — DTube Video Providers (adapted for Vue 3)
 */
export const allProviders = [
  { id: 'btfs', disp: 'BTFS', dht: 1, logo: 'ipfs.png' },
  { id: 'ipfs', disp: 'IPFS', dht: 1, logo: 'ipfs.png' },
  { id: 'sia', disp: 'Skynet', dht: 1, logo: 'sia.svg' },
  { id: 'twitch', disp: 'Twitch', logo: 'twitch.png' },
  { id: 'youtube', disp: 'YouTube', logo: 'youtube.png' },
  { id: 'dailymotion', disp: 'Dailymotion', logo: 'dailymotion.webp' },
  { id: 'instagram', disp: 'Instagram', logo: 'instagram.png' },
  { id: 'liveleak', disp: 'LiveLeak', logo: 'liveleak.png' },
  { id: 'vimeo', disp: 'Vimeo', logo: 'vimeo.png' },
  { id: 'facebook', disp: 'Facebook', logo: 'facebook.png' },
]

export const ProviderUtils = {
  all() { return allProviders },
  all3p() { return allProviders.filter(p => !p.dht) },
  idToDisp(id) { const p = allProviders.find(p => p.id === id); return p?.disp },
  dispToLogo(disp) { const p = allProviders.find(p => p.disp === disp); return p?.logo },
  dispToId(disp) { const p = allProviders.find(p => p.disp === disp); return p?.id },
}
