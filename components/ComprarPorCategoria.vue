<script setup lang="ts">
const props = defineProps<{ productos: any[] }>();
const imagen = useImagen();

// Deriva las categorías con una imagen representativa (la del primer producto de cada categoría)
const categorias = computed(() => {
  const mapa = new Map<string, { nombre: string; imagen: string | null }>();
  for (const p of props.productos || []) {
    if (!p.categoria) continue;
    if (!mapa.has(p.categoria)) {
      mapa.set(p.categoria, { nombre: p.categoria, imagen: p.imagen || null });
    } else if (!mapa.get(p.categoria)!.imagen && p.imagen) {
      mapa.get(p.categoria)!.imagen = p.imagen;
    }
  }
  return [...mapa.values()];
});
</script>

<template>
  <section v-if="categorias.length" class="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-24">
    <div class="mb-10">
      <p class="text-[11px] uppercase tracking-widest2 text-clay mb-3">Explora</p>
      <h2 class="text-3xl md:text-4xl font-light tracking-tight">Comprar por categoría</h2>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      <NuxtLink
        v-for="c in categorias"
        :key="c.nombre"
        :to="`/tienda?categoria=${encodeURIComponent(c.nombre)}`"
        class="group relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-sand"
      >
        <img
          v-if="imagen(c.imagen)"
          :src="imagen(c.imagen)!"
          :alt="c.nombre"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-bone text-xl md:text-2xl font-light tracking-widest2 uppercase">{{ c.nombre }}</span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
