/**
 * layout.js — DTube Sidebar & Layout Logic (Vue 3 adapted)
 */

// Sidebar navigation items from DTube
export const sidebarItems = [
  { id: 'home', label: 'Home', icon: 'bx bx-home', route: '/' },
  { id: 'trending', label: 'Trending', icon: 'bx bx-trending-up', route: '/trending' },
  { id: 'farm', label: 'Farm', icon: 'bx bx-farm', route: '/farm' },
  { id: 'coin', label: 'DTC', icon: 'bx bx-coin', route: '/coin' },
  { id: 'settings', label: 'Settings', icon: 'bx bx-cog', route: '/settings' },
]

// Language list from DTube
export const supportedLanguages = [
  'af', 'ar', 'bn', 'bs', 'ca', 'cs', 'da', 'de', 'el', 'en',
  'es', 'fa', 'fi', 'fr', 'gu', 'he', 'hi', 'hr', 'hu', 'id',
  'it', 'ja', 'ka', 'ko', 'lt', 'lv', 'mk', 'mr', 'ms', 'nb',
  'nl', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sr', 'sv', 'sw',
  'ta', 'te', 'th', 'tl', 'tr', 'uk', 'ur', 'vi', 'zh',
]
