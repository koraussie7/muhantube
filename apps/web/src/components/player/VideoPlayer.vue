<template>
  <MuhanPlayer
    :video-url="videoUrl"
    :video-id="videoId"
    :controls="controls"
    :auto-play="autoPlay"
    :muted="muted"
    :loop="loop"
    :poster="poster"
    :p2p-token="p2pToken"
    @play="$emit('play')"
    @pause="$emit('pause')"
    @timeupdate="(t, d) => $emit('timeupdate', t, d)"
    @ended="$emit('ended')"
    @error="$emit('error', $event)"
  />
</template>

<script setup>
import { MuhanPlayer } from '@muhantube/player'

defineProps({
  videoUrl: { type: String, required: true },
  videoId: { type: String, default: '' },
  controls: { type: Boolean, default: true },
  autoPlay: { type: Boolean, default: false },
  muted: { type: Boolean, default: true },
  loop: { type: Boolean, default: true },
  poster: { type: String, default: '' },
  p2pToken: { type: String, default: '' },
})

defineEmits(['play', 'pause', 'timeupdate', 'ended', 'error'])
</script>
