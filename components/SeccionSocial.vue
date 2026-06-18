<script setup lang="ts">
const props = defineProps<{ publicaciones: any[] }>();
const imagen = useImagen();

// Reproduce el video al entrar el mouse, lo pausa al salir (efecto reel)
const play = (e: Event) => {
  const v = (e.currentTarget as HTMLElement).querySelector('video');
  if (v) (v as HTMLVideoElement).play().catch(() => {});
};
const pause = (e: Event) => {
  const v = (e.currentTarget as HTMLElement).querySelector('video');
  if (v) { (v as HTMLVideoElement).pause(); (v as HTMLVideoElement).currentTime = 0; }
};
</script>

<template>
  <section v-if="publicaciones && publicaciones.length" class="py-20 md:py-28 border-t border-sand">
    <div class="max-w-7xl mx-auto px-5 md:px-8">
      <div class="flex items-end justify-between mb-10">
        <div>
          <p class="text-[11px] uppercase tracking-widest2 text-clay mb-3">Síguenos</p>
          <h2 class="text-3xl md:text-4xl font-light tracking-tight">@essentialwest</h2>
        </div>
      </div>
    </div>

    <!-- Tira horizontal tipo reels (se desliza) -->
    <div class="flex gap-4 md:gap-5 overflow-x-auto px-5 md:px-8 pb-4 snap-x snap-mandatory scroll-px-5 hide-scroll">
      <component
        :is="p.enlace ? 'a' : 'div'"
        v-for="p in publicaciones"
        :key="p.id"
        :href="p.enlace || undefined"
        :target="p.enlace ? '_blank' : undefined"
        rel="noopener"
        class="group relative shrink-0 w-[70vw] sm:w-64 md:w-72 aspect-[9/16] bg-sand overflow-hidden snap-start"
        @mouseenter="play"
        @mouseleave="pause"
      >
        <video
          v-if="p.tipo === 'video'"
          :src="imagen(p.url)!"
          class="w-full h-full object-cover"
          muted loop playsinline preload="metadata"
        ></video>
        <img
          v-else
          :src="imagen(p.url)!"
          :alt="p.caption || 'Publicación'"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        <!-- Velo + texto -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div class="absolute bottom-0 left-0 right-0 p-4 text-bone translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <p v-if="p.caption" class="text-sm leading-snug line-clamp-2">{{ p.caption }}</p>
          <p v-if="p.enlace" class="text-[10px] uppercase tracking-widest2 mt-2">→ Ver en Instagram</p>
        </div>

        <!-- Indicador de video -->
        <div v-if="p.tipo === 'video'" class="absolute top-3 right-3 text-bone/90 text-sm">▶</div>
      </component>
    </div>
  </section>
</template>

<style scoped>
.hide-scroll::-webkit-scrollbar { display: none; }
.hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
.line-clamp-2 {
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
</style>
