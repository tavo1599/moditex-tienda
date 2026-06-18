<script setup lang="ts">
const props = defineProps<{ banner: any }>();
const imagen = useImagen();
</script>

<template>
  <section v-if="banner" class="relative h-[60vh] min-h-[420px] overflow-hidden">
    <img v-if="imagen(banner.url)" :src="imagen(banner.url)!" :alt="banner.titulo || 'Promoción'" class="absolute inset-0 w-full h-full object-cover" />
    <div class="absolute inset-0 bg-black/30"></div>
    <div class="relative h-full max-w-7xl mx-auto px-5 md:px-8 flex items-center">
      <div class="max-w-lg text-bone">
        <p v-if="banner.subtitulo" class="text-[11px] uppercase tracking-widest2 mb-4 opacity-90">{{ banner.subtitulo }}</p>
        <h2 v-if="banner.titulo" class="text-4xl md:text-6xl font-light leading-tight">{{ banner.titulo }}</h2>
        <NuxtLink
          v-if="banner.enlace"
          :to="banner.enlace"
          class="inline-flex items-center gap-3 mt-8 bg-bone text-ink px-8 py-4 text-[11px] uppercase tracking-widest2 hover:bg-clay hover:text-bone transition-all duration-300"
        >{{ banner.textoBoton || 'Ver más' }} →</NuxtLink>
      </div>
    </div>
  </section>
</template>
