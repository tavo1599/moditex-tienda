<script setup lang="ts">
const route = useRoute();
const { getProducto, getProductos } = useApi();
const imagen = useImagen();
const { agregar } = useCart();

const { data: producto, error } = await useAsyncData(
  `producto-${route.params.id}`,
  () => getProducto(route.params.id as string),
);

// Catálogo completo para sugerir relacionados
const { data: catalogo } = await useAsyncData('catalogo-relacionados', () => getProductos());

// Productos similares: misma categoría (sin el actual)
const similares = computed(() => {
  const p = producto.value;
  if (!p || !catalogo.value) return [];
  return catalogo.value.filter((x: any) => x.id !== p.id && x.categoria === p.categoria).slice(0, 4);
});

// Sugerencia de otra categoría: la categoría distinta más surtida
const otraCategoria = computed<{ categoria: string; items: any[] }>(() => {
  const p = producto.value;
  if (!p || !catalogo.value) return { categoria: '', items: [] };
  const otras = catalogo.value.filter((x: any) => x.categoria && x.categoria !== p.categoria);
  if (!otras.length) return { categoria: '', items: [] };
  const conteo: Record<string, number> = {};
  for (const x of otras) conteo[x.categoria] = (conteo[x.categoria] || 0) + 1;
  const cat = Object.keys(conteo).sort((a, b) => conteo[b]! - conteo[a]!)[0]!;
  return { categoria: cat, items: otras.filter((x: any) => x.categoria === cat).slice(0, 4) };
});

// Selección de color y talla
const colorSel = ref<string>('');
const tallaSel = ref<string>('');
const agregado = ref(false);

watchEffect(() => {
  if (producto.value && !colorSel.value && producto.value.colores?.length) {
    colorSel.value = producto.value.colores[0];
  }
});

// Imagen mostrada: la del color seleccionado, o la principal.
// El match es tolerante (mayúsculas/acentos) por si el color de la foto y el de
// la variante están escritos distinto.
const norm = (s: any) => String(s ?? '').trim().toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const imagenActiva = computed(() => {
  const p = producto.value;
  if (!p) return null;
  const mapa: Record<string, string[]> = p.imagenesPorColor || {};
  let porColor = mapa[colorSel.value];
  if (!porColor) {
    const objetivo = norm(colorSel.value);
    const k = Object.keys(mapa).find((key) => norm(key) === objetivo);
    if (k) porColor = mapa[k];
  }
  const ruta = (porColor && porColor[0]) || p.imagen || null;
  return imagen(ruta);
});

// --- Zoom de la imagen al pasar el mouse (sigue el cursor) ---
const zoom = ref(false);
const origenZoom = ref('50% 50%');
const moverZoom = (e: MouseEvent) => {
  const el = e.currentTarget as HTMLElement;
  const r = el.getBoundingClientRect();
  const x = ((e.clientX - r.left) / r.width) * 100;
  const y = ((e.clientY - r.top) / r.height) * 100;
  origenZoom.value = `${x}% ${y}%`;
};

const inicial = computed(() => (producto.value?.nombre || '?').charAt(0).toUpperCase());

// Tallas disponibles para el color elegido (según stock por variante)
const tallasDisponibles = computed(() => {
  const p = producto.value;
  if (!p) return [];
  return p.variantes
    .filter((v: any) => v.color === colorSel.value && v.stock > 0)
    .map((v: any) => v.talla);
});

watchEffect(() => {
  // Si cambia el color, resetea la talla si ya no aplica
  if (tallaSel.value && !tallasDisponibles.value.includes(tallaSel.value)) {
    tallaSel.value = '';
  }
});

const agregarAlCarrito = () => {
  const p = producto.value;
  if (!p) return;
  if (!colorSel.value) return alert('Selecciona un color.');
  if (!tallaSel.value) return alert('Selecciona una talla.');

  agregar({
    productoId: p.id,
    nombre: p.nombre,
    precio: p.precio,
    color: colorSel.value,
    talla: tallaSel.value,
    cantidad: 1,
    imagen: p.imagenesPorColor?.[colorSel.value]?.[0] || p.imagen,
  });
  agregado.value = true;
  setTimeout(() => (agregado.value = false), 2500);
};
</script>

