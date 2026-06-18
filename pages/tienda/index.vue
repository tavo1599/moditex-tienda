<script setup lang="ts">
const route = useRoute();
const { getProductos, getCategorias } = useApi();

const categoriaActiva = computed(() => (route.query.categoria as string) || '');
const busqueda = computed(() => (route.query.q as string) || '');

const { data: categorias } = await useAsyncData('tienda-categorias', () => getCategorias());
const { data: productos } = await useAsyncData(
  'tienda-productos',
  () => getProductos({
    ...(categoriaActiva.value ? { categoria: categoriaActiva.value } : {}),
    ...(busqueda.value ? { q: busqueda.value } : {}),
  }),
  { watch: [categoriaActiva, busqueda] },
);

const titulo = computed(() => {
  if (busqueda.value) return `Resultados: "${busqueda.value}"`;
  return categoriaActiva.value || 'Toda la tienda';
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20">
    <header class="mb-12">
      <p class="text-[11px] uppercase tracking-widest2 text-clay mb-3">{{ busqueda ? 'Búsqueda' : 'Catálogo' }}</p>
      <h1 class="text-4xl md:text-5xl font-light tracking-tight">{{ titulo }}</h1>
    </header>

    <!-- Filtros por categoría -->
    <div class="flex flex-wrap gap-3 mb-12 text-[11px] uppercase tracking-widest2">
      <NuxtLink
        to="/tienda"
        class="px-4 py-2 border transition-all"
        :class="!categoriaActiva ? 'bg-ink text-bone border-ink' : 'border-sand text-clay hover:border-ink hover:text-ink'"
      >Todo</NuxtLink>
      <NuxtLink
        v-for="c in categorias || []"
        :key="c"
        :to="`/tienda?categoria=${encodeURIComponent(c)}`"
        class="px-4 py-2 border transition-all"
        :class="categoriaActiva === c ? 'bg-ink text-bone border-ink' : 'border-sand text-clay hover:border-ink hover:text-ink'"
      >{{ c }}</NuxtLink>
    </div>

    <div v-if="productos && productos.length" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      <ProductCard v-for="p in productos" :key="p.id" :producto="p" />
    </div>
    <div v-else class="py-24 text-center text-clay">
      <p class="text-sm uppercase tracking-widest2">No hay prendas en esta categoría</p>
    </div>
  </div>
</template>