<template>
  <div v-if="error" class="max-w-3xl mx-auto px-5 py-32 text-center text-clay">
    <p class="text-sm uppercase tracking-widest2">Producto no disponible</p>
    <NuxtLink to="/tienda" class="inline-block mt-6 underline">Volver a la tienda</NuxtLink>
  </div>

  <div v-else-if="producto" class="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-16">
    <NuxtLink to="/tienda" class="text-[11px] uppercase tracking-widest2 text-clay hover:text-ink transition-colors">← Tienda</NuxtLink>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mt-6">
      <!-- IMAGEN GRANDE (con zoom al pasar el mouse) -->
      <div
        class="relative aspect-[3/4] bg-sand overflow-hidden"
        :class="imagenActiva ? 'cursor-zoom-in' : ''"
        @mouseenter="zoom = true"
        @mouseleave="zoom = false"
        @mousemove="moverZoom"
      >
        <transition name="fade" mode="out-in">
          <img
            v-if="imagenActiva"
            :key="imagenActiva"
            :src="imagenActiva"
            :alt="producto.nombre"
            class="w-full h-full object-cover transition-transform duration-200 ease-out"
            :style="{ transform: zoom ? 'scale(2.2)' : 'scale(1)', transformOrigin: origenZoom }"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="text-8xl font-light text-clay/40">{{ inicial }}</span>
          </div>
        </transition>
      </div>

      <!-- INFO -->
      <div class="md:py-6">
        <p v-if="producto.categoria" class="text-[11px] uppercase tracking-widest2 text-clay mb-3">{{ producto.categoria }}</p>
        <h1 class="text-3xl md:text-4xl font-light tracking-tight">{{ producto.nombre }}</h1>
        <p class="text-2xl font-light mt-4">S/ {{ producto.precio.toFixed(2) }}</p>

        <p v-if="producto.descripcion" class="mt-6 text-clay leading-relaxed max-w-md">
          {{ producto.descripcion }}
        </p>

        <!-- COLOR (puntitos elegantes) -->
        <div v-if="producto.colores?.length" class="mt-10">
          <p class="text-[11px] uppercase tracking-widest2 text-clay mb-3">
            Color — <span class="text-ink">{{ colorSel }}</span>
          </p>
          <div class="flex gap-3">
            <button
              v-for="c in producto.coloresInfo"
              :key="c.nombre"
              @click="colorSel = c.nombre"
              :title="c.nombre"
              class="w-8 h-8 rounded-full border transition-all duration-200"
              :class="colorSel === c.nombre ? 'ring-2 ring-ink ring-offset-2 ring-offset-bone border-transparent' : 'border-sand hover:border-clay'"
              :style="{ backgroundColor: c.hex || '#ccc' }"
            ></button>
          </div>
        </div>

        <!-- TALLA -->
        <div class="mt-8">
          <p class="text-[11px] uppercase tracking-widest2 text-clay mb-3">Talla</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="t in producto.tallas"
              :key="t"
              @click="tallasDisponibles.includes(t) && (tallaSel = t)"
              :disabled="!tallasDisponibles.includes(t)"
              class="min-w-[48px] px-4 py-3 border text-sm transition-all"
              :class="[
                tallaSel === t ? 'bg-ink text-bone border-ink' : 'border-sand hover:border-ink',
                !tallasDisponibles.includes(t) ? 'opacity-30 line-through cursor-not-allowed' : ''
              ]"
            >{{ t }}</button>
          </div>
        </div>

        <!-- AGREGAR -->
        <button
          @click="agregarAlCarrito"
          class="w-full md:w-auto mt-10 px-12 py-4 bg-ink text-bone text-[11px] uppercase tracking-widest2 hover:bg-clay transition-colors duration-300"
        >
          {{ agregado ? '✓ Agregado al carrito' : 'Agregar al carrito' }}
        </button>

        <p v-if="!producto.disponible" class="mt-4 text-[11px] uppercase tracking-widest2 text-clay">Sin stock disponible</p>
      </div>
    </div>

    <!-- PRODUCTOS SIMILARES (misma categoría) -->
    <section v-if="similares.length" class="mt-24 md:mt-32">
      <h2 v-reveal:up class="text-2xl md:text-3xl font-light tracking-tight mb-10">Productos similares</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
        <ProductCard
          v-for="(p, i) in similares"
          :key="p.id"
          v-reveal:up="(i % 4) * 80"
          :producto="p"
        />
      </div>
    </section>

    <!-- SUGERENCIA DE OTRA CATEGORÍA -->
    <section v-if="otraCategoria.items.length" class="mt-20 md:mt-28">
      <div v-reveal:up class="flex items-end justify-between mb-10">
        <div>
          <p class="text-[11px] uppercase tracking-widest2 text-clay mb-2">También te puede gustar</p>
          <h2 class="text-2xl md:text-3xl font-light tracking-tight">{{ otraCategoria.categoria }}</h2>
        </div>
        <NuxtLink
          :to="`/tienda?categoria=${encodeURIComponent(otraCategoria.categoria)}`"
          class="text-[11px] uppercase tracking-widest2 text-clay hover:text-ink transition-colors whitespace-nowrap"
        >Ver todo →</NuxtLink>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
        <ProductCard
          v-for="(p, i) in otraCategoria.items"
          :key="p.id"
          v-reveal:up="(i % 4) * 80"
          :producto="p"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
